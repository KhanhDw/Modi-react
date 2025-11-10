import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useMemo,
  useRef,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import useCurrentLanguage from "@/hook/currentLang";
import useApiCache from "@/hooks/useApiCache"; // Custom caching hook
import DeferredComponent from "@/utils/DeferredComponent";
import ScrollToTopButton from "@/components/button/ScrollToTopButton";

/*
  Optimized HomePage
  - Use `lang` directly (no extra activeLang state)
  - Group lazy imports for maintainability
  - Keep small in-memory cache with useRef
  - Avoid unnecessary deep cloning
  - Use DEV-only logs to avoid noisy production console
  - Memoize section parsers & component map
  - Respect deferred rendering (DeferredComponent expected to use IntersectionObserver)
*/

// Grouped lazy imports
const HomeSections = {
  PricingPage: lazy(() => import("@/components/home/pricingPage")),
  BannerSilder: lazy(() => import("@/components/home/BannerSilder")),
  BaseModi: lazy(() => import("@/components/home/BaseModi")),
  ThreeCardBusiness: lazy(() => import("@/components/home/ThreeCardBusiness")),
  ServiceModi: lazy(() => import("@/components/home/Service/ServiceModi")),
  BenefitBusiness: lazy(() => import("@/components/home/BenefitBusiness")),
  BannerText: lazy(() => import("@/components/home/BannerText")),
  Customer: lazy(() => import("@/components/home/Customer")),
};

const ComponentLoader = () => (
  <div className="w-full h-64 flex items-center justify-center">Loading...</div>
);

