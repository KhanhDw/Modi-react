import { useEffect, useState } from "react";
import useCurrentLanguage from "@/hook/currentLang";
import { useAboutData } from "@/contexts/AboutDataContext";
import OptimizedImage from "@/components/optimized-image";

export function CompanyOverview({ companyData }) {
  const { lang } = useCurrentLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useAboutData();
  
  // Get company data from context, fallback to prop, then to null
  const about = companyData || (data?.companyOverview) || null;

  // Quan sát khi scroll để hiện animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("company-overview");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="company-overview"
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div
            className={`transition-all duration-600 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[foreground] mb-6">
              {about?.title?.[lang] || "Đang tải..."}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[muted-foreground] leading-relaxed mb-6">
              {about?.description?.[lang] || "Chưa có mô tả"}
            </p>
          </div>

          {/* Image */}
          <div
            className={`transition-all duration-600 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative">
              <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden">
                {about?.image_url ? (
                  <OptimizedImage
                    src={`${import.meta.env.VITE_MAIN_BE_URL}${about.image_url}`}
                    alt={about?.title?.[lang] || "Company Overview"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[accent/20] rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
