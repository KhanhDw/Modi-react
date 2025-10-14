import { useState, useEffect, useCallback } from "react";
import {
  getAllServices,
  getAllServiceStages,
} from "@/pages/managers/ConfigPage/renderSections/hook/use_services_stage.jsx";
import { getAllBridge } from "@/pages/managers/ConfigPage/renderSections/hook/use_bridge_services_stage_and_list_mini_service.jsx";

const MAX_RETRIES = 3;

export const useServiceData = () => {
  const [servicesData, setServicesData] = useState([]);
  const [serviceDetailsData, setServiceDetailsData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    for (let i = 0; i <= MAX_RETRIES; i++) {
      try {
        const [stageResult, serviceResult, bridgeResult] = await Promise.all([
          getAllServiceStages(),
          getAllServices(),
          getAllBridge(),
        ]);

        if (
          !Array.isArray(stageResult) ||
          !Array.isArray(serviceResult) ||
          !Array.isArray(bridgeResult)
        ) {
          throw new Error("Dữ liệu từ BE không đúng định dạng mảng");
        }

        setServicesData(bridgeResult);
        setServiceDetailsData(serviceResult);
        setStageData(stageResult);
        setLoading(false);
        return; // Success
      } catch (err) {
        console.error(`Attempt ${i + 1} failed:`, err);
        if (i < MAX_RETRIES) {
          await new Promise(res => setTimeout(res, 2000)); // Wait before retrying
        } else {
          setError("Không thể tải dữ liệu sau nhiều lần thử. Vui lòng kiểm tra kết nối hoặc liên hệ quản trị viên.");
          setLoading(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { servicesData, serviceDetailsData, stageData, loading, error, retry: fetchData };
};
