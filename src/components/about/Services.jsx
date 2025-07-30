"use client"

import { useTheme } from "../../contexts/about/ThemeContext"
import { useLanguage } from "../../contexts/about/LanguageContext"
import { Link } from "react-router-dom"

const Code = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const Smartphone = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
)

const Cog = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export default function Services() {
  const { isDark } = useTheme()
  const { t } = useLanguage()

  const services = [
    {
      icon: <Code className="w-12 h-12" />,
      title: t("websiteDesign"),
      emoji: "🌐",
      items: [t("websiteItem1"), t("websiteItem2"), t("websiteItem3")],
      color: "from-cyan-500 to-blue-500",
      link: "/services/website-development",
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: t("mobileApp"),
      emoji: "📱",
      items: [t("mobileItem1"), t("mobileItem2"), t("mobileItem3")],
      color: "from-purple-500 to-pink-500",
      link: "/services/mobile-app-development",
    },
    {
      icon: <Cog className="w-12 h-12" />,
      title: t("additionalServices"),
      emoji: "🛠️",
      items: [t("additionalItem1"), t("additionalItem2"), t("additionalItem3")],
      color: "from-green-500 to-teal-500",
      link: "/services/additional-services",
    },
  ]

  return (
    <section className={`py-20 px-4 transition-all duration-500 ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-500 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            🧩 {t("whatWeBring")}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-6"></div>
          <p
            className={`text-lg max-w-3xl mx-auto transition-colors duration-500 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("servicesDescription")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) =>
            index === 0 ? (
              <Link
                key={index}
                // dùng Link để chuyển hướng đến trang khác
                to="/"     
                className={`group h-full block rounded-3xl p-8 border transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700/70"
                    : "bg-white border-gray-200 hover:bg-gray-50 shadow-lg hover:shadow-xl"
                }`}
                aria-label={`Go to ${service.title} page`}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {service.icon}
                  </div>
                  <span className="text-4xl">{service.emoji}</span>
                </div>

                <h3
                  className={`text-2xl font-bold mb-6 group-hover:text-cyan-400 transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {service.title}
                </h3>

                <div className="flex-grow">
                  <ul className="space-y-4">
                    {service.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span
                          className={`leading-relaxed transition-colors duration-500 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ) : (
              <div key={index} className="group h-full">
                <div
                  className={`rounded-3xl p-8 border transition-all duration-500 hover:scale-105 hover:-translate-y-2 h-full flex flex-col ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700/70"
                      : "bg-white border-gray-200 hover:bg-gray-50 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {service.icon}
                    </div>
                    <span className="text-4xl">{service.emoji}</span>
                  </div>

                  <h3
                    className={`text-2xl font-bold mb-6 group-hover:text-cyan-400 transition-colors ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {service.title}
                  </h3>

                  <div className="flex-grow">
                    <ul className="space-y-4">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span
                            className={`leading-relaxed transition-colors duration-500 ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
