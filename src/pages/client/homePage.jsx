import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PricingPage from "@/components/home/pricingPage";
import useCurrentLanguage from "@/hook/currentLang";
import ScrollToTopButton from "@/components/button/ScrollToTopButton";
import BannerSilder from "@/components/home/BannerSilder";
import BaseModi from "@/components/home/BaseModi";
import ThreeCardBusiness from "@/components/home/ThreeCardBusiness";
import ServiceModi from "@/components/home/ServiceModi";
import BenefitBusiness from "@/components/home/BenefitBusiness";
import BannerText from "@/components/home/BannerText";
import Customer from "@/components/home/Customer";

function HomePage({ activeSidebarHeader }) {
  const { t } = useLanguage();
  const { lang } = useCurrentLanguage();
  const [activeLang, setActiveLang] = useState("vi"); // vi en
  const [vitri, setVitri] = useState([]);
  const [status, setStatus] = useState([]);

  const FetchStatusPosition = async () => {
    try {
      const statusPositionUrl = `${
        import.meta.env.VITE_MAIN_BE_URL
      }/api/status-position-home-page`;

      const res = await fetch(statusPositionUrl);
      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`);
      }
      const data = await res.json();
      setStatus(data.data);
    } catch (error) {}
  };

  // ============ FETCH POSITION COMPONENT ================
  const FetchPositionComponentHome = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/sections?slug=home`
      );
      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`);
      }
      const data = await res.json();
      // Kiểm tra dữ liệu hợp lệ
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Dữ liệu không đúng định dạng hoặc rỗng");
      }
      const clonedData = JSON.parse(JSON.stringify(data.data));
      setVitri(clonedData);
      // console.log(clonedData); // type and position
    } catch (err) {
      console.error("Fetch vitri error:", err);
      // setError(err.message);
    }
  };

  useEffect(() => {
    setActiveLang(lang);
    FetchStatusPosition();
    FetchPositionComponentHome();
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

  const [homeData, setHomeData] = useState({
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
  });
  const currentData = homeData[activeLang];
  // ===================== PARSERS =====================
  const sectionParsers = {
    banner: (data) => {
      // Mapping riêng cho buttonText
      const buttonTextMapping = [
        "home.banner.goal.buttonText",
        "home.banner.coreValues.buttonText",
      ];

      return data.map((item, idx) => ({
        id: item.id,
        title: { vi: item.title?.vi || "", en: item.title?.en || "" },
        description: {
          vi: item.description?.vi || "",
          en: item.description?.en || "",
        },
        banner: item.image_url
          ? `${import.meta.env.VITE_MAIN_BE_URL}${item.image_url}`
          : "",
        buttonText: buttonTextMapping[idx] || "", // 👈 append ở đây
      }));
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
  };

  // ===================== FETCH CHUNG =====================
  const fetchSection = async (type) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_MAIN_BE_URL
        }/api/section-items/type/${type}?slug=home`
      );
      const data = await res.json();
      const parsed = sectionParsers[type]?.(data) || data;

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

  useEffect(() => {
    const sections = [
      "banner",
      "nenTang",
      "cards",
      "dichVu",
      "loiIch",
      "khauHieu",
      "khachHang",
    ];
    Promise.all(sections.map((type) => fetchSection(type)));
  }, [activeLang]);

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
    banner: (data, activeLang) =>
      data.banner?.length > 0 && (
        <BannerSilder
          data={data.banner}
          activeLang={activeLang}
        />
      ),
    nenTang: (data, activeLang) =>
      data.nenTang && (
        <BaseModi
          data={data.nenTang}
          activeLang={activeLang}
        />
      ),
    cards: (data, activeLang) =>
      data.cards?.length > 0 && (
        <ThreeCardBusiness
          data={data.cards}
          activeLang={activeLang}
        />
      ),
    dichvu: (data, activeLang) =>
      data.dichVu?.length > 0 && (
        <ServiceModi
          data={data.dichVu}
          activeLang={activeLang}
        />
      ),
    chitietdichvu: (data, activeLang) => (
      <div className="w-full">
        <PricingPage />
      </div>
    ),
    loiich: (data, activeLang) =>
      data.loiIch?.length > 0 && (
        <BenefitBusiness
          data={data.loiIch}
          activeLang={activeLang}
        />
      ),
    khauhieu: (data, activeLang) =>
      data.khauHieu && (
        <div className="w-full">
          <BannerText
            data={data.khauHieu}
            activeLang={activeLang}
          />
        </div>
      ),
    khachhang: (data, activeLang) =>
      data.khachHang?.length > 0 && (
        <Customer
          data={data.khachHang}
          activeLang={activeLang}
        />
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
              {componentMap[section.type]?.(currentData, activeLang)}
            </React.Fragment>
          );
        })}

      <ScrollToTopButton />
    </div>
  );
}

export default HomePage;
