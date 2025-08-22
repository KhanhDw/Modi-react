

import { useEffect, useState } from "react"

export function CompanyOverview() {
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

    const element = document.getElementById("company-overview")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="company-overview" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-600 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-6">Chúng tôi là Sáng Tạo Web</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              Sáng Tạo Web là công ty thiết kế website mới, được thành lập với niềm đam mê mang đến trải nghiệm trực
              tuyến độc đáo. Chúng tôi tập trung vào giao diện đẹp, hiệu suất cao, và thân thiện với người dùng, giúp
              doanh nghiệp của bạn nổi bật trong thế giới số.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Đội ngũ trẻ của chúng tôi luôn sẵn sàng đồng hành cùng bạn, mang đến những giải pháp web sáng tạo và hiệu
              quả nhất.
            </p>
          </div>

          <div
            className={`transition-all duration-600 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
          >
            <div className="relative">
              <img
                src="/placeholder-nzovq.png"
                alt="Đội ngũ Sáng Tạo Web làm việc"
                className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
