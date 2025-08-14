import { useTheme } from "../../../contexts/ThemeContext"
import { useLanguage } from "../../../contexts/LanguageContext"
import { Link, useLocation } from "react-router-dom";

const Sun = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const Moon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const Globe = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

export default function ThemeToggle() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isServiceOrder = params.has("service-order");
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex space-x-3">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`
          p-2 sm:p-3 rounded-full border transition-all duration-300 hover:scale-110
          ${isDark
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
          }
        `}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <Sun className="w-5 sm:w-6 h-5 sm:h-6" /> : <Moon className="w-5 sm:w-6 h-5 sm:h-6" />}
      </button>

      {/* Language Toggle Button */}
      <button
        disabled={isServiceOrder}
        onClick={toggleLanguage}
        className={`
          ${isServiceOrder ? "cursor-not-allowed opacity-50" : ""}
          p-2 sm:p-3 w-16 sm:w-20 rounded-full border transition-all duration-300 hover:scale-110 flex items-center justify-center space-x-1 sm:space-x-2
          ${isDark
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
          }
        `}
        title={language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        aria-label={language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
      >
        <Globe className="w-4 sm:w-5 h-4 sm:h-5" />
        <span className="text-xs sm:text-sm font-semibold">{language === "vi" ? "EN" : "VI"}</span>
      </button>
    </div>
  );
}