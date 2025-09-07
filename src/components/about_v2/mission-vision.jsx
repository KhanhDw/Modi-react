import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import useCurrentLanguage from "@/hook/currentLang"

export function MissionVision() {
  const { lang } = useCurrentLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    // Quan sát khi scroll tới section
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

  useEffect(() => {
    // Fetch dữ liệu từ API
    fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/type/vision_mission?slug=about`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data) // data là mảng các mục vision & mission
      })
      .catch((err) => console.error("Fetch Mission & Vision error:", err))
  }, [lang]) // refetch khi đổi ngôn ngữ

  return (
    <section id="mission-vision" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-center text-foreground mb-12">
          {lang === "vi" ? "Sứ mệnh & Tầm nhìn" : "Mission & Vision"}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <Card
              key={item.id}
              className={`transition-all duration-600 hover:shadow-lg border-2 ${index % 2 === 0 ? "hover:border-primary/50" : "hover:border-secondary/50"
                } ${isVisible
                  ? "opacity-100 translate-x-0"
                  : index % 2 === 0
                    ? "opacity-0 -translate-x-8"
                    : "opacity-0 translate-x-8"
                }`}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${index % 2 === 0 ? "bg-primary" : "bg-secondary"
                      }`}
                  ></div>
                  <h3 className="text-2xl font-bold font-sans text-foreground">
                    {item.title?.[lang] || "Chưa có tiêu đề"}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description?.[lang] || "Chưa có mô tả"}
                </p>
                {item.image_url && (
                  <img
                    src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image_url}`}
                    alt={item.title?.[lang] || ""}
                    className="w-full h-40 object-cover rounded-lg mt-4 shadow"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
