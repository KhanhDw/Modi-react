

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

const teamMembers = [
  {
    name: "Đội Lập trình",
    role: "Development Team",
    description: "Đội ngũ kỹ sư phần mềm giàu kinh nghiệm, đảm bảo mọi sản phẩm đều hoạt động ổn định, bảo mật và hiệu quả.",
    image: "/CodeTeam.jpg",
  },
  {
    name: "Đội Thiết kế & Sáng tạo",
    role: "Design & Creative Team",
    description: "Đội ngũ thiết kế UX/UI và sáng tạo biến ý tưởng thành trải nghiệm hình ảnh độc đáo, thu hút và chuyên nghiệp.",
    image: "/CreativeTeam.jpg",
  },
  {
    name: "Đội Marketing",
    role: "Marketing Team",
    description: "Chuyên gia marketing và truyền thông giúp thương hiệu tiếp cận đúng khách hàng, xây dựng chiến lược tăng trưởng bền vững.",
    image: "/MarketingTeam.jpg",
  },

]

export function TeamSection() {
  const [visibleCards, setVisibleCards] = useState([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          teamMembers.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index])
            }, index * 200)
          })
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("team-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="team-section" className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-12">Đội ngũ của chúng tôi</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-2 hover:border-accent/50 ${visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-6 group">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold font-sans text-foreground mb-2">{member.name}</h3>
                <p className="text-primary font-semibold mb-3">{member.role}</p>
                <p className="text-muted-foreground leading-relaxed">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
