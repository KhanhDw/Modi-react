import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"


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
  const { t } = useLanguage()

  return (
    <section
      id="cta-section"
      className="py-20 px-4 relative overflow-hid den"
    >
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover shadow-lg"
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
          {t("aboutV2.CTASection.title")}
        </h2>

        <p
          className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto transition-all duration-800 delay-200 ${isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          {t("aboutV2.CTASection.description")}
        </p>

        <Button
          size="lg"
          variant="secondary"
          className={`text-primary cursor-pointer dark:hover:text-gray-800 hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-800 delay-400 hover:scale-110 ${isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
          onClick={() => navigate("/contact")}
        >
          {t("aboutV2.CTASection.contactButton")}
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000" />
    </section>
  )
}
