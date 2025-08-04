
import { useTheme } from "../../contexts/ThemeContext"
import { useLanguage } from "../../contexts/LanguageContext"

const Lightbulb = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
)

export default function Mission() {
  const { isDark } = useTheme()
  const { t } = useLanguage()

  return (
    <section className={`py-20 px-4 relative transition-all duration-500 ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-8">
            <Lightbulb className="w-10 h-10 text-yellow-400" />
            <h2
              className={`text-4xl md:text-5xl font-bold transition-colors duration-500 ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {t("about.ourMission")}
            </h2>
          </div>

          <div
            className={`rounded-3xl p-12 border max-w-5xl mx-auto relative overflow-hidden transition-all duration-500 ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-gradient-to-r from-cyan-50 to-purple-50 border-gray-200"
              }`}
          >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-xl"></div>

            <blockquote
              className={`text-2xl md:text-4xl font-bold mb-8 leading-relaxed relative z-10 transition-colors duration-500 ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              <span className="text-6xl text-cyan-400 opacity-50 absolute -top-4 -left-2">"</span>
              {t("about.missionQuote")}
              <span className="text-6xl text-purple-400 opacity-50 absolute -bottom-8 -right-2">"</span>
            </blockquote>

            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-8"></div>

            <p
              className={`text-lg md:text-xl leading-relaxed relative z-10 transition-colors duration-500 ${isDark ? "text-gray-300" : "text-gray-600"
                }`}
            >
              {t("about.missionDescription")}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { number: "100+", labelKey: "trustedClients", color: "from-cyan-500 to-blue-500" },
            { number: "200+", labelKey: "completedProjects", color: "from-purple-500 to-pink-500" },
            { number: "3+", labelKey: "yearsExperience", color: "from-green-500 to-teal-500" },
            { number: "24/7", labelKey: "customerSupport", color: "from-orange-500 to-red-500" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 border transition-all duration-500 hover:scale-105 group ${isDark
                ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70"
                : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md"
                }`}
            >
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}
              >
                {stat.number}
              </div>
              <p className={`text-sm transition-colors duration-500 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
