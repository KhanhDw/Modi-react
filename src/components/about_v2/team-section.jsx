import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import OptimizedImage from "@/components/optimized-image";

export function TeamSection() {
  const [visibleCards, setVisibleCards] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for better performance
          t("aboutV2.TeamSection.teamMembers").forEach((_, index) => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 100); // Reduced delay for faster loading
            });
          });
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("team-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [t]);

  return (
    <section
      id="team-section"
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-[foreground] mb-12">
          {t("aboutV2.TeamSection.title")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {t("aboutV2.TeamSection.teamMembers").map((member, index) => (
            <Card
              key={index}
              className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-2 hover:border-accent/50 ${
                visibleCards.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-6 group">
                  <div className="w-32 h-32 rounded-full mx-auto overflow-hidden shadow-lg">
                    <OptimizedImage
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full"></div>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-sans text-[foreground] mb-2">
                  {member.name}
                </h3>
                <p className="text-[primary] font-semibold mb-3 text-sm sm:text-base">
                  {member.role}
                </p>
                <p className="text-[muted-foreground] leading-relaxed text-sm sm:text-base">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
