import { useTheme } from "../../contexts/ThemeContext"
import { useLanguage } from "../../contexts/LanguageContext"

const Phone = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const Mail = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const Globe = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
)

const MessageCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

export default function Contact() {
  const { isDark } = useTheme()
  const { t } = useLanguage()

  const contacts = [
    {
      icon: <Phone className="w-7 h-7" />,
      label: t("about.phoneLabel"),
      value: t("about.phonePlaceholder"),
      emoji: "📱",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Mail className="w-7 h-7" />,
      label: t("about.emailLabel"),
      value: t("about.emailPlaceholder"),
      emoji: "📧",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Globe className="w-7 h-7" />,
      label: t("about.websiteLabel"),
      value: t("about.websitePlaceholder"),
      emoji: "🌐",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <MessageCircle className="w-7 h-7" />,
      label: t("about.fanpageLabel"),
      value: t("about.fanpagePlaceholder"),
      emoji: "💬",
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section
      className={`py-20 px-4 transition-all duration-500 ${
        isDark ? "bg-slate-900" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-500 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            📞 {t("about.contactUs")}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-8"></div>

          <div className="max-w-4xl mx-auto mb-12">
            <p
              className={`text-lg md:text-xl leading-relaxed mb-6 transition-colors duration-500 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              {t("about.contactDescription")}
            </p>
            <p className="text-cyan-400 text-xl font-semibold">{t("about.freeConsultationText")}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contacts.map((contact, index) => (
            <div key={index} className="group">
              <div
                className={`rounded-2xl p-6 border transition-all duration-300 hover:scale-105 text-center h-full ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70"
                    : "bg-white/80 border-gray-200 hover:bg-white hover:shadow-lg"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${contact.color} text-white group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg`}
                  >
                    {contact.icon}
                  </div>
                </div>
                <div className="text-3xl mb-3">{contact.emoji}</div>
                <h3
                  className={`font-bold text-lg mb-2 transition-colors duration-500 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {contact.label}
                </h3>
                <p
                  className={`text-sm break-words transition-colors duration-500 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {contact.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 group">
              <span className="group-hover:scale-110 transition-transform inline-block">
                🚀 {t("about.freeConsultation")}
              </span>
            </button>
            <button
              className={`border-2 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 group ${
                isDark
                  ? "border-slate-600 text-white hover:bg-slate-800/50"
                  : "border-gray-300 text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span className="group-hover:scale-110 transition-transform inline-block">📂 {t("about.viewPortfolio")}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
