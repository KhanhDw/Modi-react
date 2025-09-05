

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Lightbulb, Users, Star } from "lucide-react";
const milestones = [
  {
    title: "Ý tưởng ban đầu",
    description:
      "Chúng tôi muốn phá vỡ giới hạn của thiết kế web truyền thống, mang đến giao diện đẹp và hiệu quả.",
    icon: Lightbulb, // 💡
  },
  {
    title: "Đội ngũ sáng lập",
    description:
      "Tập hợp những tài năng trẻ, đam mê công nghệ và thiết kế để xây dựng tầm nhìn chung.",
    icon: Users, // 👥
  },
  {
    title: "Tầm nhìn tương lai",
    description:
      "Trở thành đối tác tin cậy của các doanh nghiệp trong hành trình chuyển đổi số.",
    icon: Star, // ⭐
  },
];

export function StartupJourney() {
  const [visibleCards, setVisibleCards] = useState([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          milestones.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index])
            }, index * 200)
          })
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("startup-journey")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="startup-journey" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-6">
          Hành trình khởi đầu của chúng tôi
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Mộc Điền ra đời từ khát vọng mang đến những website độc đáo, giúp doanh nghiệp nhỏ vươn xa.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon; // ✅ gán icon component
            return (
              <Card
                key={index}
                className={`transition-all  duration-500 hover:scale-105 hover:shadow-lg border-2 hover:border-accent/50 ${visibleCards.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-10 h-10 text-primary mb-4 mx-auto" /> {/* render icon */}
                  <h3 className="text-xl font-bold font-sans text-foreground mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {milestone.description}
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
