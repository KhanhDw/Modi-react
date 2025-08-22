import { useTheme } from "../../contexts/ThemeContext"
import { useLanguage } from "../../contexts/LanguageContext"

const Users = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

export default function Customers() {
  const { isDark } = useTheme()
  const { t } = useLanguage()

  const customers = [
    {
      type: t("about.startups"),
      description: t("about.startupsDescription"),
      icon: "🚀",
      color: "from-cyan-500 to-blue-500",
    },
    {
      type: t("about.stores"),
      description: t("about.storesDescription"),
      icon: "🛍️",
      color: "from-purple-500 to-pink-500",
    },
    {
      type: t("about.youngPeople"),
      description: t("about.youngPeopleDescription"),
      icon: "💡",
      color: "from-green-500 to-teal-500",
    },
    {
      type: t("about.education"),
      description: t("about.educationDescription"),
      icon: "🎓",
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section className={`py-20 px-4 transition-all duration-500 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="text-4xl"></span>
            <h2
              className={`text-4xl md:text-5xl font-bold transition-colors duration-500 ${
                isDark ?  "text-white":"text-gray-900"
              }`}
            >
              {t("about.ourCustomers")}
            </h2>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-6"></div>
          <p
            className={`text-lg max-w-3xl mx-auto transition-colors duration-500 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("about.customersDescription")}
          </p>
        </div>

        {/* Grid 4 cột đều nhau với height cố định */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customers.map((customer, index) => (
            <div key={index} className="group">
              <div
                className={`rounded-3xl p-6 border transition-all duration-500 hover:scale-105 h-full flex flex-col min-h-[280px] ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70"
                    : "bg-white border-gray-200 hover:bg-gray-50 shadow-lg hover:shadow-xl"
                }`}
              >
                {/* Icon section - fixed height */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${customer.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {customer.icon}
                  </div>
                </div>

                {/* Content section - flexible height */}
                <div className="flex-1 flex flex-col text-center">
                  {/* Title - fixed height */}
                  <div className="h-16 flex items-center justify-center mb-4">
                    <h3
                      className={`text-xl font-bold group-hover:text-cyan-400 transition-colors leading-tight ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {customer.type}
                    </h3>
                  </div>

                  {/* Description - flexible height */}
                  <div className="flex-1 flex items-start justify-center">
                    <p
                      className={`leading-relaxed text-sm text-center transition-colors duration-500 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {customer.description}
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