function HomePage({ activeSidebarHeader }) {
  const { t } = useLanguage();
  const { lang } = useCurrentLanguage(); // use lang directly

  // Performance monitoring (keeps existing behavior)
  // If usePerformanceMonitor has effects, keep it; otherwise it's a noop.
  try {
    // lazy require to avoid errors if hook not available in some envs
    const { usePerformanceMonitor } = require("@/hooks/usePerformanceMonitor");
    usePerformanceMonitor("HomePage");
  } catch (e) {
    // ignore if hook missing in test env
  }

  // Small in-memory cache local to component lifecycle
  const cacheRef = useRef(new Map());

  // Fetch status & positions through existing useApiCache hook (keeps shared caching semantics)
  const { data: statusData } = useApiCache(
    `status-position-${lang}`,
    async () => {
      const start = performance.now();
      const statusPositionUrl = `${
        import.meta.env.VITE_MAIN_BE_URL
      }/api/status-position-home-page`;
      const res = await fetch(statusPositionUrl);
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const json = await res.json();
      const end = performance.now();
      if (import.meta.env.DEV)
        console.log(
          `Status position API call took ${(end - start).toFixed(2)}ms`
        );
      return json.data;
    },
    10 * 60 * 1000
  );

  const { data: positionData } = useApiCache(
    `position-${lang}`,
    async () => {
      const start = performance.now();
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/sections?slug=home`
      );
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const json = await res.json();
      if (!json.data || !Array.isArray(json.data)) {
        throw new Error("Dữ liệu không đúng định dạng hoặc rỗng");
      }
      const end = performance.now();
      if (import.meta.env.DEV)
        console.log(
          `Position data API call took ${(end - start).toFixed(2)}ms`
        );
      return json.data; // avoid deep clone to save CPU
    },
    10 * 60 * 1000
  );

  const status = statusData || [];
  const vitri = positionData || [];

  useEffect(() => {
    // restore/scroll behavior
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const handleBeforeUnload = () => window.scrollTo(0, 0);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // section parsers memoized
  const sectionParsers = useMemo(
    () => ({
      banner: (data) => {
        const buttonTextMapping = [
          "home.banner.goal.buttonText",
          "home.banner.coreValues.buttonText",
        ];
        return (data || []).map((item, idx) => {
          let bannerUrl = "";
          if (item.image_url) {
            bannerUrl = item.image_url.startsWith("http")
              ? item.image_url
              : `${import.meta.env.VITE_MAIN_BE_URL}${item.image_url}`;
          }
          return {
            id: item.id,
            title: { vi: item.title?.vi || "", en: item.title?.en || "" },
            description: {
              vi: item.description?.vi || "",
              en: item.description?.en || "",
            },
            banner: bannerUrl,
            buttonText: buttonTextMapping[idx] || "",
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
        (data || []).map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image_url,
        })),

      dichVu: (data) =>
        (data || []).map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image_url,
        })),

      loiIch: (data) =>
        (data || []).map((item) => ({
          id: item.id,
          title: { vi: item.title?.vi || "", en: item.title?.en || "" },
          description: {
            vi: item.description?.vi ? item.description.vi.split("\n") : [],
            en: item.description?.en ? item.description.en.split("\n") : [],
          },
          imageUrl: item.image_url,
          position: item.position,
        })),

      khauHieu: (data) => ({ text: data[0]?.title || "" }),

      khachHang: (data) =>
        (data || []).map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image_url,
        })),
    }),
    []
  );

  // local homeData state with two langs
  const [homeData, setHomeData] = useState(() => ({ vi: {}, en: {} }));

  const currentData = useMemo(() => homeData[lang] || {}, [homeData, lang]);

  const sections = useMemo(
    () => [
      "banner",
      "nenTang",
      "cards",
      "dichVu",
      "loiIch",
      "khauHieu",
      "khachHang",
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    const fetchSection = async (type) => {
      try {
        const cacheKey = `section-${type}-${lang}`;
        const cached = cacheRef.current.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
          if (import.meta.env.DEV)
            console.log(`Using cached data for ${type} section`);
          if (!mounted) return;
          setHomeData((prev) => ({
            ...prev,
            [lang]: { ...(prev[lang] || {}), [type]: cached.data },
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
        const json = await res.json();
        const parsed = sectionParsers[type]?.(json) || json;
        const end = performance.now();
        if (import.meta.env.DEV)
          console.log(
            `Section ${type} API call took ${(end - start).toFixed(2)}ms`
          );

        cacheRef.current.set(cacheKey, { data: parsed, timestamp: Date.now() });
        if (!mounted) return;
        setHomeData((prev) => ({
          ...prev,
          [lang]: { ...(prev[lang] || {}), [type]: parsed },
        }));
      } catch (err) {
        console.error(`❌ Fetch ${type} failed:`, err);
      }
    };

    // Trigger parallel fetch with Promise.allSettled to avoid one failure blocking others
    (async () => {
      await Promise.allSettled(sections.map((s) => fetchSection(s)));
    })();

    return () => {
      mounted = false;
    };
  }, [lang, sectionParsers, sections]);

  // Map DB types to keys in currentData
  const typeKeyMap = {
    banner: "banner",
    nenTang: "nenTang",
    cards: "cards",
    dichvu: "dichVu",
    chitietdichvu: "chitietdichvu",
    loiich: "loiIch",
    khauhieu: "khauHieu",
    khachhang: "khachHang",
  };

  const componentMap = useMemo(
    () => ({
      banner: (data, activeLang, sectionType) =>
        data.banner?.length > 0 && (
          <Suspense fallback={<ComponentLoader />}>
            <HomeSections.BannerSilder
              data={data.banner}
              activeLang={activeLang}
              sectionType={sectionType}
            />
          </Suspense>
        ),

      nenTang: (data, activeLang, sectionType) =>
        data.nenTang && (
          <Suspense fallback={<ComponentLoader />}>
            <HomeSections.BaseModi
              data={data.nenTang}
              activeLang={activeLang}
              sectionType={sectionType}
            />
          </Suspense>
        ),

      cards: (data, activeLang, sectionType) =>
        data.cards?.length > 0 && (
          <Suspense fallback={<ComponentLoader />}>
            <HomeSections.ThreeCardBusiness
              data={data.cards}
              activeLang={activeLang}
              sectionType={sectionType}
            />
          </Suspense>
        ),

      dichvu: (data, activeLang, sectionType) =>
        data.dichVu?.length > 0 && (
          <Suspense fallback={<ComponentLoader />}>
            <HomeSections.ServiceModi
              data={data.dichVu}
              activeLang={activeLang}
              sectionType={sectionType}
            />
          </Suspense>
        ),

      chitietdichvu: (data, activeLang, sectionType) => (
        <div className="w-full">
          <Suspense fallback={<ComponentLoader />}>
            <HomeSections.PricingPage />
          </Suspense>
        </div>
      ),

      loiich: (data, activeLang, sectionType) =>
        data.loiIch?.length > 0 && (
          <Suspense fallback={<ComponentLoader />}>
            <HomeSections.BenefitBusiness
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
              <HomeSections.BannerText
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
            <HomeSections.Customer
              data={data.khachHang}
              activeLang={activeLang}
              sectionType={sectionType}
            />
          </Suspense>
        ),
    }),
    []
  );

  return (
    <div
      className={`${
        activeSidebarHeader ? "overflow-hidden" : ""
      } w-full h-full md:p-4 mx-auto flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950`}
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
          const key = typeKeyMap[section.type];
          return (
            <React.Fragment key={section.type}>
              <DeferredComponent
                component={(data, activeLang) =>
                  componentMap[section.type]?.(data, activeLang, section.type)
                }
                data={currentData}
                activeLang={lang}
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

export default React.memo(HomePage);
