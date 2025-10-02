import React, { useEffect, useState } from 'react';
import { getAllServices, getAllServiceStages } from "@/pages/managers/ConfigPage/renderSections/hook/use_services_stage.jsx";
import { getAllBridge } from "@/pages/managers/ConfigPage/renderSections/hook/use_bridge_services_stage_and_list_mini_service.jsx";
import { CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils"; // Hàm tiện ích để kết hợp Tailwind classes
import { AlertTriangle, XCircle, Info } from 'lucide-react'; // Thêm icons cho phần lỗi

// --- 1. SKELETON LOADER (Đã tối ưu Responsive và Dark Mode) ---
const SkeletonLoader = () => (
  <div className="overflow-x-auto w-full p-2 sm:p-4 bg-background dark:bg-slate-950 admin-dark:bg-slate-950 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/20 admin-dark:shadow-black/20 border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800">
    <div className="overflow-auto rounded-lg border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800">

      {/* Thiết lập min-width để kích hoạt cuộn ngang trên mobile */}
      <div className="w-full border-collapse min-w-[700px] md:min-w-[900px] animate-pulse">

        {/* Skeleton Header */}
        <div className="sticky top-0 z-20">
          {/* Hàng 1: Giai đoạn */}
          <div className="border-b-2 border-slate-300 dark:border-slate-700 flex">
            {/* Cột cố định: Danh mục */}
            <div className="py-3 px-3 sm:py-4 sm:px-4 bg-slate-100 dark:bg-slate-900 admin-dark:bg-slate-900 sticky left-0 z-30 w-[150px] sm:w-[200px] min-w-[150px] sm:min-w-[200px]">
              <div className="h-6 sm:h-7 bg-slate-200 dark:bg-slate-700 rounded w-full sm:w-3/4"></div>
            </div>
            {/* Các cột Giai đoạn */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-3 px-3 sm:py-4 sm:px-4 border-l border-slate-200 dark:border-slate-800 admin-dark:border-slate-800 bg-slate-100 dark:bg-slate-900 admin-dark:bg-slate-900 min-w-[150px]">
                <div className="h-6 sm:h-7 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
          {/* Hàng 2: Tên Dịch vụ chi tiết */}
          <div className="bg-slate-50 dark:bg-slate-800/50 admin-dark:bg-slate-800/50 flex">
            {/* Cột cố định: Danh mục */}
            <div className="py-2 px-3 sm:py-3 sm:px-4 border-b border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 sticky left-0 z-30 w-[150px] sm:w-[200px] min-w-[150px] sm:min-w-[200px]">
              <div className="h-4 sm:h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
            {/* Các cột Tên Dịch vụ */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="py-2 px-2 sm:py-3 sm:px-4 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 min-w-[100px] md:min-w-[120px]">
                <div className="h-4 sm:h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Skeleton Body */}
        <div>
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {/* Cột cố định: Tên Danh mục */}
              <div className="py-2 px-3 sm:py-3 sm:px-4 border-b border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 sticky left-0 z-10 bg-white dark:bg-slate-800/50 admin-dark:bg-slate-800/50 w-[150px] sm:w-[200px] min-w-[150px] sm:min-w-[200px]">
                <div className="h-4 sm:h-5 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              </div>
              {/* Các ô dữ liệu */}
              {[...Array(6)].map((_, cellIndex) => (
                <div key={cellIndex} className="py-2 px-2 sm:py-3 sm:px-4 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 flex justify-center items-center min-w-[100px] md:min-w-[120px]">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    <p className="mt-4 text-center text-xs text-gray-500 admin-dark:text-gray-400 md:hidden">
      ⬅️ Kéo sang ngang để xem toàn bộ bảng dịch vụ.
    </p>
  </div>
);

// --- 2. COMPONENT CHÍNH ---

const ServiceTable = () => {
  const [servicesData, setServicesData] = useState([]);
  const [serviceDetailsData, setServiceDetailsData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchDataServiceStage = async () => {
    // ... (logic fetch data giữ nguyên)
    try {
      setLoading(true);
      setError(null);

      const [stageResult, serviceResult, bridgeResult] = await Promise.all([
        getAllServiceStages(), // stageData
        getAllServices(),      // serviceDetailsData
        getAllBridge(),        // servicesData
      ]);

      if (!Array.isArray(stageResult) || !Array.isArray(serviceResult) || !Array.isArray(bridgeResult)) {
        throw new Error('Dữ liệu từ BE không đúng định dạng mảng');
      }

      setServicesData(bridgeResult);
      setServiceDetailsData(serviceResult);
      setStageData(stageResult);
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
    // ... (logic fetch data giữ nguyên)
  };

  useEffect(() => {
    fetchDataServiceStage();
  }, [retryCount]);

  // Lấy danh sách title_vi duy nhất (Hàng)
  const uniqueTitles = [...new Set(servicesData.map(item => item?.title_vi).filter(Boolean))];

  // Lấy danh sách dịch vụ kèm stage (Cột)
  const uniqueServices = serviceDetailsData
    .filter(item => item?.id && item?.translation?.ten_dich_vu)
    .map(item => {
      const stageInfo = stageData.find(s => Number(s?.service_id) === Number(item.id));
      if (!stageInfo) return null;
      return {
        id: Number(item.id),
        ten_dich_vu: item.translation.ten_dich_vu,
        stage_id: stageInfo.stage_id,
        stage: stageInfo.stage_title_vi,
      };
    })
    .filter(Boolean);

  // Nhóm dịch vụ theo stage
  const stages = [...new Set(stageData.map(item => item?.stage_title_vi).filter(Boolean))];

  const servicesByStage = stages.map(stage => ({
    stage,
    services: uniqueServices.filter(service => service.stage === stage),
  }));

  // Hàm kiểm tra
  const isServiceProvided = (serviceId, titleVi) => {
    return servicesData.some(
      item => Number(item?.service_id) === Number(serviceId) && item?.title_vi === titleVi
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  // --- 3. HIỂN THỊ LỖI KHI FETCH API ---
  if (error) {
    return (
      <div className="text-center py-6 px-4 bg-red-100 border border-red-400 rounded-lg max-w-lg mx-auto my-10 admin-dark:bg-gray-800 admin-dark:border-red-800">
        <XCircle className="w-8 h-8 text-red-600 mx-auto mb-3 admin-dark:text-red-400" />
        <p className="text-red-700 font-medium admin-dark:text-red-400">{error}</p>
      </div>
    );
  }

  // --- 4. HIỂN THỊ LỖI THIẾU DỮ LIỆU CỐT LÕI (Từ Gợi ý 1 - Dark Mode) ---
  if (!servicesData.length || !serviceDetailsData.length || !stageData.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-xl shadow-lg border-2 border-red-300 max-w-md mx-auto my-10
                      admin-dark:bg-gray-800 admin-dark:border-red-900 admin-dark:shadow-2xl admin-dark:shadow-black/50">

        <AlertTriangle className="w-10 h-10 text-red-500 mb-4 admin-dark:text-red-400" />

        <h3 className="text-xl font-semibold text-gray-800 mb-2 admin-dark:text-white">
          Không tìm thấy dữ liệu dịch vụ
        </h3>
        <p className="text-gray-600 mb-6 text-center text-sm admin-dark:text-gray-400">
          Trang này cần có đầy đủ dữ liệu cấu hình để hiển thị.
        </p>

        <ul className="space-y-3 w-full px-2 sm:px-4">
          {!stageData.length && (
            <li className="flex items-center text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-400 shadow-sm admin-dark:text-yellow-200 admin-dark:bg-gray-700 admin-dark:border-yellow-600">
              <span className="text-yellow-500 font-bold mr-3 text-lg admin-dark:text-yellow-400">⚠️</span>
              Chưa cấu hình **Giai đoạn Dịch vụ** (Stage Data).
            </li>
          )}
          {!servicesData.length && (
            <li className="flex items-center text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-400 shadow-sm admin-dark:text-red-200 admin-dark:bg-gray-700 admin-dark:border-red-600">
              <span className="text-red-500 font-bold mr-3 text-lg admin-dark:text-red-400">❌</span>
              Danh sách **Hạng mục được dịch vụ chọn** (Services Data) trống.
            </li>
          )}
          {!serviceDetailsData.length && (
            <li className="flex items-center text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-400 shadow-sm admin-dark:text-red-200 admin-dark:bg-gray-700 admin-dark:border-red-600">
              <span className="text-red-500 font-bold mr-3 text-lg admin-dark:text-red-400">❌</span>
              Không tìm thấy **Dịch vụ** nào (Service Details).
            </li>
          )}
        </ul>
      </div>
    );
  }

  // --- 5. HIỂN THỊ LỖI DỮ LIỆU KHÔNG HỢP LỆ (Từ Gợi ý 2 - Dark Mode) ---
  if (!uniqueTitles.length || !uniqueServices.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-xl shadow-2xl border-t-4 border-orange-500 max-w-md mx-auto my-10
                    admin-dark:bg-gray-800 admin-dark:border-orange-600 admin-dark:shadow-2xl admin-dark:shadow-black/50">

        <Info className="w-10 h-10 text-orange-500 mb-4 admin-dark:text-orange-400" />

        <h3 className="text-xl font-semibold text-orange-600 mb-2 admin-dark:text-orange-400">
          Lỗi Cấu trúc Dữ liệu!
        </h3>
        <p className="text-gray-600 mb-6 text-center text-sm admin-dark:text-gray-400">
          Dữ liệu đã tải nhưng thiếu các trường bắt buộc để hiển thị nội dung.
        </p>

        <div className="w-full text-left bg-orange-50 p-4 rounded-lg admin-dark:bg-gray-700">
          <p className="font-medium mb-2 text-orange-700 admin-dark:text-orange-300">Chi tiết vấn đề:</p>
          <ul className="space-y-2 text-sm text-gray-700 list-none admin-dark:text-gray-300">
            {!uniqueTitles.length && (
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 mt-1">●</span>
                Thiếu trường **Tiêu đề Hạng mục** (ví dụ: `title_vi`).
              </li>
            )}
            {!uniqueServices.length && (
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 mt-1">●</span>
                Thiếu trường **Bản dịch Tên Dịch vụ** (ví dụ: `translation.ten_dich_vu`).
              </li>
            )}
          </ul>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center admin-dark:text-gray-500">
          Vui lòng kiểm tra lại cấu hình API hoặc cấu trúc dữ liệu trả về.
        </p>
      </div>
    );
  }

  // --- 6. HIỂN THỊ BẢNG DỮ LIỆU (Đã tối ưu Responsive và Dark Mode) ---
  return (
    <div className={cn("overflow-x-auto w-full p-2 sm:p-4 bg-background dark:bg-slate-950 admin-dark:bg-slate-950 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/20 admin-dark:shadow-black/20 border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800", !loading && "animate-fade-in")}>

      <div className="max-h-[70vh] overflow-auto rounded-lg border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800">

        {/* Thiết lập min-width để đảm bảo cuộn ngang trên màn hình nhỏ */}
        <table className="w-full border-collapse min-w-[700px] table-auto md:min-w-[900px]">

          <thead className="text-sm sticky top-0 z-20">
            {/* Hàng 1: Giai đoạn (Stage) */}
            <tr className="border-b-2 border-slate-300 dark:border-slate-700 admin-dark:border-slate-700">
              {/* Cột Danh mục cố định (sticky) */}
              <th className="py-2 px-3 text-left font-bold text-sm md:text-base text-slate-500 dark:text-slate-400 admin-dark:text-slate-400 bg-slate-100 dark:bg-slate-900 admin-dark:bg-slate-900 sticky left-0 z-40 w-[150px] min-w-[150px] sm:w-[200px] sm:min-w-[200px]">
                Giai đoạn
              </th>
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
                      "border-b-4 py-2 px-2 border-l border-slate-200 dark:border-slate-800 admin-dark:border-slate-800 text-center font-bold text-sm md:text-base bg-slate-100 dark:bg-slate-900 admin-dark:bg-slate-900",
                      colorClass
                    )}
                  >
                    {stage}
                  </th>
                )
              })}
            </tr>
            {/* Hàng 2: Tên Dịch vụ chi tiết (Service Name) */}
            <tr className="bg-slate-50 dark:bg-slate-800/50 admin-dark:bg-slate-800/50">
              {/* Cột Danh mục cố định (sticky) */}
              <th className="py-2 px-3 border-b border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 text-left font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-400 admin-dark:text-slate-400 sticky left-0 z-30 bg-slate-50 dark:bg-slate-800 admin-dark:bg-slate-800 w-[150px] min-w-[150px] sm:w-[200px] sm:min-w-[200px]">Danh mục</th>

              {servicesByStage.map(({ stage, services }) =>
                services.length > 0 ? (
                  services.map(service => (
                    <th
                      key={service.id}
                      className="py-2 px-1 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 text-center font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 admin-dark:text-slate-300 min-w-[100px] md:min-w-[120px]"
                    >
                      {service.ten_dich_vu}
                    </th>
                  ))
                ) : (
                  <th key={`${stage}-empty`} className="py-2 px-3 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 min-w-[100px] md:min-w-[120px]"></th>
                )
              )}
            </tr>
          </thead>

          <tbody className="text-sm">
            {uniqueTitles.map(title => (
              <tr key={title} className="hover:bg-slate-50 dark:hover:bg-gray-700/30 admin-dark:hover:bg-gray-700/30 transition-colors duration-150">
                {/* Cột Danh mục cố định (sticky) */}
                <td className="py-2 px-3 border-b border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 admin-dark:text-slate-200 sticky left-0 z-10 bg-white/80 dark:bg-slate-800/80 admin-dark:bg-slate-800/80 backdrop-blur-sm w-[150px] min-w-[150px] sm:w-[200px] sm:min-w-[200px]">
                  {title}
                </td>
                {servicesByStage.map(({ stage, services }) =>
                  services.length > 0 ? (
                    services.map(service => (
                      <td key={service.id}
                        className="py-2 px-1 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 text-center min-w-[100px] md:min-w-[120px]">
                        {isServiceProvided(service.id, title) ? (
                          <div className="flex justify-center">
                            {/* Icon CheckCircle nhỏ hơn trên mobile */}
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 admin-dark:text-indigo-400" />
                          </div>
                        ) : ''}
                      </td>
                    ))
                  ) : (
                    <td key={`${stage}-empty`} className="py-2 px-1 border-b border-l border-slate-200 dark:border-slate-700 admin-dark:border-slate-700 min-w-[100px] md:min-w-[120px]"></td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hướng dẫn cuộn ngang cho Mobile */}
      <p className="mt-4 text-center text-xs text-gray-500 admin-dark:text-gray-400 md:hidden">
        ⬅️ Kéo sang ngang để xem toàn bộ bảng dịch vụ.
      </p>
    </div>
  );
};

export default ServiceTable;