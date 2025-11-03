import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import useCurrentLanguage, { setAppLanguage } from "@/hook/currentLang";
import { useAboutData } from "@/contexts/AboutDataContext";

export function CTASection({ ctaData }) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { lang } = useCurrentLanguage();
  const { data } = useAboutData();
  
  // Get CTA data from context, fallback to prop, then to default state
  const banner = ctaData || (data?.ctaBanner) || {
    title: { vi: "", en: "" },
    slogan: { vi: "", en: "" },
    image_url: "",
  };
  
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("cta-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="cta-section"
      className="py-20 px-4 relative overflow-hidden"
    >
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover shadow-lg"
        // src="/videos/khoidauduan.mp4" // đổi path video của bạn
        src={`${import.meta.env.VITE_MAIN_BE_URL}/video/${banner?.image_url}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata" // Preload metadata only for faster initial load
      />

      {/* Overlay để dễ đọc chữ */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h2
          className={`text-xl sm:text-2xl lg:text-3xl font-bold font-sans mb-6 transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {/* {t("aboutV2.CTASection.title")} */}
          {banner.title?.[lang] || "Chưa có tiêu đề"}
        </h2>

        <p
          className={`text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {/* {t("aboutV2.CTASection.description")} */}
          {banner.slogan?.[lang] || "Chưa có tiêu đề"}
        </p>

        <Button
          size="lg"
          variant="secondary"
          className={`text-primary cursor-pointer dark:hover:text-gray-800 hover:bg-white/90 px-8 py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg transition-all duration-800 delay-400 hover:scale-110 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          onClick={() => navigate("/contact")}
        >
          {t("aboutV2.CTASection.contactButton")}
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/90 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/90 rounded-full blur-xl animate-pulse delay-1000" />
    </section>
  );
}
