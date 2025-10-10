import { useState, useEffect } from "react";
import {
  AdminThemeProvider,
  useAdminTheme,
} from "@/contexts/ThemeLocalContext";
import AdminSidebar from "@/components/layout/AdminLayout/partials/sidebar/AdminSidebar";
import AdminHeader from "./partials/header/AdminHeader";
import { cn } from "@/lib/utils";
import { useLenisToggle } from "@/contexts/LenisContext"; // THÊM DÒNG NÀY
import useLenisLocal from "@/hook/useLenisLocal";

const AdminLayoutInner = ({ children }) => {
  useLenisLocal(".lenis-local");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const { theme } = useAdminTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setEnabled } = useLenisToggle(); // THÊM DÒNG NÀY

  // --- QUAN TRỌNG: Disable Lenis khi vào admin ---
  useEffect(() => {
    // Disable Lenis scroll toàn cục
    setEnabled(false);

    // Cho phép scroll cục bộ trên body (cho mobile)
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    return () => {
      // Enable Lenis lại khi rời admin
      setEnabled(true);

      // Reset styles
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [setEnabled]);

  // --- Load state từ localStorage khi mount ---
  useEffect(() => {
    const savedHeaderSticky = localStorage.getItem("headerSticky");
    if (savedHeaderSticky) setIsHeaderSticky(savedHeaderSticky === "true");

    const savedSidebarCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedSidebarCollapsed)
      setSidebarCollapsed(savedSidebarCollapsed === "true");
  }, []);

  // --- Lưu state khi thay đổi ---
  useEffect(() => {
    localStorage.setItem("headerSticky", isHeaderSticky.toString());
  }, [isHeaderSticky]);

  const toggleSidebar_Collapse = () => {
    setSidebarCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem("sidebarCollapsed", newValue.toString());
      return newValue;
    });
  };

  // Truyền hàm setIsDialogOpen cho children (page dịch vụ)
  const childrenWithDialogControl =
    typeof children === "function" ? children({ setIsDialogOpen }) : children;

  return (
    <div
      data-lenis-prevent
      className={cn(
        "lenis-local scroll-container flex min-h-screen bg-slate-50 text-slate-900 admin-dark:bg-slate-900 admin-dark:text-slate-100",
        theme === "dark" && "admin-dark"
      )}
    >
      {/* Sidebar + Blur Wrapper */}
      <div
        className={cn(
          "sidebar-blur-wrapper",
          isDialogOpen && "blur-sm pointer-events-none"
        )}
        style={{ transition: "filter 0.3s" }}
      >
        {/* Sidebar được giữ trong DOM để transition hoạt động */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0" // luôn hiện trên desktop
          )}
        >
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            toggleCollapse={toggleSidebar_Collapse}
          />
        </div>
      </div>

      {/* Overlay cho mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out",
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Content - THÊM min-h-0 để flex tính toán đúng */}
      <div
        className={cn(
          "flex-1 min-h-screen min-h-0 overflow-x-hidden flex flex-col transition-all duration-300 ease-in-out bg-gray-300 admin-dark:bg-gray-700 lg:py-2 pt-2",
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

        {/* Page Content - ĐẢM BẢO CÓ SCROLL CỤC BỘ */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden rounded-lg shadow-sm mt-2 bg-white text-slate-900 admin-dark:bg-slate-800 admin-dark:text-slate-100",
            isHeaderSticky && "mt-23"
          )}
          style={{
            WebkitOverflowScrolling: "touch", // Quan trọng cho mobile
            overscrollBehavior: "contain", // Ngăn scroll chain
          }}
        >
          <div className="bg-white admin-dark:bg-gray-900 p-4 min-h-full">
            {childrenWithDialogControl}
          </div>
        </main>
      </div>
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
