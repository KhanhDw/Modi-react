import React, { useEffect, useState } from "react";
import {
  getAllServices,
  getAllServiceStages,
} from "@/pages/managers/ConfigPage/renderSections/hook/use_services_stage.jsx";
import { getAllBridge } from "@/pages/managers/ConfigPage/renderSections/hook/use_bridge_services_stage_and_list_mini_service.jsx";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. ENHANCED SKELETON LOADER ---
const SkeletonLoader = () => (
  <div className="hidden md:block overflow-x-auto w-full p-3 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/60">
    <div className="overflow-auto rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
      <div className="w-full border-collapse min-w-[700px] md:min-w-[900px]">
        {/* Skeleton Header */}
        <div className="sticky top-0 z-20">
          {/* Stage Row */}
          <div className="border-b-2 border-slate-300/50 dark:border-slate-600/50 flex backdrop-blur-sm">
            <div className="py-4 px-4 sm:py-5 sm:px-6 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 sticky left-0 z-30 w-[120px] sm:w-[180px] min-w-[120px] sm:min-w-[180px] border-r border-slate-200 dark:border-slate-700">
              <div className="h-7 sm:h-8 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg w-3/4 animate-pulse"></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="py-4 px-4 sm:py-5 sm:px-6 border-l border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 min-w-[160px]"
              >
                <div className="h-7 sm:h-8 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg w-2/3 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
          {/* Service Name Row */}
          <div className="bg-slate-50/80 dark:bg-slate-800/40 flex backdrop-blur-sm">
            <div className="py-3 px-4 sm:py-4 sm:px-6 border-b sticky left-0 z-30 w-[120px] sm:w-[180px] min-w-[120px] sm:min-w-[180px] border-r border-slate-200 dark:border-slate-700">
              <div className="h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2 animate-pulse"></div>
            </div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="py-3 px-3 sm:py-4 sm:px-4 border-b border-l border-slate-200/60 dark:border-slate-600/60 min-w-[110px] md:min-w-[130px]"
              >
                <div className="h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-4/5 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Skeleton Body */}
        <div>
          {[...Array(5)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
            >
              <div className="py-3 px-4 sm:py-4 sm:px-6 border-b sticky left-0 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm w-[120px] sm:w-[180px] min-w-[120px] sm:min-w-[180px] border-r border-slate-200 dark:border-slate-700">
                <div className="h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-full animate-pulse"></div>
              </div>
              {[...Array(6)].map((_, cellIndex) => (
                <div
                  key={cellIndex}
                  className="py-3 px-3 sm:py-4 sm:px-4 border-b border-l border-slate-200/60 dark:border-slate-600/60 flex justify-center items-center min-w-[110px] md:min-w-[130px]"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <span className="ml-2 font-medium">Đang tải dữ liệu...</span>
    </div>
    <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500 md:hidden flex items-center justify-center gap-2">
      <span className="text-base">👉</span>
      <span>Vuốt sang ngang để xem toàn bộ bảng</span>
    </p>
  </div>
);

// --- 2. MAIN COMPONENT ---
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
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(fetchDataServiceStage, 2000);
      } else {
        setError(
          "Không thể tải dữ liệu sau nhiều lần thử. Vui lòng kiểm tra kết nối hoặc liên hệ quản trị viên."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataServiceStage();
  }, [retryCount]);

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

  if (loading) {
    return <SkeletonLoader />;
  }

  // --- 3. ENHANCED ERROR STATE (API FETCH) ---
  if (error) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center p-8 sm:p-10 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-xl max-w-lg mx-auto my-10">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/10 rounded-full blur-xl"></div>
          <XCircle
            className="relative w-16 h-16 text-red-600 dark:text-red-400 mb-4"
            strokeWidth={1.5}
          />
        </div>
        <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">
          Không thể tải dữ liệu
        </h3>
        <p className="text-red-600/90 dark:text-red-400/90 text-center leading-relaxed mb-6 max-w-md">
          {error}
        </p>
        <button
          onClick={() => {
            setRetryCount(0);
            fetchDataServiceStage();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
      </div>
    );
  }

  // --- 4. ENHANCED MISSING DATA STATE ---
  if (!servicesData.length || !serviceDetailsData.length || !stageData.length) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center p-8 sm:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl shadow-xl border-2 border-amber-200 dark:border-amber-800 max-w-2xl mx-auto my-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-2xl"></div>
          <AlertTriangle
            className="relative w-16 h-16 text-amber-600 dark:text-amber-400"
            strokeWidth={1.5}
          />
        </div>

        <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-3">
          Thiếu dữ liệu cấu hình
        </h3>
        <p className="text-amber-700/90 dark:text-amber-400/90 mb-8 text-center max-w-md leading-relaxed">
          Hệ thống cần đầy đủ dữ liệu để hiển thị bảng dịch vụ. Vui lòng kiểm
          tra các mục sau:
        </p>

        <div className="space-y-3 w-full max-w-md">
          {!stageData.length && (
            <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-amber-300 dark:border-amber-700 shadow-sm">
              <span className="text-2xl mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Giai đoạn Dịch vụ
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Chưa cấu hình Stage Data
                </p>
              </div>
            </div>
          )}
          {!servicesData.length && (
            <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-amber-300 dark:border-amber-700 shadow-sm">
              <span className="text-2xl mt-0.5">❌</span>
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Hạng mục Dịch vụ
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Danh sách Services Data trống
                </p>
              </div>
            </div>
          )}
          {!serviceDetailsData.length && (
            <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-amber-300 dark:border-amber-700 shadow-sm">
              <span className="text-2xl mt-0.5">❌</span>
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Chi tiết Dịch vụ
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Không tìm thấy Service Details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 5. ENHANCED INVALID DATA STATE ---
  if (!uniqueTitles.length || !uniqueServices.length) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center p-8 sm:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-800 max-w-2xl mx-auto my-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-2xl"></div>
          <Info
            className="relative w-16 h-16 text-blue-600 dark:text-blue-400"
            strokeWidth={1.5}
          />
        </div>

        <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-3">
          Lỗi cấu trúc dữ liệu
        </h3>
        <p className="text-blue-700/90 dark:text-blue-400/90 mb-8 text-center max-w-md leading-relaxed">
          Dữ liệu đã được tải nhưng thiếu các trường bắt buộc để hiển thị nội
          dung.
        </p>

        <div className="w-full max-w-md bg-white/60 dark:bg-slate-800/40 p-6 rounded-xl border border-blue-300 dark:border-blue-700">
          <p className="font-bold text-blue-900 dark:text-blue-200 mb-4 text-lg">
            Chi tiết vấn đề:
          </p>
          <ul className="space-y-3">
            {!uniqueTitles.length && (
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl mt-0.5">
                  •
                </span>
                <span className="text-blue-800 dark:text-blue-300 leading-relaxed">
                  Thiếu trường{" "}
                  <code className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded font-mono text-sm">
                    title_vi
                  </code>{" "}
                  trong dữ liệu hạng mục
                </span>
              </li>
            )}
            {!uniqueServices.length && (
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl mt-0.5">
                  •
                </span>
                <span className="text-blue-800 dark:text-blue-300 leading-relaxed">
                  Thiếu trường{" "}
                  <code className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded font-mono text-sm">
                    translation.ten_dich_vu
                  </code>{" "}
                  trong dữ liệu dịch vụ
                </span>
              </li>
            )}
          </ul>
        </div>

        <p className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-6 text-center">
          Vui lòng kiểm tra lại cấu hình API hoặc cấu trúc dữ liệu trả về
        </p>
      </div>
    );
  }

  // --- 6. ENHANCED TABLE DISPLAY ---
  return (
    <div className="hidden md:block overflow-x-auto w-full p-3 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60 animate-fade-in">
      <div className="max-h-[75vh] overflow-auto rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
        <table className="w-full border-collapse min-w-[700px] table-auto md:min-w-[900px]">
          <thead className="text-sm sticky top-0 z-20">
            {/* Stage Row */}
            <tr className="border-b-2 border-slate-300/50 dark:border-slate-600/50">
              <th className="py-4 px-4 sm:py-5 sm:px-6 text-left font-bold text-base md:text-lg text-slate-700 dark:text-slate-300 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 sticky left-0 z-40 w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] border-r border-slate-200 dark:border-slate-700 shadow-sm">
                Giai đoạn
              </th>
              {servicesByStage.map(({ stage, services }, index) => {
                const stageStyles = [
                  {
                    border: "border-b-blue-500 dark:border-b-blue-400",
                    text: "text-blue-700 dark:text-blue-300",
                    bg: "bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
                  },
                  {
                    border: "border-b-emerald-500 dark:border-b-emerald-400",
                    text: "text-emerald-700 dark:text-emerald-300",
                    bg: "bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
                  },
                  {
                    border: "border-b-purple-500 dark:border-b-purple-400",
                    text: "text-purple-700 dark:text-purple-300",
                    bg: "bg-gradient-to-b from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20",
                  },
                  {
                    border: "border-b-orange-500 dark:border-b-orange-400",
                    text: "text-orange-700 dark:text-orange-300",
                    bg: "bg-gradient-to-b from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20",
                  },
                ];
                const style = stageStyles[index % stageStyles.length];

                return (
                  <th
                    key={stage}
                    colSpan={services.length || 1}
                    className={cn(
                      "border-b-4 py-4 px-3 sm:py-5 sm:px-4 border-l border-slate-200/60 dark:border-slate-700/60 text-center font-bold text-base md:text-lg ",
                      style.border,
                      style.text,
                      style.bg
                    )}
                  >
                    {stage}
                  </th>
                );
              })}
            </tr>
            {/* Service Name Row */}
            <tr className="bg-slate-50/90 dark:bg-slate-800/50 backdrop-blur-sm">
              <th className="py-3 px-4 sm:py-4 sm:px-6 border-b text-left font-semibold text-sm sm:text-base text-slate-600 dark:text-slate-400 sticky left-0 z-30 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] border-r border-slate-200 dark:border-slate-700 shadow-sm">
                Danh mục
              </th>

              {servicesByStage.map(({ stage, services }) =>
                services.length > 0 ? (
                  services.map((service) => (
                    <th
                      key={service.id}
                      className="py-3 px-2 sm:py-4 sm:px-3 border-b border-l border-slate-200/60 dark:border-slate-600/60 text-center font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 min-w-[110px] md:min-w-[130px] hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      {service.ten_dich_vu}
                    </th>
                  ))
                ) : (
                  <th
                    key={`${stage}-empty`}
                    className="py-3 px-2 sm:py-4 sm:px-3 border-b border-l border-slate-200/60 dark:border-slate-600/60 min-w-[110px] md:min-w-[130px]"
                  ></th>
                )
              )}
            </tr>
          </thead>

          <tbody className="text-sm">
            {uniqueTitles.map((title, idx) => (
              <tr
                key={title}
                className={cn(
                  "hover:bg-slate-100/60 dark:hover:bg-slate-700/30 transition-all duration-200 group",
                  idx % 2 === 0
                    ? "bg-white/50 dark:bg-slate-900/20"
                    : "bg-slate-50/30 dark:bg-slate-800/10"
                )}
              >
                <td className="py-3 px-4 sm:py-4 sm:px-6 border-b  text-left font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200 sticky left-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] border-r border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50 transition-colors">
                  {title}
                </td>
                {servicesByStage.map(({ stage, services }) =>
                  services.length > 0 ? (
                    services.map((service) => (
                      <td
                        key={service.id}
                        className="w-50 py-3 px-2 sm:py-4 sm:px-3 border-b border-l border-slate-200/60 dark:border-slate-600/60 text-center min-w-50 md:min-w-50"
                      >
                        {isServiceProvided(service.id, title) ? (
                          <div className="flex justify-center">
                            <div className="relative group/icon">
                              <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-full blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity"></div>
                              <CheckCircle
                                className="relative w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 group-hover/icon:scale-110 transition-transform duration-200"
                                strokeWidth={2}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700 text-xs">
                            —
                          </span>
                        )}
                      </td>
                    ))
                  ) : (
                    <td
                      key={`${stage}-empty`}
                      className="py-3 px-2 sm:py-4 sm:px-3 border-b border-l border-slate-200/60 dark:border-slate-600/60 min-w-[110px] md:min-w-[130px]"
                    ></td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 md:hidden">
        <span className="text-lg">👉</span>
        <span className="font-medium">
          Vuốt sang ngang để xem toàn bộ bảng dịch vụ
        </span>
      </div>
    </div>
  );
};

export default ServiceTable;