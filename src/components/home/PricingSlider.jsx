import React, { useEffect, useState } from 'react';
import { getAllServices, getAllServiceStages } from "@/pages/managers/ConfigPage/renderSections/hook/use_services_stage.jsx";
import { getAllBridge } from "@/pages/managers/ConfigPage/renderSections/hook/use_bridge_services_stage_and_list_mini_service.jsx";
import { CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

const SkeletonLoader = () => (
  <div className="overflow-x-auto w-full p-2 sm:p-4 bg-background dark:bg-slate-950 admin-dark:bg-slate-950 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/20 admin-dark:shadow-black/20 border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800">
    <div className="max-h-[70vh] overflow-auto rounded-lg border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800">
      <div className="w-full border-collapse min-w-[1200px] animate-pulse">
        {/* Skeleton Header */}
        <div className="sticky top-0 z-20">
          <div className="border-b-2 border-slate-300 dark:border-slate-700 flex">
            <div className="py-4 px-4 bg-slate-100 dark:bg-slate-900 sticky left-0 z-30 w-[250px]">
              <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-4 px-4 border-l border-slate-200 dark:border-slate-800 admin-dark:border-slate-800 bg-slate-100 dark:bg-slate-900 admin-dark:bg-slate-900" style={{ flex: `0 0 ${300 + i * 50}px` }}>
                <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 admin-dark:bg-slate-800/50 flex">
            <div className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 sticky left-0 z-30 w-[250px]">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="py-3 px-4 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700" style={{ flex: `0 0 150px` }}>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Skeleton Body */}
        <div>
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex">
              <div className="py-3 px-4 border-b border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 sticky left-0 z-10 bg-white dark:bg-slate-800/50 admin-dark:bg-slate-800/50 w-[250px]"><div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full"></div></div>
              {[...Array(6)].map((_, cellIndex) => (
                <div key={cellIndex} className="py-3 px-4 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 flex justify-center items-center" style={{ flex: `0 0 150px` }}><div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full"></div></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ServiceTable = () => {
  const [servicesData, setServicesData] = useState([]);
  const [serviceDetailsData, setServiceDetailsData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchDataServiceStage = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stageResult, serviceResult, bridgeResult] = await Promise.all([
        getAllServiceStages(), // stageData
        getAllServices(),      // serviceDetailsData
        getAllBridge(),        // servicesData
      ]);

      // Log dữ liệu để debug
      console.log('stageResult:', stageResult);
      console.log('serviceResult:', serviceResult);
      console.log('bridgeResult:', bridgeResult);

      // Kiểm tra dữ liệu
      if (!Array.isArray(stageResult) || !Array.isArray(serviceResult) || !Array.isArray(bridgeResult)) {
        throw new Error('Dữ liệu từ BE không đúng định dạng mảng');
      }

      // Kiểm tra các trường cần thiết
      if (bridgeResult.length > 0 && !bridgeResult[0].title_vi) {
        console.warn('bridgeResult thiếu trường title_vi ở một số bản ghi');
      }
      if (serviceResult.length > 0 && !serviceResult[0].translation?.ten_dich_vu) {
        console.warn('serviceResult thiếu trường translation.ten_dich_vu ở một số bản ghi');
      }
      if (stageResult.length > 0 && !stageResult[0].stage_id) {
        console.warn('stageResult thiếu trường stage ở một số bản ghi');
      }

      // Gán đúng dữ liệu
      setServicesData(bridgeResult);        // Chứa title_vi
      setServiceDetailsData(serviceResult); // Chứa translation.ten_dich_vu
      setStageData(stageResult);            // Chứa stage
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(fetchDataServiceStage, 2000); // Thử lại sau 2 giây
      } else {
        setError("Không thể tải dữ liệu sau nhiều lần thử. Vui lòng kiểm tra kết nối hoặc liên hệ quản trị viên.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataServiceStage();
  }, [retryCount]);

  // Lấy danh sách title_vi duy nhất
  const uniqueTitles = [...new Set(servicesData.map(item => item?.title_vi).filter(Boolean))];
  console.log('uniqueTitles:', uniqueTitles);

  // Lấy danh sách dịch vụ (translation.ten_dich_vu) duy nhất
  const uniqueServices = serviceDetailsData
    .filter(item => item?.id && item?.translation?.ten_dich_vu)
    .map(item => {
      const stageInfo = stageData.find(s => Number(s?.service_id) === Number(item.id));
      if (!stageInfo) return null; // nếu service không có stage thì bỏ qua
      return {
        id: Number(item.id),
        ten_dich_vu: item.translation.ten_dich_vu,
        stage_id: stageInfo.stage_id,
        stage: stageInfo.stage_title_vi,
      };
    })
    .filter(Boolean); // bỏ null


  console.log('uniqueServices:', uniqueServices);

  // Nhóm dịch vụ theo stage
  const stages = [...new Set(stageData.map(item => item?.stage_title_vi).filter(Boolean))];

  const servicesByStage = stages.map(stage => ({
    stage,
    services: uniqueServices.filter(service => service.stage === stage),
  }));

  console.log('servicesByStage:', servicesByStage);

  // Hàm kiểm tra xem dịch vụ có cung cấp title_vi không
  const isServiceProvided = (serviceId, titleVi) => {
    return servicesData.some(
      item => Number(item?.service_id) === Number(serviceId) && item?.title_vi === titleVi
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!servicesData.length || !serviceDetailsData.length || !stageData.length) {
    return (
      <div className="text-center py-4">
        Không có dữ liệu để hiển thị. Vui lòng kiểm tra:
        <ul className="list-disc list-inside text-left max-w-md mx-auto">
          {!servicesData.length && <li>Dữ liệu bridge rỗng</li>}
          {!serviceDetailsData.length && <li>Dữ liệu services rỗng</li>}
          {!stageData.length && <li>Dữ liệu service_stages rỗng</li>}
        </ul>
      </div>
    );
  }

  if (!uniqueTitles.length || !uniqueServices.length) {
    return (
      <div className="text-center py-4">
        Dữ liệu không hợp lệ. Vui lòng kiểm tra:
        <ul className="list-disc list-inside text-left max-w-md mx-auto">
          {!uniqueTitles.length && <li>Không tìm thấy title_vi trong bridge</li>}
          {!uniqueServices.length && <li>Không tìm thấy translation.ten_dich_vu trong services</li>}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto w-full p-2 sm:p-4 bg-background dark:bg-slate-950 admin-dark:bg-slate-950 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/20 admin-dark:shadow-black/20 border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800", !loading && "animate-fade-in")}>
      <div className="max-h-[70vh] overflow-auto rounded-lg border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800">
        <table className="w-full border-collapse table-fixed">
          <thead className="text-sm sticky top-0 z-20">
            <tr className="border-b-2 border-slate-300 dark:border-slate-700 admin-dark:border-slate-700">
              <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-bold text-sm md:text-base text-slate-500 dark:text-slate-400 admin-dark:text-slate-400 bg-slate-100 dark:bg-slate-900 admin-dark:bg-slate-900 sticky left-0 z-40 w-[150px] sm:w-[200px] min-w-[150px] sm:min-w-[200px]">Giai đoạn</th>
              {servicesByStage.map(({ stage, services }, index) => {
                const stageColors = [
                  "border-b-blue-500 text-blue-600 dark:border-b-blue-400 dark:text-blue-400 admin-dark:border-b-blue-400 admin-dark:text-blue-400",
                  "border-b-green-500 text-green-600 dark:border-b-green-400 dark:text-green-400 admin-dark:border-b-green-400 admin-dark:text-green-400",
                  "border-b-purple-500 text-purple-600 dark:border-b-purple-400 dark:text-purple-400 admin-dark:border-b-purple-400 admin-dark:text-purple-400",
                  "border-b-orange-500 text-orange-600 dark:border-b-orange-400 dark:text-orange-400 admin-dark:border-b-orange-400 admin-dark:text-orange-400",
                ];
                const colorClass = stageColors[index % stageColors.length];

                return (
                  <th
                    key={stage}
                    colSpan={services.length || 1}
                    className={cn(
                      "border-b-2 py-2 px-3 sm:py-3 sm:px-4 border-l border-slate-200 dark:border-slate-800 admin-dark:border-slate-800 text-center font-bold text-sm md:text-base bg-slate-100 dark:bg-slate-900 admin-dark:bg-slate-900",
                      colorClass, "border-b-4"
                    )}
                  >
                    {stage}
                  </th>
                )
              })}
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800/50 admin-dark:bg-slate-800/50">
              <th className="py-2 px-3 sm:px-4 border-b border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 text-left font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-400 admin-dark:text-slate-400 sticky left-0 z-30 bg-slate-50 admin-dark:bg-slate-800 dark:bg-slate-800 w-[150px] sm:w-[200px] min-w-[150px] sm:min-w-[200px]">Danh mục</th>
              {servicesByStage.map(({ stage, services }) =>
                services.length > 0 ? (
                  services.map(service => (
                    <th
                      key={service.id}
                      className="py-2 px-2 sm:px-4 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 text-center font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 admin-dark:text-slate-300 min-w-[120px] sm:min-w-[150px]"
                    >
                      {service.ten_dich_vu}
                    </th>
                  ))
                ) : (
                  // Render một ô trống nếu không có dịch vụ
                  <th key={`${stage}-empty`} className="py-3 px-4 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700"></th>
                )
              )}
            </tr>
          </thead>
          <tbody className="text-sm">
            {uniqueTitles.map(title => (
              <tr key={title} className="hover:bg-slate-50 dark:hover:bg-gray-700/30 admin-dark:hover:bg-gray-700/30 transition-colors duration-150">
                <td className="py-2 px-3 sm:py-3 sm:px-4 border-b border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 admin-dark:text-slate-200 sticky left-0 z-10 bg-white/80 dark:bg-slate-800/80 admin-dark:bg-slate-800/80 backdrop-blur-sm w-[150px] sm:w-[200px] min-w-[150px] sm:min-w-[200px]">
                  {title}
                </td>
                {servicesByStage.map(({ stage, services }) =>
                  services.length > 0 ? (
                    services.map(service => (
                      <td key={service.id} className="py-2 px-3 sm:py-3 sm:px-4 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 text-center">
                        {isServiceProvided(service.id, title) ? (
                          <div className="flex justify-center">
                            <CheckCircle className="w-5 h-5 text-primary dark:text-indigo-400 admin-dark:text-indigo-400" />
                          </div>
                        ) : ''}
                      </td>
                    ))
                  ) : (
                    // Render một ô trống nếu không có dịch vụ
                    <td key={`${stage}-empty`} className="py-3 px-4 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700"></td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;