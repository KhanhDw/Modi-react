import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext";
import { Palette, Search, ShoppingCart, Wrench, Lightbulb, Smartphone } from "lucide-react";

export function ServicesHighlight() {
  const [visibleCards, setVisibleCards] = useState([])
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          t("aboutV2.ServicesHighlight.services").forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index])
            }, index * 150)
          })
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("services-highlight")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [t])

  return (
    <section id="services-highlight" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-6">
          {t("aboutV2.ServicesHighlight.title")}
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t("aboutV2.ServicesHighlight.description")}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {t("aboutV2.ServicesHighlight.services").map((service, index) => {
            const Icon = [Palette, Search, ShoppingCart, Wrench, Lightbulb, Smartphone][index];
            return (
              <Card
                key={index}
                className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 ${
                  visibleCards.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-10 h-10 text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-bold font-sans text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  )
}