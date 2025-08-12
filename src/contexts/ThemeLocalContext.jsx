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

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleTheme }}>
      {/* 
        Bọc children bằng một div riêng, thêm class `admin-dark` nếu isDark = true.
        Chỉ áp dụng dark mode cho layout admin, không ảnh hưởng theme toàn cục.
      */}
      <div className={isDark ? "admin-dark" : ""}>
        {children}
      </div>
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
