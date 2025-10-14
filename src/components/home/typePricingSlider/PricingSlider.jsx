import React from "react";
import { useServiceData } from "./hooks/useServiceData";
import SkeletonLoader from "./components/SkeletonLoader";
import ErrorState from "./components/ErrorState";
import MissingDataState from "./components/MissingDataState";
import InvalidDataState from "./components/InvalidDataState";
import PricingTable from "./components/PricingTable";

const ServiceTable = () => {
  const {
    servicesData,
    serviceDetailsData,
    stageData,
    loading,
    error,
    retry,
  } = useServiceData();

  // --- Data Processing ---
  const uniqueTitles = [
    ...new Set(servicesData.map((item) => item?.title_vi).filter(Boolean)),
  ];

  const uniqueServices = serviceDetailsData
    .filter((item) => item?.id && item?.translation?.ten_dich_vu)
    .map((item) => {
      const stageInfo = stageData.find(
        (s) => Number(s?.service_id) === Number(item.id)
      );
      if (!stageInfo) return null;
      return {
        id: Number(item.id),
        ten_dich_vu: item.translation.ten_dich_vu,
        stage_id: stageInfo.stage_id,
        stage: stageInfo.stage_title_vi,
      };
    })
    .filter(Boolean);

  const stages = [
    ...new Set(stageData.map((item) => item?.stage_title_vi).filter(Boolean)),
  ];

  const servicesByStage = stages.map((stage) => ({
    stage,
    services: uniqueServices.filter((service) => service.stage === stage),
  }));

  const isServiceProvided = (serviceId, titleVi) => {
    return servicesData.some(
      (item) =>
        Number(item?.service_id) === Number(serviceId) &&
        item?.title_vi === titleVi
    );
  };

  // --- Render Logic ---
  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  if (!servicesData.length || !serviceDetailsData.length || !stageData.length) {
    return (
      <MissingDataState
        stageData={stageData}
        servicesData={servicesData}
        serviceDetailsData={serviceDetailsData}
      />
    );
  }

  if (!uniqueTitles.length || !uniqueServices.length) {
    return (
      <InvalidDataState
        uniqueTitles={uniqueTitles}
        uniqueServices={uniqueServices}
      />
    );
  }

  return (
    <PricingTable
      uniqueTitles={uniqueTitles}
      servicesByStage={servicesByStage}
      isServiceProvided={isServiceProvided}
    />
  );
};

export default ServiceTable;