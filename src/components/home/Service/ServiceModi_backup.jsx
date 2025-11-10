import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/ServiceModi.css";

// Optimized Image Component

const OptimizedImage = React.memo(({ src, alt, className = "", onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={`relative w-full h-full ${className}`}
    >
      {/* Skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse" />
      )}

      {isVisible && (
        <img
          src={hasError ? "/no-image.png" : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
          }`}
        />
      )}
    </div>
  );
});

// Desktop item với image optimized
const DesktopServiceItem = React.memo(({ service, activeLang }) => {
  const description = service.description?.[activeLang] || "";
  const title = service.title?.[activeLang] || "";

  const imageUrl = useMemo(() => {
    if (!service.image) return "/no-image.png";
    // Thêm query params để optimize ảnh nếu backend hỗ trợ
    return `${import.meta.env.VITE_MAIN_BE_URL}${
      service.image
    }?w=400&h=300&fit=crop`;
  }, [service.image]);

  const handleImageError = useCallback((e) => {
    e.currentTarget.src = "/no-image.png";
    e.currentTarget.classList.add("error-fallback");
  }, []);

  return (
    <div className="desktop-service-item group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-80 hover:h-96">
      <div className="image-container absolute inset-0 h-full w-full overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={title}
          quantity="400x300"
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
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

// Mobile item với image optimized
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

// Custom hook với Intersection Observer để lazy load thực sự
const useMobileView = () => {
  const [isMobileView, setIsMobileView] = useState(
    () => window.innerWidth <= 1024
  );

  useEffect(() => {
    let ticking = false;

    const updateView = () => {
      setIsMobileView(window.innerWidth <= 1024);
      ticking = false;
    };

    const handleResize = () => {
      if (!ticking) {
        requestAnimationFrame(updateView);
        ticking = true;
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobileView;
};

function ServiceModi({ data, activeLang, sectionType }) {
  const { t } = useLanguage();
  const isMobileView = useMobileView();
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [displayCount, setDisplayCount] = useState(3); // Giảm số lượng hiển thị ban đầu
  const [loadedCount, setLoadedCount] = useState(3);
  const hasFetched = useRef(false);
  const containerRef = useRef(null);

  const handleToggle = useCallback((id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  }, []);

  // Intersection Observer để load thêm ảnh khi scroll
  useEffect(() => {
    if (!containerRef.current || isMobileView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && loadedCount < (data?.length || 0)) {
            setLoadedCount((prev) => Math.min(prev + 3, data.length));
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobileView, data?.length, loadedCount]);

  useEffect(() => {
    if (hasFetched.current || !data?.length) return;

    const controller = new AbortController();

    const fetchQuantity = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/service-home-page-ui`,
          { signal: controller.signal }
        );

        if (res.ok) {
          const result = await res.json();
          setDisplayCount(result.data.quantity || 6);
          setLoadedCount(result.data.quantity || 6);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch quantity error:", error);
        }
      } finally {
        hasFetched.current = true;
      }
    };

    fetchQuantity();
    return () => controller.abort();
  }, [data]);

  const servicesToRender = useMemo(() => {
    return data?.slice(0, isMobileView ? displayCount : loadedCount) || [];
  }, [data, displayCount, loadedCount, isMobileView]);

  const desktopItems = useMemo(() => {
    return servicesToRender.map((service) => (
      <DesktopServiceItem
        key={`desktop-${service.id}`}
        service={service}
        activeLang={activeLang}
      />
    ));
  }, [servicesToRender, activeLang]);

  const mobileItems = useMemo(() => {
    return servicesToRender.map((service) => (
      <MobileServiceItem
        key={`mobile-${service.id}`}
        service={service}
        activeLang={activeLang}
        isExpanded={expandedCardId === service.id}
        onToggle={() => handleToggle(service.id)}
      />
    ));
  }, [servicesToRender, activeLang, expandedCardId, handleToggle]);

  if (!data?.length) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-neutral-50 dark:bg-gray-900 w-full">
      <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            {t("home.serviceModi.title")}
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t("home.serviceModi.description")}
          </p>
        </div>

        <div
          ref={containerRef}
          className="mt-8 md:mt-12"
        >
          {isMobileView ? (
            <div className="flex items-start overflow-x-auto snap-x snap-mandatory gap-6 px-4 pb-8 scrollbar-hide">
              {mobileItems}
            </div>
          ) : (
            <div className="desktop-grid-container">{desktopItems}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default React.memo(ServiceModi);
