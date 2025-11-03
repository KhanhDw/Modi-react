import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import useCurrentLanguage from "@/hook/currentLang";
import { useAboutData } from "@/contexts/AboutDataContext";
import OptimizedImage from "@/components/optimized-image";

export function MissionVision({ missionVisionData }) {
  const { lang } = useCurrentLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useAboutData();
  
  // Get mission/vision data from context, fallback to prop, then to empty array
  const items = missionVisionData || (data?.missionVision) || [];

  useEffect(() => {
    // Quan sát khi scroll tới section
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("mission-vision");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="mission-vision"
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-center text-[foreground] mb-12">
          {lang === "vi" ? "Sứ mệnh & Tầm nhìn" : "Mission & Vision"}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <Card
              key={item.id}
              className={`transition-all duration-600 hover:shadow-lg border-2 ${
                index % 2 === 0
                  ? "hover:border-primary/50"
                  : "hover:border-secondary/50"
              } ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : index % 2 === 0
                  ? "opacity-0 -translate-x-8"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      index % 2 === 0 ? "bg-primary" : "bg-secondary"
                    }`}
                  ></div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold font-sans text-[foreground]">
                    {item.title?.[lang] || "Chưa có tiêu đề"}
                  </h3>
                </div>
                <p className="text-[muted-foreground] leading-relaxed text-sm sm:text-base">
                  {item.description?.[lang] || "Chưa có mô tả"}
                </p>
                {item.image_url && (
                  <div className="w-full h-40 rounded-lg mt-4 overflow-hidden">
                    <OptimizedImage
                      src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image_url}`}
                      alt={item.title?.[lang] || ""}
                      className="w-full h-full object-cover shadow"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
