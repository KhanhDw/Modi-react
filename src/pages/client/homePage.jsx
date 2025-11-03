import React, { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import useCurrentLanguage from "@/hook/currentLang";
import useApiCache from "@/hooks/useApiCache"; // Custom caching hook
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import DeferredComponent from "@/utils/DeferredComponent";
import ScrollToTopButton from "@/components/button/ScrollToTopButton";

// Simple in-memory cache (same as in useApiCache.js)
const cache = new Map();

// Lazy load components for code splitting
const PricingPage = lazy(() => import("@/components/home/pricingPage"));
const BannerSilder = lazy(() => import("@/components/home/BannerSilder"));
const BaseModi = lazy(() => import("@/components/home/BaseModi"));
const ThreeCardBusiness = lazy(() =>
  import("@/components/home/ThreeCardBusiness")
);
const ServiceModi = lazy(() => import("@/components/home/ServiceModi"));
const BenefitBusiness = lazy(() => import("@/components/home/BenefitBusiness"));
const BannerText = lazy(() => import("@/components/home/BannerText"));
const Customer = lazy(() => import("@/components/home/Customer"));

// Loading component for lazy loaded components
const ComponentLoader = () => (
  <div className="w-full h-64 flex items-center justify-center">Loading...</div>
);

function HomePage({ activeSidebarHeader }) {
  const { t } = useLanguage();
  const { lang } = useCurrentLanguage();

  // Performance monitoring
  usePerformanceMonitor("HomePage");
  const [activeLang, setActiveLang] = useState("vi"); // vi en

  // Use caching for API calls with performance monitoring
  const { data: statusData } = useApiCache(
    `status-position-${lang}`,
    async () => {
      const start = performance.now();
      const statusPositionUrl = `${
        import.meta.env.VITE_MAIN_BE_URL
      }/api/status-position-home-page`;
      const res = await fetch(statusPositionUrl);
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const data = await res.json();
      const end = performance.now();
      console.log(
        `Status position API call took ${(end - start).toFixed(2)}ms`
      );
      return data.data;
    },
    10 * 60 * 1000 // 10 minutes TTL for status data
  );

  const { data: positionData } = useApiCache(
    `position-${lang}`,
    async () => {
      const start = performance.now();
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/sections?slug=home`
      );
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const data = await res.json();
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Dữ liệu không đúng định dạng hoặc rỗng");
      }
      const end = performance.now();
      console.log(`Position data API call took ${(end - start).toFixed(2)}ms`);
      return JSON.parse(JSON.stringify(data.data)); // Clone data
    },
    10 * 60 * 1000 // 10 minutes TTL for position data
  );

  const status = statusData || [];
  const vitri = positionData || [];

  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);

  useEffect(() => {
    // Khi load lại trang thì reset scroll
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Khi chuẩn bị reload/đóng tab -> về top
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Use useMemo to memoize parsers to prevent re-creation on every render
  const sectionParsers = useMemo(
    () => ({
      banner: (data) => {
        // Mapping riêng cho buttonText
        const buttonTextMapping = [
          "home.banner.goal.buttonText",
          "home.banner.coreValues.buttonText",
        ];

        return data.map((item, idx) => {
          // Ensure the banner URL is properly formatted
          let bannerUrl = "";
          if (item.image_url) {
            // Check if image_url is already an absolute URL
            if (item.image_url.startsWith("http")) {
              bannerUrl = item.image_url;
            } else {
              // Construct the full URL with the base URL
              bannerUrl = `${import.meta.env.VITE_MAIN_BE_URL}${
                item.image_url
              }`;
            }
          }

          return {
            id: item.id,
            title: { vi: item.title?.vi || "", en: item.title?.en || "" },
            description: {
              vi: item.description?.vi || "",
              en: item.description?.en || "",
            },
            banner: bannerUrl,
            buttonText: buttonTextMapping[idx] || "", // 👈 append ở đây
          };
        });
      },

      nenTang: (data) => ({
        title: { vi: data[0]?.title?.vi || "", en: data[0]?.title?.en || "" },
        description: {
          vi: data[0]?.description?.vi || "",
          en: data[0]?.description?.en || "",
        },
      }),

      cards: (data) =>
        data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image_url,
        })),

      dichVu: (data) =>
        data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image_url,
        })),

      loiIch: (data) =>
        data.map((item) => ({
          id: item.id,
          title: {
            vi: item.title?.vi || "",
            en: item.title?.en || "",
          },
          description: {
            vi: item.description?.vi
              ? item.description.vi.split("\n") // tách thành list
              : [],
            en: item.description?.en ? item.description.en.split("\n") : [],
          },
          imageUrl: item.image_url,
          position: item.position,
        })),

      khauHieu: (data) => ({
        text: data[0]?.title || "",
      }),

      khachHang: (data) =>
        data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image_url,
        })),
    }),
    []
  );

  // Create memoized homeData state with caching
  const [homeData, setHomeData] = useState(() => ({
    vi: {
      banner: [],
      nenTang: [],
      cards: [],
      dichVu: [],
      loiIch: [],
      khauHieu: [],
      khachHang: [],
    },
    en: {
      banner: [],
      nenTang: [],
      cards: [],
      dichVu: [],
      loiIch: [],
      khauHieu: [],
      khachHang: [],
    },
  }));

  // Memoize the current data based on active language
  const currentData = useMemo(
    () => homeData[activeLang],
    [homeData, activeLang]
  );

  // Create cached fetch functions for each section type
  const sections = [
    "banner",
    "nenTang",
    "cards",
    "dichVu",
    "loiIch",
    "khauHieu",
    "khachHang",
  ];

  useEffect(() => {
    const fetchSectionWithCache = async (type) => {
      try {
        const cacheKey = `section-${type}-${activeLang}`;
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
          // 10 minutes
          console.log(`Using cached data for ${type} section`);
          setHomeData((prev) => ({
            ...prev,
            [activeLang]: {
              ...prev[activeLang],
              [type]: cached.data,
            },
          }));
          return;
        }

        const start = performance.now();
        const res = await fetch(
          `${
            import.meta.env.VITE_MAIN_BE_URL
          }/api/section-items/type/${type}?slug=home`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const parsed = sectionParsers[type]?.(data) || data;
        const end = performance.now();
        console.log(
          `Section ${type} API call took ${(end - start).toFixed(2)}ms`
        );

        // Cache the result
        cache.set(cacheKey, {
          data: parsed,
          timestamp: Date.now(),
        });

        setHomeData((prev) => ({
          ...prev,
          [activeLang]: {
            ...prev[activeLang],
            [type]: parsed,
          },
        }));
      } catch (err) {
        console.error(`❌ Fetch ${type} failed:`, err);
      }
    };

    // Fetch all sections in parallel
    Promise.all(sections.map((type) => fetchSectionWithCache(type)));
  }, [activeLang, sectionParsers]);

  // ánh xạ type (DB) => key (currentData)
  const typeKeyMap = {
    banner: "banner",
    nenTang: "nenTang",
    cards: "cards",
    dichvu: "dichVu", // DB: dichvu -> State: dichVu
    chitietdichvu: "chitietdichvu",
    loiich: "loiIch", // DB: loiich -> State: loiIch
    khauhieu: "khauHieu", // DB: khauhieu -> State: khauHieu
    khachhang: "khachHang", // DB: khachhang -> State: khachHang
  };

  const componentMap = {
    banner: (data, activeLang, sectionType) =>
      data.banner?.length > 0 && (
        <Suspense fallback={<ComponentLoader />}>
          <BannerSilder
            data={data.banner}
            activeLang={activeLang}
            sectionType={sectionType}
          />
        </Suspense>
      ),
    nenTang: (data, activeLang, sectionType) =>
      data.nenTang && (
        <Suspense fallback={<ComponentLoader />}>
          <BaseModi
            data={data.nenTang}
            activeLang={activeLang}
            sectionType={sectionType}
          />
        </Suspense>
      ),
    cards: (data, activeLang, sectionType) =>
      data.cards?.length > 0 && (
        <Suspense fallback={<ComponentLoader />}>
          <ThreeCardBusiness
            data={data.cards}
            activeLang={activeLang}
            sectionType={sectionType}
          />
        </Suspense>
      ),
    dichvu: (data, activeLang, sectionType) =>
      data.dichVu?.length > 0 && (
        <Suspense fallback={<ComponentLoader />}>
          <ServiceModi
            data={data.dichVu}
            activeLang={activeLang}
            sectionType={sectionType}
          />
        </Suspense>
      ),
    chitietdichvu: (data, activeLang, sectionType) => (
      <div className="w-full">
        <Suspense fallback={<ComponentLoader />}>
          <PricingPage />
        </Suspense>
      </div>
    ),
    loiich: (data, activeLang, sectionType) =>
      data.loiIch?.length > 0 && (
        <Suspense fallback={<ComponentLoader />}>
          <BenefitBusiness
            data={data.loiIch}
            activeLang={activeLang}
            sectionType={sectionType}
          />
        </Suspense>
      ),
    khauhieu: (data, activeLang, sectionType) =>
      data.khauHieu && (
        <div className="w-full">
          <Suspense fallback={<ComponentLoader />}>
            <BannerText
              data={data.khauHieu}
              activeLang={activeLang}
              sectionType={sectionType}
            />
          </Suspense>
        </div>
      ),
    khachhang: (data, activeLang, sectionType) =>
      data.khachHang?.length > 0 && (
        <Suspense fallback={<ComponentLoader />}>
          <Customer
            data={data.khachHang}
            activeLang={activeLang}
            sectionType={sectionType}
          />
        </Suspense>
      ),
  };

  return (
    <div
      className={`${activeSidebarHeader ? "overflow-hidden" : ""}
                w-full h-full md:p-4 mx-auto flex flex-col
                items-center justify-center bg-slate-50 dark:bg-slate-950`}
    >
      {vitri
        .sort((a, b) => a.position - b.position)
        .filter((section) => {
          const sectionStatus = status.find(
            (s) => s.sections_type === section.type
          );
          return sectionStatus && sectionStatus.status === 1;
        })
        .map((section) => {
          const key = typeKeyMap[section.type]; // map DB type -> currentData key
          return (
            <React.Fragment key={section.type}>
              <DeferredComponent
                component={(data, lang) =>
                  componentMap[section.type]?.(data, lang)
                }
                data={currentData}
                activeLang={activeLang}
                sectionType={section.type}
                fallback={
                  <div className="w-full h-64 flex items-center justify-center">
                    Loading...
                  </div>
                }
              />
            </React.Fragment>
          );
        })}

      <ScrollToTopButton />
    </div>
  );
}

export default HomePage;
