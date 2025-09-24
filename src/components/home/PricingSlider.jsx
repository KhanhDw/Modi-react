import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import slugify from "../../utils/slug";

const PricingSlider = ({ stages }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);

  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);

  const plansWrapperRefs = useRef([]);

  // NEW: refs & state for auto slide
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  const defineButtonOrderActive = (titleBtn) => {
    navigate(`/contact?service-order=${slugify(titleBtn)}`);
  };

  // Handle interaction start/stop
  const handleInteractionStart = () => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  const handleInteractionEnd = () => {
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000); // Resume after 3 seconds of inactivity
  };

  // Touch events for mobile
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

  // Mouse events
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

    const currentPlansWrapper = plansWrapperRefs.current[currentStage];
    if (!currentPlansWrapper) return;

    const { scrollLeft, scrollWidth, clientWidth } = currentPlansWrapper;
    const atStart = scrollLeft <= 10;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 10;

    const scrollFactor = 3;

    if (deltaX > threshold) {
      if (atStart) {
        setCurrentStage((prev) => (prev > 0 ? prev - 1 : prev));
      } else {
        const scrollAmount = Math.min(deltaX * scrollFactor, scrollLeft);
        currentPlansWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    } else if (deltaX < -threshold) {
      if (atEnd) {
        setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
      } else {
        const scrollAmount = Math.min(-deltaX * scrollFactor, scrollWidth - clientWidth - scrollLeft);
        currentPlansWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Scroll to current stage when it changes
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    containerRef.current.scrollTo({
      left: currentStage * containerWidth,
      behavior: "smooth",
    });
  }, [currentStage]);

  // Auto slide management
  const startAutoSlide = () => {
    if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
    autoSlideIntervalRef.current = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 4000); // Every 4s
  };

  const stopAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isUserInteracting) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }

    return () => {
      stopAutoSlide();
    };
  }, [isUserInteracting, stages.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoSlide();
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const allStageFeatures = [
    ...new Set(
      stages.flatMap((stage) => stage.plans.flatMap((plan) => plan.features))
    ),
  ];

  return (
    <div className="transition-all duration-700 relative select-none">
      {/* Tiêu đề stage */}
      <div className="text-center mb-8 sm: p-6 transition-all duration-500">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
          {stages[currentStage]?.title}
        </h2>
        <p className="text-sm sm:text-[18px] md:text-xl lg:text-xl text-center text-slate-600 dark:text-slate-400 mt-2 max-w-3xl mx-auto">
          {stages[currentStage]?.description}
        </p>
      </div>

      <div className="flex gap-3 items-stretch h-full">
        {/* Cột trái: danh sách chức năng */}
        <div className="hidden lg:flex w-80 lg:w-90 flex-shrink-0 border-2 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 shadow-md transition-opacity duration-500 flex-col">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center transition-all duration-500">
            Chức năng
          </h3>
          <ul className="mt-3 space-y-4 flex-1">
            {allStageFeatures.map((feature, i) => (
              <li
                key={i}
                className="text-sm md:text-base text-slate-700 dark:text-slate-300 flex items-center transition-opacity duration-500"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 mr-3"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Cột phải: slider các stage */}
        <div
          ref={containerRef}
          className="flex-1 flex overflow-hidden cursor-pointer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ userSelect: "none" }}
        >
          {stages.map((s, stageIdx) => (
            <div
              key={stageIdx}
              className="flex-shrink-0"
              style={{ width: "100%" }}
            >
              <div
                className="flex gap-3 ml-2 pb-2 overflow-x-auto mr-3 h-full scrollbar-hide"
                ref={(el) => (plansWrapperRefs.current[stageIdx] = el)}
              >
                {s.plans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="group lg:w-80 md:w-80 w-80 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow hover:shadow-md transition-all duration-500 flex flex-col p-6"
                    style={{ height: "100%" }}
                  >
                    <h3 className="text-[18px] sm:text-xl font-bold text-slate-900 dark:text-slate-100 text-center transition-all duration-500">
                      {plan.title}
                    </h3>

                    <ul className="mt-3 space-y-4 text-sm flex-1 transition-opacity duration-500">
                      {allStageFeatures.map((feature, i) => {
                        const hasFeature = plan.features.includes(feature);
                        return (
                          <li
                            key={i}
                            className="flex items-center justify-start lg:justify-center gap-2 text-sm md:text-base text-slate-700 dark:text-slate-300"
                          >
                            <span className="flex justify-center">
                              {hasFeature ? (
                                <span className="bg-green-600 dark:bg-green-600 shadow-md text-white rounded-full p-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="bg-red-600 dark:bg-red-600 shadow-md text-white rounded-full p-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                                  <X className="w-4 h-4 stroke-[3]" />
                                </span>
                              )}
                            </span>
                            <span className="text-[12px] sm:text-sm lg:hidden leading-snug">
                              {feature}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      onClick={() => defineButtonOrderActive(plan.title)}
                      className="mt-3 w-full py-1 px-2 sm:p-2 md:p-2 rounded-sm lg:rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <span className="text-white text-[12px] sm:text-base md:text-base lg:text-xl font-semibold">
                        Đặt Hàng Ngay
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSlider;
