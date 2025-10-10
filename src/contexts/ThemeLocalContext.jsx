import { createContext, useContext, useState, useEffect } from "react";

// Context cục bộ cho Admin Theme
const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("themeAdminDark");
      return saved ? saved === "true" : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("themeAdminDark", isDark.toString());
    } catch {}
  }, [isDark]);

  // QUAN TRỌNG: Áp dụng class trực tiếp lên html/body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("admin-dark");
    } else {
      document.documentElement.classList.remove("admin-dark");
    }

    // Cleanup khi unmount
    return () => {
      document.documentElement.classList.remove("admin-dark");
    };
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleTheme }}>
      {/* KHÔNG cần div wrapper nữa */}
      {children}
    </AdminThemeContext.Provider>
  );
}

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
};
