import { useState, useEffect } from "react";
import { AdminThemeProvider, useAdminTheme } from "@/contexts/ThemeLocalContext";
import AdminSidebar from "@/components/layout/AdminLayout/partials/AdminSidebar";
import AdminHeader from "./partials/AdminHeader";
import { cn } from "@/lib/utils";

const AdminLayoutInner = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const { theme } = useAdminTheme(); // Lấy theme từ context, ví dụ: "light" | "dark"

  useEffect(() => {
    const savedHeaderSticky = localStorage.getItem("headerSticky");
    if (savedHeaderSticky) {
      setIsHeaderSticky(savedHeaderSticky === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("headerSticky", isHeaderSticky.toString());
  }, [isHeaderSticky]);

  return (
    <div className={cn("flex min-h-screen bg-slate-50", theme === "dark" && "admin-dark")}>
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Container */}
      <div
        className={cn(
          "flex-1 overflow-x-hidden flex flex-col transition-all duration-300 ease-in-out bg-amber-400 lg:py-2 pt-2",
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
            "flex-1 overflow-y-auto overflow-x-hidden bg-white rounded-lg shadow-sm p-4 mt-2",
            isHeaderSticky && "mt-23"
          )}
        >
          <div className="p-4">
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
