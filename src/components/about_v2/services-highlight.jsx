
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Palette, Search, ShoppingCart, Wrench, Lightbulb, Smartphone } from "lucide-react";


const services = [
  {
    title: "Thiết kế giao diện",
    description: "Tạo giao diện đẹp, responsive trên mọi thiết bị với trải nghiệm người dùng tối ưu.",
    icon: Palette,
  },
  {
    title: "Tối ưu SEO",
    description: "Giúp website của bạn xuất hiện cao trên kết quả tìm kiếm, thu hút khách hàng tiềm năng.",
    icon: Search,
  },
  {
    title: "E-commerce",
    description: "Xây dựng cửa hàng trực tuyến chuyên nghiệp, tăng doanh số bán hàng hiệu quả.",
    icon: ShoppingCart,
  },
  {
    title: "Bảo trì & Hỗ trợ",
    description: "Dịch vụ bảo trì 24/7, đảm bảo website luôn hoạt động ổn định và an toàn.",
    icon: Wrench,
  },
  {
    title: "Tư vấn chiến lược",
    description: "Đưa ra lời khuyên chuyên môn về chiến lược số hóa và phát triển trực tuyến.",
    icon: Lightbulb,
  },
  {
    title: "Thiết kế di động",
    description: "Tối ưu hóa trải nghiệm trên thiết bị di động, đáp ứng xu hướng sử dụng hiện tại.",
    icon: Smartphone,
  },
];



export function ServicesHighlight() {
  const [visibleCards, setVisibleCards] = useState([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          services.forEach((_, index) => {
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
  }, [])

  return (
    <section id="services-highlight" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-6">
          Giải pháp thiết kế web của chúng tôi
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Chúng tôi cung cấp các giải pháp thiết kế website hiện đại, từ giao diện sáng tạo đến trải nghiệm người dùng
          tối ưu.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon; // ✅ lấy component icon từ object
            return (
              <Card
                key={index}
                className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 ${visibleCards.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-10 h-10 text-primary mb-4 mx-auto" /> {/* render icon */}
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
