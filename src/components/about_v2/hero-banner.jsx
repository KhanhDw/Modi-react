import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import useCurrentLanguage, { setAppLanguage } from "@/hook/currentLang";
import { Link } from "react-router-dom";
import { useAboutData } from "@/contexts/AboutDataContext";

export function HeroBanner({ bannerData }) {
  const { t } = useLanguage();
  const { lang, prefix } = useCurrentLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useAboutData();
  
  // Get banner from context, fallback to prop, then to default state
  const banner = bannerData || (data?.banner) || {
    title: { vi: "", en: "" },
    slogan: { vi: "", en: "" },
    image_url: "",
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden rounded-xl rounded-tl-none rounded-tr-none md:rounded-4xl shadow-lg">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        // src="/videos/hero-bg.mp4"
        src={`${import.meta.env.VITE_MAIN_BE_URL}/video/${banner.image_url}`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata" // Preload metadata only for faster initial load
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sans text-white mb-6 transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {banner.title?.[lang] || "Chưa có tiêu đề"}
        </h1>

        <p
          className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-8 max-w-2xl mx-auto transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {banner.slogan?.[lang] || "Chưa có slogan"}
        </p>

        <Link
          to={`/contact`}
          className={`bg-[primary] hover:bg-[primary/90] cursor-pointer text-[primary-foreground] px-8 py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg transition-all duration-800 delay-400 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {t("aboutV2.button")}
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[secondary/20] rounded-full blur-xl animate-pulse delay-1000" />
    </section>
  );
}
