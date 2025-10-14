import React, { useEffect, useState, useRef, useCallback } from "react";
// ... (Các imports khác giữ nguyên)
import {
  getAllServices,
  getAllServiceStages,
} from "@/pages/managers/ConfigPage/renderSections/hook/use_services_stage.jsx";
import { getAllBridge } from "@/pages/managers/ConfigPage/renderSections/hook/use_bridge_services_stage_and_list_mini_service.jsx";

// Import các icon cần thiết
import {
  CheckCircle,
  AlertTriangle,
  Zap,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. CUSTOM HOOK: Giữ nguyên logic fetching ---
const useServiceData = () => {
  // ... (Giữ nguyên logic useServiceData)
  const [servicesData, setServicesData] = useState([]);
  const [serviceDetailsData, setServiceDetailsData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [stageResult, serviceResult, bridgeResult] = await Promise.all([
        getAllServiceStages(),
        getAllServices(),
        getAllBridge(),
      ]);

      if (!bridgeResult || !serviceResult || !stageResult) {
        throw new Error("Một hoặc nhiều nguồn dữ liệu trả về rỗng.");
      }

      setServicesData(bridgeResult);
      setServiceDetailsData(serviceResult);
      setStageData(stageResult);
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
      setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uniqueTitles = [
    ...new Set(servicesData.map((item) => item?.title_vi).filter(Boolean)),
  ];

  const uniqueServices = serviceDetailsData
    .map((item) => {
      if (!item?.id || !item?.translation?.ten_dich_vu) return null;
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
    .filter(Boolean)
    .sort((a, b) => a.stage_id - b.stage_id);

  const isServiceProvided = useCallback(
    (serviceId, titleVi) => {
      return servicesData.some(
        (item) =>
          Number(item?.service_id) === Number(serviceId) &&
          item?.title_vi === titleVi
      );
    },
    [servicesData]
  );

  return { loading, error, uniqueServices, uniqueTitles, isServiceProvided };
};

// --- 2. CÁC COMPONENT UI PHỤ: Giữ nguyên ---
const SkeletonLoader = () => (
  <div className="p-4 sm:p-6 bg-background dark:bg-slate-950 admin-dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 admin-dark:border-slate-800 max-w-4xl mx-auto animate-in fade-in duration-700">
    <div className="relative w-full sm:w-[85%] lg:w-80 mx-auto overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 p-6 h-[450px] animate-pulse">
      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center"
          >
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded-full mr-3 flex-shrink-0"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
      <div className="mt-8 h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
    </div>
    <p className="mt-4 text-center text-xs text-gray-500 admin-dark:text-gray-400">
      Đang tải dữ liệu...
    </p>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div
    className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-xl shadow-lg border-2 border-red-300 max-w-md mx-auto my-10
                     admin-dark:bg-gray-800 admin-dark:border-red-900 admin-dark:shadow-2xl admin-dark:shadow-black/50 animate-in fade-in zoom-in duration-500"
  >
    <AlertTriangle className="w-10 h-10 text-red-500 mb-4 admin-dark:text-red-400" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2 admin-dark:text-white">
      Dữ liệu không sẵn sàng
    </h3>
    <p className="text-gray-600 mb-6 text-center text-sm admin-dark:text-gray-400">
      Không thể tải cấu hình dịch vụ. Vui lòng kiểm tra lại kết nối hoặc cài
      đặt.
    </p>
    {error && (
      <p className="text-sm text-red-500 font-medium text-center">{error}</p>
    )}
  </div>
);

const EmptyServiceCard = () => (
  <div className="text-center py-8 px-4 flex flex-col items-center justify-center h-full bg-black/10 rounded-lg animate-in fade-in duration-500">
    <PackageOpen className="w-10 h-10 text-white/50 mx-auto mb-4" />
    <p className="text-base font-semibold text-white/80 mb-1">
      Chưa có hạng mục
    </p>
    <p className="text-sm text-white/60">
      Chưa có hạng mục nào được định nghĩa.
    </p>
  </div>
);

// --- 3. COMPONENT CARD DỊCH VỤ: Giữ nguyên (nhận prop index và currentIndex) ---
const ServiceCardMinimalist = ({
  maxHeight,
  cardRef,
  service,
  uniqueTitles,
  isServiceProvided,
  stageColor,
  index,
  currentIndex,
}) => {
  const isCurrent = index === currentIndex;

  return (
    <div
      className="py-3 px-2 flex-shrink-0 xs:w-70 sm:w-90 md:w-100 snap-center transition-all duration-500 ease-out"
      data-index={index}
      ref={cardRef}
    >
      <div
        className={cn(
          // THAY ĐỔI: Thêm shadow-inner shadow-black/20 để tạo chiều sâu
          "rounded-2xl shadow-lg **shadow-inner shadow-black/20** overflow-hidden flex flex-col p-4 sm:p-6  transition-all duration-500 ease-in-out will-change-transform",
          "animate-in fade-in slide-in-from-bottom-2 duration-700",
          isCurrent
            ? "scale-[1.03] shadow-2xl ring-4 ring-white/50"
            : "scale-100 opacity-80 hover:opacity-100"
        )}
        style={{
          animationDelay: `${index * 100}ms`,
          minHeight: maxHeight,
        }}
      >
        <div
          className={cn(
            "-z-1 absolute top-0 left-0 w-full h-[100%] ",
            stageColor.bg1Radius
          )}
        ></div>
        <div
          className={cn(
            "-z-1 absolute top-0 left-0 w-full h-[80%]  rounded-br-[80px]",
            stageColor.bg
          )}
        ></div>
        <div
          className={cn(
            "-z-1 absolute bottom-0 left-0 w-full h-[20%] ",
            stageColor.bgRadius
          )}
        ></div>
        <div
          className={cn(
            "-z-1 absolute bottom-0 left-0  w-full h-[20%] rounded-tl-[50px]",
            stageColor.bg1Radius
          )}
        ></div>

        {/* THAY ĐỔI: Chuyển text-white/90 thành text-white opacity-90 để tinh chỉnh */}
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 **text-white opacity-90** transition-opacity duration-300">
          {service.stage}
        </h3>

        <p className="text-lg md:text-xl font-black mb-4 sm:mb-6 text-white text-ellipsis overflow-hidden transition-opacity duration-300">
          {service.ten_dich_vu}
        </p>

        <div className="flex-grow w-full text-left overflow-hidden ">
          {uniqueTitles.length > 0 ? (
            <ul className="scrollbar-hide space-y-3 text-sm custom-scrollbar-white pr-2 transition-opacity duration-500">
              <style>{`.custom-scrollbar-white::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.4); }`}</style>
              {uniqueTitles.map((title, i) => {
                const provided = isServiceProvided(service.id, title);
                return (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center transition-all duration-300 ease-out",
                      provided
                        ? "text-white font-medium transform translate-x-0"
                        : "text-white/60 opacity-80 transform translate-x-1"
                    )}
                  >
                    {provided ? (
                      // THAY ĐỔI: CheckCircle icon thành màu xanh lá tươi hơn
                      <CheckCircle className="w-5 h-5 mr-3 **text-lime-300** flex-shrink-0 animate-in zoom-in duration-300" />
                    ) : (
                      // THAY ĐỔI: X icon thành màu đỏ đậm hơn và mờ hơn
                      <X className="w-5 h-5 mr-3 **text-red-400/80** flex-shrink-0 transition-transform duration-300" />
                    )}
                    <span>{title}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyServiceCard />
          )}
        </div>

        {/* THAY ĐỔI: Nút CTA tăng cường shadow và thêm ring khi hover */}
        <button className="mt-6 w-full bg-white/90 font-bold py-3 rounded-3xl hover:bg-white transition-all duration-300 **shadow-lg hover:shadow-2xl hover:ring-4 hover:ring-white/80** will-change-transform">
          <span
            className={cn(stageColor.text, "text-xs sm:text-sm font-bold uppercase")}
          >
            Xem chi tiết
          </span>
        </button>
      </div>
    </div>
  );
};

// --- 4. COMPONENT CHÍNH: Cải thiện logic Observer và Scroll ---
const PricingSliderMobi = () => {
  const { loading, error, uniqueServices, uniqueTitles, isServiceProvided } =
    useServiceData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const observerRef = useRef(null);

  // Ref for the component's root to check for viewport visibility
  const componentRootRef = useRef(null);

  // START: THÊM STATE VÀ REF CHO LOGIC EQUAL HEIGHT
  const [maxHeight, setMaxHeight] = useState("auto"); // State để lưu chiều cao lớn nhất
  // Tạo một mảng Ref, mỗi Ref đại diện cho một thẻ dịch vụ
  const cardRefs = useRef([]);
  cardRefs.current = uniqueServices.map(
    (_, i) => cardRefs.current[i] ?? React.createRef()
  );
  // END: THÊM STATE VÀ REF CHO LOGIC EQUAL HEIGHT
  // HÀM ĐO CHIỀU CAO LỚN NHẤT
  const measureHeights = useCallback(() => {
    if (uniqueServices.length === 0) return;

    // Lọc các ref đã được gán (current)
    const heights = cardRefs.current
      .map((ref) => ref.current?.clientHeight || 0)
      .filter((h) => h > 0);

    if (heights.length > 0) {
      const maxH = Math.max(...heights);
      // Thêm một giá trị buffer nhỏ (ví dụ 5px) để đảm bảo an toàn
      setMaxHeight(`${maxH}px`);
    }
  }, [uniqueServices.length]);

  // CHẠY HÀM ĐO CHIỀU CAO SAU KHI RENDER
  useEffect(() => {
    // Chờ một chút để đảm bảo DOM đã sẵn sàng và tất cả nội dung đã load
    const timeoutId = setTimeout(() => {
      measureHeights();
    }, 300); // 300ms là đủ để font và hình ảnh (nếu có) load

    // Thêm sự kiện lắng nghe khi cửa sổ thay đổi kích thước
    window.addEventListener("resize", measureHeights);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", measureHeights);
    };
  }, [uniqueServices.length, measureHeights]);

  // Thay thế hàm observeCards hiện tại bằng mã sau
  const observeCards = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (observerRef.current) observerRef.current.disconnect();

    // Sử dụng ngưỡng giao cắt chi tiết
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let maxRatio = -1;
        let centerIndex = currentIndex;

        // Tìm card có tỷ lệ giao cắt cao nhất (nằm gần giữa nhất)
        entries.forEach((entry) => {
          // Đảm bảo phần tử target tồn tại và có thuộc tính data-index
          const targetElement = entry.target;
          const indexString = targetElement?.getAttribute("data-index");

          if (indexString === null || indexString === undefined) {
            // Bỏ qua nếu không tìm thấy data-index, đây có thể là phần tử DOM không mong muốn
            return;
          }

          const index = parseInt(indexString, 10);

          // Chỉ xem xét các card đang giao cắt và có tỷ lệ cao nhất
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            centerIndex = index;
          }
        });

        // Cập nhật index chỉ khi có sự thay đổi đáng kể
        if (maxRatio > 0.5) {
          // Chỉ cập nhật nếu card chiếm hơn 50% tầm nhìn và index đã thay đổi
          if (centerIndex !== currentIndex) {
            setCurrentIndex(centerIndex);
          }
        } else if (entries.length > 0 && maxRatio === -1) {
          const visibleEntries = entries.filter((e) => e.isIntersecting);
          if (visibleEntries.length > 0) {
            const mostVisible = visibleEntries.reduce((prev, current) =>
              prev.intersectionRatio > current.intersectionRatio
                ? prev
                : current
            );
            const mostVisibleIndex =
              mostVisible.target?.getAttribute("data-index");
            if (mostVisibleIndex !== null && mostVisibleIndex !== undefined) {
              const newIndex = parseInt(mostVisibleIndex, 10);
              if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
              }
            }
          }
        }
      },
      { root: slider, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    // Chuẩn bị và Quan sát các phần tử con trực tiếp của slider
    Array.from(slider.children).forEach((child) => {
      // KIỂM TRA ĐỘ BỀN VỮNG TRONG VÒNG LẶP CHUẨN BỊ
      const cardWrapper = child; // Card wrapper là div bọc (child)
      const innerCard = cardWrapper.children[0]; // Inner card là ServiceCardMinimalist

      if (innerCard) {
        // Lấy data-index từ div bọc (card wrapper)
        const indexString = innerCard.getAttribute("data-index");

        if (indexString !== null && indexString !== undefined) {
          // CHỈ GẮN data-index VÀ QUAN SÁT NẾU NÓ LÀ CARD THỰC SỰ
          cardWrapper.setAttribute("data-index", indexString);
          observerRef.current.observe(cardWrapper);
        }
      }
    });
  }, [currentIndex]);

  const scrollToCard = useCallback(
    (index) => {
      const slider = sliderRef.current;
      if (!slider || !slider.children[index]) return;

      // Tắt observer trước khi cuộn
      if (observerRef.current) observerRef.current.disconnect();

      // Cập nhật index ngay lập tức để dots phản hồi
      setCurrentIndex(index);

      // Cuộn mượt mà và căn giữa card
      slider.children[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });

      // Bật lại observer sau 500ms để bắt đầu theo dõi vị trí mới
      setTimeout(() => {
        observeCards();
      }, 500);
    },
    [observeCards]
  );

  // ... (Giữ nguyên useEffect)
  useEffect(() => {
    if (uniqueServices.length > 0) {
      observeCards();
    }
    // ... cleanup
  }, [uniqueServices.length, observeCards]);

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToCard(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(uniqueServices.length - 1, currentIndex + 1);
    scrollToCard(newIndex);
  };

  if (loading) return <SkeletonLoader />;
  if (error || !uniqueServices.length) return <ErrorDisplay error={error} />;

  const stageColorMap = {
    1: {
      bg: "bg-gradient-to-b from-gray-500 to-gray-700",
      text: "text-gray-700",
      bgRadius: "bg-gray-700",
      bg1Radius: "bg-gray-500",
    },
    2: {
      bg: "bg-gradient-to-b from-green-500 to-green-700",
      text: "text-green-700",
      bgRadius: "bg-green-700",
      bg1Radius: "bg-green-500",
    },
    3: {
      bg: "bg-gradient-to-b from-blue-500 to-indigo-700",
      text: "text-indigo-700",
      bgRadius: "bg-indigo-700",
      bg1Radius: "bg-indigo-500",
    },
    4: {
      bg: "bg-gradient-to-b from-purple-500 to-purple-700",
      text: "text-purple-700",
      bgRadius: "bg-purple-700",
      bg1Radius: "bg-purple-500",
    },
    5: {
      bg: "bg-gradient-to-b from-pink-500 to-rose-600",
      text: "text-rose-600",
      bgRadius: "bg-rose-700",
      bg1Radius: "bg-rose-500",
    },
    6: {
      bg: "bg-gradient-to-b from-teal-500 to-teal-700",
      text: "text-teal-700",
      bgRadius: "bg-teal-700",
      bg1Radius: "bg-teal-500",
    },
  };
  const defaultColor = {
    bg: "bg-gradient-to-b from-cyan-500 to-teal-700",
    text: "text-cyan-700",
    bgRadius: "bg-cyan-700",
    bg1Radius: "bg-cyan-500",
  };

  return (
    <div
      ref={componentRootRef}
      className="p-4 bg-background dark:bg-slate-950 admin-dark:bg-slate-950 rounded-2xl shadow-xl max-w-4xl mx-auto relative group animate-in fade-in duration-500"
    >
      <div
        role="region"
        aria-label="Carousel of configured services"
        className="relative"
      >
        {/* Nút Previous */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Previous service"
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 dark:border-slate-700
                               opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 disabled:cursor-not-allowed
                               hover:scale-110 hover:shadow-xl will-change-transform focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>

        <div
          ref={sliderRef}
          // Thêm scroll-smooth cho animation cuộn
          className="px-10 flex space-x-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar scroll-smooth"
        >
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          {uniqueServices.map((service, index) => {
            const stageColor = stageColorMap[service.stage_id] || defaultColor;
            return (
              // Gán data-index ở đây để Observer dễ truy cập hơn
              <div
                key={service.id}
                data-index={index}
              >
                <ServiceCardMinimalist
                  service={service}
                  uniqueTitles={uniqueTitles}
                  isServiceProvided={isServiceProvided}
                  stageColor={stageColor}
                  index={index}
                  currentIndex={currentIndex}
                  // TRUYỀN REF VÀ CHIỀU CAO TỐI ĐA XUỐNG
                  cardRef={cardRefs.current[index]}
                  maxHeight={maxHeight}
                />
              </div>
            );
          })}
        </div>

        {/* Nút Next */}
        <button
          onClick={handleNext}
          disabled={currentIndex === uniqueServices.length - 1}
          aria-label="Next service"
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 dark:border-slate-700
                               opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 disabled:cursor-not-allowed
                               hover:scale-110 hover:shadow-xl will-change-transform focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <ChevronRight className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>
      </div>

      {/* Chỉ báo (Dots) */}
      <div className="flex justify-center space-x-2 py-4">
        {uniqueServices.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollToCard(index)}
            className={cn(
              "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ease-in-out",
              index === currentIndex
                ? "bg-indigo-600 w-6 shadow-md"
                : "bg-gray-400 hover:bg-indigo-400"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSliderMobi;
