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
      const savedTheme = localStorage.getItem("about-theme")
      if (savedTheme) {
        setIsDark(savedTheme === "dark")
      }
    } catch (error) {
      console.log("LocalStorage not available")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    try {
      localStorage.setItem("about-theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.log("LocalStorage not available")
    }
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? "dark" : "light"}>{children}</div>
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
