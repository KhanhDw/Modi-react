"use client"

import { useTheme } from "../../contexts/about/ThemeContext"
import { useLanguage } from "../../contexts/about/LanguageContext"

const Shield = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const Zap = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const DollarSign = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
)

const Palette = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
    />
  </svg>
)

export default function WhyChooseUs() {
  const { isDark } = useTheme()
  const { t } = useLanguage()

  const reasons = [
    {
      icon: <Shield className="w-8 h-8" />,
      emoji: "🔹",
      title: t("reason1Title"),
      description: t("reason1Description"),
      color: "text-cyan-400",
      bgColor: isDark ? "bg-slate-700/30" : "from-cyan-500/10 to-blue-500/10",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      emoji: "🔹",
      title: t("reason2Title"),
      description: t("reason2Description"),
      color: "text-yellow-400",
      bgColor: isDark ? "bg-slate-700/30" : "from-yellow-500/10 to-orange-500/10",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      emoji: "🔹",
      title: t("reason3Title"),
      description: t("reason3Description"),
      color: "text-green-400",
      bgColor: isDark ? "bg-slate-700/30" : "from-green-500/10 to-teal-500/10",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      emoji: "🔹",
      title: t("reason4Title"),
      description: t("reason4Description"),
      color: "text-purple-400",
      bgColor: isDark ? "bg-slate-700/30" : "from-purple-500/10 to-pink-500/10",
    },
  ]

  return (
    <section
      className={`py-20 px-4 transition-all duration-500 ${
        isDark ? "bg-slate-800" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-500 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            🚀 {t("whyChooseUs")}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="group">
              <div
                className={`${isDark ? reason.bgColor : `bg-gradient-to-r ${reason.bgColor}`} rounded-3xl p-8 border transition-all duration-500 hover:scale-105 h-full ${
                  isDark ? "border-slate-600 hover:bg-slate-700/50" : "border-gray-200 hover:bg-white/50"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">{reason.emoji}</span>
                    <div className={`${reason.color} group-hover:scale-110 transition-transform duration-300`}>
                      {reason.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-4 group-hover:text-cyan-300 transition-colors leading-tight ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {reason.title}
                    </h3>
                    <p
                      className={`leading-relaxed transition-colors duration-500 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
