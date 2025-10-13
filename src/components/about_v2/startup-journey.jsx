import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lightbulb, Users, Star } from "lucide-react";

export function StartupJourney() {
  const [visibleCards, setVisibleCards] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          t("aboutV2.StartupJourney.milestones").forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index]);
            }, index * 200);
          });
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("startup-journey");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [t]);

  return (
    <section
      id="startup-journey"
      className="py-20 px-4 bg-[muted/30]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-[foreground] mb-6">
          {t("aboutV2.StartupJourney.title")}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[muted-foreground] mb-12 max-w-2xl mx-auto">
          {t("aboutV2.StartupJourney.description")}
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {t("aboutV2.StartupJourney.milestones").map((milestone, index) => {
            const Icon = [Lightbulb, Users, Star][index];
            return (
              <Card
                key={index}
                className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-2 hover:border-[accent/50] ${visibleCards.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[primary] mb-4 mx-auto" />
                  <h3 className="text-base sm:text-lg font-bold font-sans text-[foreground] mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-[muted-foreground] leading-relaxed text-sm sm:text-base">
                    {milestone.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
