import { useLocation } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Theme Toggle Component for About Page
 * Component điều khiển chuyển đổi theme và ngôn ngữ
 *
 * Features:
 * - Dark/Light mode toggle
 * - Language toggle (VI/EN)
 * - Fixed position at top-right
 * - Hover effects
 * - Tooltips
 */

const Sun = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const Moon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const Globe = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
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

  const animationProps = {
    initial: { y: -10, opacity: 0, rotate: -90 },
    animate: { y: 0, opacity: 1, rotate: 0 },
    exit: { y: 10, opacity: 0, rotate: 90 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  return (
    <div className="flex items-center space-x-1 xl:bg-gray-100/80 dark:bg-gray-800/50 rounded-full xl:p-1 ">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`
          relative w-9 h-9 flex items-center justify-center rounded-full
          text-gray-500 dark:text-gray-400
          hover:bg-gray-200 dark:hover:bg-gray-700
          hover:text-gray-950 dark:hover:text-gray-400
          transition-colors duration-200
          cursor-pointer
        `}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          {isDark ? (
            <motion.div
              key="sun"
              {...animationProps}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              {...animationProps}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Language Toggle Button */}
      <button
        disabled={isServiceOrder}
        onClick={toggleLanguage}
        className={`
          relative h-9 px-3 flex items-center justify-center rounded-full
          text-gray-500 dark:text-gray-400
          hover:bg-gray-200 dark:hover:bg-gray-700
          hover:text-blue-500 dark:hover:text-blue-400
          transition-colors duration-200
          cursor-pointer
          disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent
        `}
        title={
          language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"
        }
        aria-label={
          language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"
        }
      >
        <Globe className="w-5 h-5 mr-1.5" />
        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={language}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute text-xs font-bold"
            >
              {language === "vi" ? "EN" : "VI"}
            </motion.span>
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
}
