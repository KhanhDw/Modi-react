
import { Check, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

const PricingSlider = ({ data }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const plansWrapperRef = useRef(null);
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  const handleInteractionStart = () => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
  };

  const handleInteractionEnd = () => {
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragEndX.current = e.clientX; // Đảm bảo giá trị dragEndX ban đầu
    handleInteractionStart();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    dragEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    handleInteractionEnd();

    const deltaX = dragEndX.current - dragStartX.current;
    const threshold = 50;

    const wrapper = plansWrapperRef.current;
    if (!wrapper) return;

    const scrollFactor = 3;

    if (deltaX > threshold) {
      // Kéo sang phải, scroll sang trái
      wrapper.scrollBy({ left: -scrollFactor * deltaX, behavior: "smooth" });
    } else if (deltaX < -threshold) {
      // Kéo sang trái, scroll sang phải
      wrapper.scrollBy({ left: scrollFactor * Math.abs(deltaX), behavior: "smooth" });
    }
  };

  // Thêm hàm xử lý khi chuột rời khỏi vùng kéo
  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragEndX.current = e.touches[0].clientX;
    handleInteractionStart();
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    dragEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    handleMouseUp();
    handleInteractionEnd();
  };

  const scrollDirectionRef = useRef('right');

  const startAutoSlide = () => {
    stopAutoSlide();

    const columnWidth = 400;
    const columnsPerSlide = 3;
    const scrollAmount = columnWidth * columnsPerSlide; // 1200px

    autoSlideIntervalRef.current = setInterval(() => {
      const wrapper = plansWrapperRef.current;
      if (!wrapper) return;

      const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
      const currentScroll = wrapper.scrollLeft;

      if (scrollDirectionRef.current === 'right') {
        if (currentScroll + scrollAmount >= maxScrollLeft) {
          scrollDirectionRef.current = 'left';
          wrapper.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
        } else {
          wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      } else {
        if (currentScroll - scrollAmount <= 0) {
          scrollDirectionRef.current = 'right';
          wrapper.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      }
    }, 4000); // every 4 seconds
  };


  const stopAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isUserInteracting) startAutoSlide();
    else stopAutoSlide();

    return () => {
      stopAutoSlide();
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    };
  }, [isUserInteracting]);

  useEffect(() => {
    return () => {
      stopAutoSlide();
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Kiểm tra dữ liệu tồn tại, tránh lỗi khi data rỗng
  const services = data?.data || [];

  // Memoize allFeatures để tránh tính toán lại không cần thiết
  const allFeatures = useMemo(() => {
    const allFeaturesSet = new Set();
    services.forEach(service => {
      service.translation.features
        .split('#')
        .filter(f => f.trim() !== '')
        .forEach(f => allFeaturesSet.add(f.trim()));
    });
    return Array.from(allFeaturesSet);
  }, [services]);

  const defineButtonOrderActive = (slug) => {
    navigate(`/contact?service-order=${slug}`);
  };

  return (
    <div className="transition-all duration-700 relative select-none">
      <div className="text-center mb-8 sm:p-6 transition-all duration-500">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
          BẢNG GIÁ DỊCH VỤ
        </h2>
        <p className="text-sm sm:text-[18px] md:text-xl lg:text-xl text-center text-slate-600 dark:text-slate-400 mt-2 max-w-3xl mx-auto">
          Lựa chọn dịch vụ phù hợp với nhu cầu của bạn
        </p>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          ref={plansWrapperRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ userSelect: 'none' }}
          tabIndex={0} // Thêm để hỗ trợ keyboard focus (Accessibility)
        >
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="sticky top-0 bottom-0 left-0 z-10 bg-white dark:bg-slate-800 border border-slate-300 uppercase dark:border-slate-600 w-80 min-w-xs text-left p-4 text-xl font-bold text-slate-900 dark:text-white">
                  Chức năng
                </th>
                {services.map((service) => (
                  <th
                    key={service.id}
                    className="border border-slate-300 dark:border-slate-600 max-w-[400px] text-center p-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                  >
                    <div className="mb-2 text-xl uppercase font-bold">
                      {service.translation.ten_dich_vu}
                    </div>
                    <div className="text-base text-slate-700 dark:text-slate-400">
                      Giá từ: {Number(service.floor_price).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, idx) => (
                <tr key={idx} className="bg-white dark:bg-slate-800">
                  <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-80 min-w-xs font-medium border border-slate-200 dark:border-slate-700 p-4 align-top">
                    {feature}
                  </td>
                  {services.map((service) => {
                    const featuresArr = service.translation.features
                      .split('#')
                      .map(f => f.trim())
                      .filter(f => f !== '');
                    const hasFeature = featuresArr.includes(feature);

                    return (
                      <td
                        key={service.id}
                        className="text-center p-4 border border-slate-200 dark:border-slate-700 max-w-[400px]"
                      >
                        {hasFeature ? (
                          <Check className="inline-block w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={3} />
                        ) : (
                          <X className="inline-block w-5 h-5 text-red-600 dark:text-red-500" strokeWidth={3} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr className="bg-white dark:bg-slate-800">
                <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 w-80 min-w-xs border border-slate-200 dark:border-slate-700 p-4"></td>
                {services.map((service) => (
                  <td
                    key={service.id}
                    className="text-center p-4 border border-slate-200 dark:border-slate-700 min-w-[400px]"
                  >
                    <button
                      onClick={() => defineButtonOrderActive(service.translation.slug)}
                      className="py-1 px-3 rounded-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition duration-300 cursor-pointer"
                      aria-label={`Đặt hàng dịch vụ ${service.translation.ten_dich_vu}`}
                    >
                      <span className="text-[18px] font-semibold">Đặt Hàng Ngay</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingSlider;
