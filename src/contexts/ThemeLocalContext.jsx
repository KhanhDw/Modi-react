import { createContext, useContext, useState, useEffect } from "react";

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

  // 🔄 Lưu vào localStorage khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem("themeAdminDark", isDark.toString());
    } catch {}
  }, [isDark]);

  // 🌙 Áp dụng class lên <html> khi ở trong layout admin
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("admin-dark");
    } else {
      root.classList.remove("admin-dark");
    }

    // Dọn dẹp khi unmount (rời trang admin)
    return () => {
      root.classList.remove("admin-dark");
    };
  }, [isDark]);

  // 🧠 Đồng bộ theme giữa nhiều tab admin
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "themeAdminDark") {
        setIsDark(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context)
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return context;
};
