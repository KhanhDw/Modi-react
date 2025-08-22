import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function HeroBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden rounded-4xl">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover "
        src="/videos/hero-bg.mp4"   // đổi path video của bạn
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay để dễ đọc chữ */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className={`text-4xl md:text-6xl font-bold font-sans text-white mb-6 transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          Mộc Điền <br /> Kiến tạo tương lai số của bạn
        </h1>

        <p
          className={`text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          Chúng tôi là đội ngũ trẻ, đam mê mang đến những website sáng tạo, hiện đại, và thân thiện với người dùng.
        </p>

        <Button
          size="lg"
          className={`bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-800 delay-400 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          Liên hệ ngay
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000" />
    </section>
  )
}
