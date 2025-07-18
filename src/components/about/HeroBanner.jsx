"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../../contexts/about/ThemeContext"
import { useLanguage } from "../../contexts/about/LanguageContext"

const ChevronDown = () => (
  <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
)

export default function HeroBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const { isDark } = useTheme()
  const { t } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Content */}
      <div
        className={`relative z-10 text-center px-4 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Banner Image Section with Title Inside */}
        <div className="mb-8">
          <div className="relative max-w-7xl mx-auto">
            <div
              className={`backdrop-blur-sm rounded-3xl p-4 border transition-all duration-500 relative overflow-hidden ${
                isDark
                  ? "bg-white/10 border-white/20 hover:bg-white/15"
                  : "bg-black/10 border-black/20 hover:bg-black/15"
              }`}
            >
              <img
                src="/public/images/banner1.jpg"
                alt="Banner công ty"
                className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-4 bg-gradient-to-t from-black/60 via-black/30 to-black/20 rounded-2xl"></div>

              {/* Title overlay on banner */}
              <div className="absolute inset-4 flex items-center justify-center rounded-2xl">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient font-sans drop-shadow-2xl">
                    {t("whoAreWe")}
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <p className={`text-xl md:text-2xl leading-relaxed ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {t("welcome")}
          </p>

          <p className={`text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>{t("description")}</p>

          <div
            className={`inline-flex items-center space-x-3 backdrop-blur-sm rounded-full px-8 py-4 border mt-8 ${
              isDark ? "bg-white/10 border-white/20" : "bg-black/10 border-black/20"
            }`}
          >
            <span className="text-cyan-400 font-bold text-lg">{t("codeQuality")}</span>
            <span className={`text-xl ${isDark ? "text-white" : "text-black"}`}>•</span>
            <span className="text-purple-400 font-bold text-lg">{t("reasonablePrice")}</span>
            <span className={`text-xl ${isDark ? "text-white" : "text-black"}`}>•</span>
            <span className="text-pink-400 font-bold text-lg">{t("dedicatedSupport")}</span>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <div className={isDark ? "text-white" : "text-black"}>
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-5 w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
    </section>
  )
}
