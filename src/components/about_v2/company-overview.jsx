import { useEffect, useState } from "react";
import useCurrentLanguage from "@/hook/currentLang";

export function CompanyOverview() {
  const { lang } = useCurrentLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [about, setAbout] = useState(null);

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

  // Fetch dữ liệu từ API section-items (section_id = 2)
  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_MAIN_BE_URL
      }/api/section-items/type/company_intro?slug=about`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAbout(data[0]); // lấy phần tử đầu tiên
        }
      })
      .catch((err) => console.error("Fetch about error:", err));
  }, [lang]); // refetch khi đổi ngôn ngữ

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
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-[foreground] mb-6">
              {about?.title?.[lang] || "Đang tải..."}
            </h2>
            <p className="text-base md:text-lg text-[muted-foreground] leading-relaxed mb-6">
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
              <img
                src={
                  about?.image_url
                    ? `${import.meta.env.VITE_MAIN_BE_URL}${about.image_url}`
                    : "/no-image.png"
                }
                alt={about?.title?.[lang] || "Company Overview"}
                className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[accent/20] rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
