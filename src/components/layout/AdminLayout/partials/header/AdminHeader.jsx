import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { CgWebsite } from "react-icons/cg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlignJustify } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminSettingsDropdown from "@/components/layout/AdminLayout/partials/header/AdminSettingsDropdown";
import { NotificationBell } from "@/components/layout/AdminLayout/partials/header/NotificationBell";
import { useAdminTheme } from "@/contexts/ThemeLocalContext";
import AdminSearch from "@/components/layout/AdminLayout/partials/header/AdminSearch"


const breadcrumbMap = {
  "/managers/dashboard": "Tổng quan",
  "/managers/home-config": "Cấu hình trang chủ",
  "/managers/marketing": "Marketing & Truyền thông",
  "/managers/website-templates": "Thiết kế Website",
  "/managers/news": "Tin tức",
  "/managers/contact": "Liên hệ",
  "/managers/services": "Dịch vụ",
  "/managers/about-config": "Giới thiệu",
  "/managers/admin-zone": "Khu vực quản trị",
  "/managers/components": "Component",
  "/managers/profile": "Component",
};







const AdminHeader = ({
  isSidebarOpen,
  setSidebarOpen,
  isHeaderSticky,
  setIsHeaderSticky,
  sidebarCollapsed,
}) => {
  const location = useLocation();
  const { isDark } = useAdminTheme();

  // Debug khi theme đổi
  useEffect(() => {
    console.log("Theme Admin hiện tại:", isDark ? "dark" : "light");
  }, [isDark]);

  // Lấy trạng thái sticky header từ localStorage
  useEffect(() => {
    const savedSticky = localStorage.getItem("headerSticky");
    if (savedSticky !== null) {
      setIsHeaderSticky(savedSticky === "true");
    }
  }, [setIsHeaderSticky]);

  // Lưu trạng thái sticky header
  useEffect(() => {
    localStorage.setItem("headerSticky", String(isHeaderSticky));
  }, [isHeaderSticky]);

  const currentPath = location.pathname;
  const pageTitle = breadcrumbMap[currentPath] || "NUll";
  const breadcrumb = `Admin / ${pageTitle}`;

  const headerStyle = isHeaderSticky
    ? {
      width: `calc(100% - ${sidebarCollapsed ? "5rem" : "17rem"} - 0.5rem)`,
      left: `${sidebarCollapsed ? "5rem" : "17rem"}`,
    }
    : {};

  return (
    <header
      className={cn(
        "w-full bg-white admin-dark:bg-slate-900 shadow-sm rounded-3xl transition-shadow duration-300 ease-in-out",
        isHeaderSticky && "fixed left-0 right-0 z-50",
        "flex-shrink-0"
      )}
      style={headerStyle}
    >
      <div className="flex items-center justify-between p-4 mx-auto max-w-full">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Đóng menu" : "Mở menu"}
          >
            <AlignJustify className="h-6 w-6 text-gray-600 admin-dark:text-gray-300" />
          </Button>
          <div className="flex flex-col min-w-0">
            <div className="text-sm text-gray-500 admin-dark:text-gray-400 truncate">
              {breadcrumb}
            </div>
            <h1 className="text-xl font-bold text-gray-800 admin-dark:text-gray-100 md:text-2xl truncate">
              {pageTitle}
            </h1>
          </div>
        </div>


        {/* Right */}
        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">

          <AdminSearch />

          {/* Website link */}
          <NavLink to="/">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600  admin-dark:text-gray-300 hover:bg-gray-500 admin-dark:hover:bg-gray-700 flex-shrink-0 cursor-pointer"
              aria-label="Quay lại trang web"
            >
              <CgWebsite className="h-5 w-5" />
              <span className="hidden md:inline text-sm ">Xem Website</span>
            </Button>
          </NavLink>

          {/* Notifications */}
          <NotificationBell />

          {/* Avatar */}
          <NavLink to="/managers/profile">
            <Button
              theme="admin"
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 admin-dark:text-gray-300 hover:bg-gray-600 admin-dark:hover:bg-gray-600 flex-shrink-0 rounded-full cursor-pointer"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-bold">ADMIN</span>
            </Button>
          </NavLink>


          {/* Settings */}
          <AdminSettingsDropdown
            isHeaderSticky={isHeaderSticky}
            setIsHeaderSticky={setIsHeaderSticky}
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
