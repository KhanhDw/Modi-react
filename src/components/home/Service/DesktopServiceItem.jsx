import React, { useCallback, useMemo } from "react";
import OptimizedImage from "@/components/common/OptimizedImage";

const DesktopServiceItem = React.memo(({ service, activeLang }) => {
  const description = service.description?.[activeLang] || "";
  const title = service.title?.[activeLang] || "";

  const imageUrl = useMemo(() => {
    if (!service.image) return "/no-image.png";
    return `${import.meta.env.VITE_MAIN_BE_URL}${
      service.image
    }?w=400&h=300&fit=crop`;
  }, [service.image]);

  const handleImageError = useCallback((e) => {
    e.currentTarget.src = "/no-image.png";
  }, []);

  return (
    <div className="desktop-service-item group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-80 hover:h-96">
      <div className="absolute inset-0">
        <OptimizedImage
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-all duration-700"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/80 group-hover:via-black/40 group-hover:to-black/10 transition-all duration-500"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
        <h4 className="text-2xl font-bold mb-0 group-hover:mb-3 transition-all duration-300">
          {title}
        </h4>
        <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-32">
          <p className="text-lg font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 leading-relaxed pt-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
});

export default DesktopServiceItem;
