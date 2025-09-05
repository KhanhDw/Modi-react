import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("cta-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="cta-section"
      className="py-20 px-4 relative overflow-hid den"
    >
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/khoidauduan.mp4" // đổi path video của bạn
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay để dễ đọc chữ */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h2
          className={`text-3xl md:text-4xl font-bold font-sans mb-6 transition-all duration-800 ${isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          Bắt đầu dự án của bạn ngay hôm nay
        </h2>

        <p
          className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto transition-all duration-800 delay-200 ${isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          Hãy để Mộc Điền giúp bạn xây dựng website mơ ước. Liên hệ ngay để nhận tư vấn miễn phí!
        </p>

        <Button
          size="lg"
          variant="secondary"
          className={`text-primary dark:hover:text-gray-800 hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-800 delay-400 hover:scale-110 ${isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
          onClick={() => navigate("/contact")}
        >
          Liên hệ ngay
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000" />
    </section>
  )
}
