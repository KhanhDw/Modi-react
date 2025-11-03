import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CheckCircle,
  Zap,
  Headphones,
  ShieldCheck,
  DollarSign,
  CalendarCheck,
} from "lucide-react";

export function CommitmentSection() {
  const [visibleCards, setVisibleCards] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for better performance
          t("aboutV2.CommitmentSection.commitments").forEach((_, index) => {
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

    const element = document.getElementById("commitment-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [t]);

  return (
    <section
      id="commitment-section"
      className="py-20 px-4 bg-[muted/30]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-[foreground] mb-12">
          {t("aboutV2.CommitmentSection.title")}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {t("aboutV2.CommitmentSection.commitments").map(
            (commitment, index) => {
              const Icon = [
                CheckCircle,
                Zap,
                Headphones,
                ShieldCheck,
                DollarSign,
                CalendarCheck,
              ][index];
              return (
                <Card
                  key={index}
                  className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-2 hover:border-secondary/50 ${visibleCards.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                    }`}
                >
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[secondary] mb-4" />
                    <h3 className="text-base sm:text-lg font-bold font-sans text-[foreground] mb-3">
                      {commitment.title}
                    </h3>
                    <p className="text-[muted-foreground] leading-relaxed text-sm sm:text-base">
                      {commitment.description}
                    </p>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
