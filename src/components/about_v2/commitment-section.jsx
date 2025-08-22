import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

import {
  CheckCircle,
  Zap,
  Headphones,
  ShieldCheck,
  DollarSign,
  CalendarCheck
} from "lucide-react"

const commitments = [
  {
    title: "100% hài lòng",
    description: "Chúng tôi đảm bảo website của bạn đẹp và dễ sử dụng, hoàn tiền nếu không hài lòng.",
    icon: CheckCircle,
  },
  {
    title: "Tối ưu hiệu suất",
    description: "Website tải nhanh, SEO tốt, giúp bạn tiếp cận khách hàng hiệu quả hơn.",
    icon: Zap,
  },
  {
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
    icon: Headphones,
  },
  {
    title: "Bảo mật tuyệt đối",
    description: "Áp dụng các tiêu chuẩn bảo mật cao nhất để bảo vệ dữ liệu của bạn.",
    icon: ShieldCheck,
  },
  {
    title: "Giá cả hợp lý",
    description: "Dịch vụ chất lượng cao với mức giá phù hợp với mọi quy mô doanh nghiệp.",
    icon: DollarSign,
  },
  {
    title: "Giao hàng đúng hạn",
    description: "Cam kết hoàn thành dự án đúng thời gian đã thỏa thuận.",
    icon: CalendarCheck,
  },
]


export function CommitmentSection() {
  const [visibleCards, setVisibleCards] = useState([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          commitments.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index])
            }, index * 150)
          })
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("commitment-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="commitment-section" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-12">Cam kết của chúng tôi</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {commitments.map((commitment, index) => (
            <Card
              key={index}
              className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-2 hover:border-secondary/50 ${visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                <commitment.icon className="text-4xl mb-4" />
                <h3 className="text-xl font-bold font-sans text-foreground mb-3">{commitment.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{commitment.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
