
import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import slugify from "../../utils/slug";

const PricingSlider = ({ stages }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);

  const plansWrapperRef = useRef(null);
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  const defineButtonOrderActive = (titleBtn) => {
    navigate(`/contact?service-order=${slugify(titleBtn)}`);
  };

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

    const { scrollLeft, scrollWidth, clientWidth } = wrapper;
    const atStart = scrollLeft <= 10;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    const scrollFactor = 3;

    if (deltaX > threshold) {
      if (atStart) {
        setCurrentStage((prev) => (prev > 0 ? prev - 1 : prev));
      } else {
        wrapper.scrollBy({ left: -deltaX * scrollFactor, behavior: "smooth" });
      }
    } else if (deltaX < -threshold) {
      if (atEnd) {
        setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
      } else {
        wrapper.scrollBy({ left: -deltaX * scrollFactor, behavior: "smooth" });
      }
    }
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
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

  useEffect(() => {
    const wrapper = plansWrapperRef.current;
    if (!wrapper) return;
    wrapper.scrollTo({ left: 0, behavior: "smooth" });
  }, [currentStage]);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideIntervalRef.current = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 4000);
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
    return () => stopAutoSlide();
  }, [isUserInteracting, stages.length]);

  useEffect(() => {
    return () => {
      stopAutoSlide();
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const allStageFeatures = [
    ...new Set(stages.flatMap((stage) => stage.plans.flatMap((plan) => plan.features))),
  ];

  return (
    <div className="transition-all duration-700 relative select-none">
      {/* Tiêu đề stage */}
      <div className="text-center mb-8 sm:p-6 transition-all duration-500">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
          {stages[currentStage]?.title}
        </h2>
        <p className="text-sm sm:text-[18px] md:text-xl lg:text-xl text-center text-slate-600 dark:text-slate-400 mt-2 max-w-3xl mx-auto">
          {stages[currentStage]?.description}
        </p>
      </div>

      {/* Chỉ giữ phần desktop */}
      <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          ref={plansWrapperRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ userSelect: 'none' }}
        >
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="sticky top-0 bottom-0 left-0 z-10 bg-white dark:bg-slate-800 border border-slate-300 uppercase dark:border-slate-600 w-80 min-w-xs text-left p-4 text-xl font-bold text-slate-900 dark:text-white">
                  Chức năng
                </th>
                {stages[currentStage]?.plans.map((plan, idx) => (
                  <th
                    key={idx}
                    className="border border-slate-300 dark:border-slate-600 min-w-[200px] text-center p-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                  >
                    <div className="mb-2 text-xl uppercase font-bold">{plan.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allStageFeatures.map((feature, idx) => (
                <tr key={idx} className="bg-white dark:bg-slate-800">
                  <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300   w-80 min-w-xs font-medium border border-slate-200 dark:border-slate-700 p-4 align-top">
                    {feature}
                  </td>
                  {stages[currentStage]?.plans.map((plan, planIdx) => {
                    const hasFeature = plan.features.includes(feature);
                    return (
                      <td
                        key={planIdx}
                        className="text-center p-4 border border-slate-200 dark:border-slate-700 min-w-[200px]"
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

              {/* Thêm hàng cuối có nút */}
              <tr className="bg-white dark:bg-slate-800">
                <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 w-80 min-w-xs border border-slate-200 dark:border-slate-700 p-4"></td>
                {stages[currentStage]?.plans.map((plan, idx) => (
                  <td
                    key={idx}
                    className="text-center p-4 border border-slate-200 dark:border-slate-700 min-w-[200px]"
                  >
                    <button
                      onClick={() => defineButtonOrderActive(plan.title)}
                      className="py-1 px-3 rounded-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition duration-300 cursor-pointer"
                    >
                      <span className='text-[18px] font-semibold'>Đặt Hàng Ngay</span>
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
