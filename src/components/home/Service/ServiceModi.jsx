import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMobileView } from "./useMobileView";
import DesktopServiceItem from "./DesktopServiceItem";
import MobileServiceItem from "./MobileServiceItem";
import "@/styles/ServiceModi.css";

function ServiceModi({ data, activeLang }) {
  const hasFetched = useRef(false);
  const { t } = useLanguage();
  const isMobileView = useMobileView();
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [displayCount, setDisplayCount] = useState(3);
  const [loadedCount, setLoadedCount] = useState(3);
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

  const servicesToRender = useMemo(
    () => data?.slice(0, isMobileView ? displayCount : loadedCount) || [],
    [data, displayCount, loadedCount, isMobileView]
  );

  return (
    <section className="py-16 bg-neutral-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          {t("home.serviceModi.title")}
        </h3>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          {t("home.serviceModi.description")}
        </p>

        <div ref={containerRef}>
          {isMobileView ? (
            <div className="flex overflow-x-auto gap-6 px-4 pb-8 snap-x snap-mandatory scrollbar-hide">
              {servicesToRender.map((s) => (
                <MobileServiceItem
                  key={s.id}
                  service={s}
                  activeLang={activeLang}
                  isExpanded={expandedCardId === s.id}
                  onToggle={() => handleToggle(s.id)}
                />
              ))}
            </div>
          ) : (
            <div className="desktop-grid-container">
              {servicesToRender.map((s) => (
                <DesktopServiceItem
                  key={s.id}
                  service={s}
                  activeLang={activeLang}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default React.memo(ServiceModi);
