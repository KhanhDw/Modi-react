import { createContext, useContext, useState, useEffect } from "react"

/**
 * Theme Context for About Page
 * Quản lý chế độ sáng/tối cho trang About
 *
 * Usage:
 * import { ThemeProvider, useTheme } from '../contexts/about/ThemeContext'
 *
 * const { isDark, toggleTheme } = useTheme()
 */

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true) // Mặc định là dark mode

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("web-theme")
      if (savedTheme) {
        setIsDark(savedTheme === "dark")
      }
    } catch (error) {
      console.log("LocalStorage not available")
    }
  }, [])

  useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("web-theme", "dark");
  } else {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("web-theme", "light");
  }
}, [isDark]);


  const toggleTheme = () => setIsDark(prev => !prev)

 return (
  <ThemeContext.Provider value={{ isDark, toggleTheme }}>
    {children}
  </ThemeContext.Provider>
)
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
