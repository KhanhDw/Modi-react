

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

export function MissionVision() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("mission-vision")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="mission-vision" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-center text-foreground mb-12">
          Sứ mệnh & Tầm nhìn
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <Card
            className={`transition-all duration-600 hover:shadow-lg border-2 hover:border-primary/50 ${isVisible ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-8"
              }`}
          >
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                <h3 className="text-2xl font-bold font-sans text-foreground">Sứ mệnh của chúng tôi</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi cam kết mang đến các website sáng tạo, dễ sử dụng, và giúp doanh nghiệp xây dựng thương hiệu
                mạnh mẽ. Mỗi dự án là cơ hội để chúng tôi thể hiện đam mê và chuyên môn, tạo ra những trải nghiệm số
                đáng nhớ.
              </p>
            </CardContent>
          </Card>

          <Card
            className={`transition-all duration-600 delay-200 hover:shadow-lg border-2 hover:border-secondary/50 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
          >
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                <h3 className="text-2xl font-bold font-sans text-foreground">Tầm nhìn của chúng tôi</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Trở thành công ty thiết kế web hàng đầu khu vực, mang đến giải pháp trực tuyến đột phá. Chúng tôi hướng
                tới việc định hình tương lai của thiết kế web tại Việt Nam.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
