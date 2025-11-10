import React, { useCallback, useMemo } from "react";
import OptimizedImage from "@/components/common/OptimizedImage";

const MobileServiceItem = React.memo(
  ({ service, activeLang, isExpanded, onToggle }) => {
    const description = service.description?.[activeLang] || "";
    const title = service.title?.[activeLang] || "";

    const imageUrl = useMemo(() => {
      if (!service.image) return "/no-image.png";
      return `${import.meta.env.VITE_MAIN_BE_URL}${
        service.image
      }?w=300&h=200&fit=crop`;
    }, [service.image]);

    const handleImageError = useCallback((e) => {
      e.currentTarget.src = "/no-image.png";
    }, []);

    return (
      <div className="service-mobile-card snap-center shrink-0 w-[85%] sm:w-[70%] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="relative h-48 sm:h-56">
          <OptimizedImage
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {title}
            </h4>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex flex-col justify-start flex-1">
          <p
            className={`text-gray-700 dark:text-gray-200 text-base sm:text-lg transition-all duration-300 ${
              isExpanded ? "line-clamp-none" : "line-clamp-4"
            }`}
          >
            {description}
          </p>

          {description.length > 120 && (
            <button
              onClick={onToggle}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm sm:text-base self-start mt-3 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default MobileServiceItem;
