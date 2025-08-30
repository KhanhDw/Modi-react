import { useState, useEffect } from "react";
import {
  AdminThemeProvider,
  useAdminTheme,
} from "@/contexts/ThemeLocalContext";
import AdminSidebar from "@/components/layout/AdminLayout/partials/sidebar/AdminSidebar";
import AdminHeader from "./partials/header/AdminHeader";
import { cn } from "@/lib/utils";

const AdminLayoutInner = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const { theme } = useAdminTheme(); // "light" | "dark"

  // --- Load state từ localStorage khi mount ---
  useEffect(() => {
    const savedHeaderSticky = localStorage.getItem("headerSticky");
    if (savedHeaderSticky) {
      setIsHeaderSticky(savedHeaderSticky === "true");
    }

    const savedSidebarCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedSidebarCollapsed) {
      setSidebarCollapsed(savedSidebarCollapsed === "true");
    }
  }, []);

  // --- Lưu state khi thay đổi ---
  useEffect(() => {
    localStorage.setItem("headerSticky", isHeaderSticky.toString());
  }, [isHeaderSticky]);

  const toggleSidebar_Collapse = () => {
    setSidebarCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem("sidebarCollapsed", newValue.toString());
      return newValue;
    });
  };


  return (
    <div
      className={cn(
        "scroll-container flex min-h-screen bg-slate-50 text-slate-900 admin-dark:bg-slate-900 admin-dark:text-slate-100",
        theme === "dark" && "admin-dark"
      )}
    >
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={toggleSidebar_Collapse}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 min-h-screen  overflow-x-hidden flex flex-col transition-all duration-300 ease-in-out bg-gray-300 admin-dark:bg-gray-700 lg:py-2 pt-2",
          sidebarCollapsed ? "lg:pl-20 lg:py-2 lg:pr-2" : "lg:pl-68 lg:pr-2"
        )}
      >
        {/* Header */}
        <AdminHeader
          isSidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isHeaderSticky={isHeaderSticky}
          setIsHeaderSticky={setIsHeaderSticky}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 h-full overflow-y-auto overflow-x-hidden rounded-lg shadow-sm  mt-2 bg-white text-slate-900 admin-dark:bg-slate-800 admin-dark:text-slate-100",
            isHeaderSticky && "mt-23"
          )}
        >
          <div className="bg-white admin-dark:bg-gray-900 p-4 h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
};

export default AdminLayout;
