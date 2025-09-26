import {
  LayoutDashboard,
  Handshake,
  Newspaper,
  Users,
  ShieldMinus,
  Mail,
  Puzzle,
  Moon,
  SunMedium,
  X,
  ChevronLeft,
  ChevronRight,
  Palette,
  Megaphone,
  Columns3Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAdminTheme } from "@/contexts/ThemeLocalContext";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

const socket = io(`${import.meta.env.VITE_MAIN_BE_URL}`);

// Menu gốc
const menuItems = [
  { name: "Tổng quan", path: "/managers/dashboard", icon: LayoutDashboard },
  { name: "Dịch vụ", path: "/managers/services", icon: Handshake },
  { name: "Liên hệ", path: "/managers/contact", icon: Mail },
  { name: "Tin tức", path: "/managers/news", icon: Newspaper },
  { name: "Truyền thông", path: "/managers/marketing", icon: Megaphone },
  {
    name: "Thiết kế Website",
    path: "/managers/website-templates",
    icon: Palette,
  },
  {
    name: "Cấu hình trang web",
    path: "/managers/page-config",
    icon: Columns3Cog,
  },
  { name: "Khu vực quản trị", path: "/managers/admin-zone", icon: ShieldMinus },
  { name: "Component", path: "/managers/components", icon: Puzzle },
];

const SidebarContent = ({
  isCollapsed,
  toggleCollapse,
  onClose,
  isMobile = false,
}) => {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useAdminTheme();
  const navigate = useNavigate();

  const [todayVisits, setTodayVisits] = useState(0);
  const [user, setUser] = useState(null);

  // Check active path
  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  // Fetch user
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user);
    } catch (err) {
      console.error("Lỗi lấy user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Filter menu theo role
  const filteredMenuItems = menuItems.filter((item) => {
    if (user?.role === "dev") {
      return true; // dev thấy tất cả
    }

    if (user?.role === "admin") {
      // admin không thấy component
      if (item.path === "/managers/components") return false;
      return true;
    }

    // user thường: ẩn admin-zone + component
    if (
      item.path === "/managers/admin-zone" ||
      item.path === "/managers/components"
    ) {
      return false;
    }
    return true;
  });

  // Redirect khi vào page-config
  useEffect(() => {
    if (pathname === "/managers/page-config") {
      navigate("/managers/page-config/header", { replace: true });
    }
  }, [pathname, navigate]);

  // Fetch lượt truy cập
  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/site/visits/today`
      );
      const data = await res.json();
      setTodayVisits(data.total);
    } catch (err) {
      console.error("Không lấy được visit:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    socket.on("newVisit", () => {
      fetchData();
    });

    return () => {
      socket.off("newVisit");
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 admin-dark:bg-gray-900 admin-dark:border-gray-700">
      {/* Header */}
      {!isMobile && (
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 admin-dark:border-gray-700">
          <h1
            className={cn(
              "font-bold text-gray-900 admin-dark:text-gray-50 transition-all duration-300 ease-in-out",
              isCollapsed && !isMobile ? "text-2xl" : "text-xl",
            )}
          >
            {isCollapsed && !isMobile ? "M" : "Modi"}
          </h1>

          {/* Collapse Button */}
          {!isMobile && (
            <Button
              theme={isDark ? "admin" : "light"}
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-transform duration-200 hover:scale-110 text-slate-800 admin-dark:text-slate-100 cursor-pointer"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
      )}
      {/* Menu */}
      <nav
        className={cn(
          "flex-1 py-4 space-y-1 overflow-y-auto transition-all duration-300 ease-in-out",
          isCollapsed && !isMobile ? "px-2" : "px-3"
        )}
      >
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              "flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group",
              isCollapsed && !isMobile ? "justify-center" : "px-3",
              isActive(item.path)
                ? "bg-primary text-primary-foreground shadow-sm scale-[0.98]"
                : "text-gray-700 hover:bg-gray-100 hover:scale-[0.99] admin-dark:text-gray-300 admin-dark:hover:bg-gray-700"
            )}
            title={isCollapsed && !isMobile ? item.name : undefined}
            aria-label={item.name}
          >
            <item.icon
              className={cn(
                "h-5 w-5 transition-all duration-200 ease-in-out group-hover:scale-110",
                isCollapsed && !isMobile ? "" : "mr-3"
              )}
            />
            <span
              className={cn(
                "transition-opacity duration-300 ease-in-out",
                isCollapsed && !isMobile
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100",
                !isMobile && "whitespace-nowrap"
              )}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Today visits */}
      <div className="px-2 flex items-center justify-between transition-all duration-300 ">
        {isCollapsed && !isMobile ? (
          ""
        ) : (
          <span className="font-medium text-xs text-gray-900 admin-dark:text-gray-50 transition-all duration-300 mb-2">
            Lượt truy cập hôm nay:
          </span>
        )}

        <span
          className={`${isCollapsed && !isMobile ? "w-full" : ""
            } font-medium text-xs text-center text-gray-900 admin-dark:text-gray-50 mb-2`}
        >
          {todayVisits.toLocaleString("vi-VN")}
        </span>
      </div>

      {/* Theme Toggle */}
      <div className="p-3 border-t border-gray-200 admin-dark:border-gray-600 overflow-hidden">
        <Button
          theme={isDark ? "admin" : "light"}
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="w-full text-xs cursor-pointer border-gray-700  bg-gray-200 text-slate-800 admin-dark:text-slate-100"
        >
          <>
            {!(isCollapsed && isMobile) && (isDark ? <SunMedium /> : <Moon />)}
            {!isCollapsed && (isDark ? "Chế độ sáng" : "Chế độ tối")}
          </>
        </Button>
      </div>
    </div>
  );
};

const AdminSidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const { isDark } = useAdminTheme(); // 👈 thêm dòng này
  return (
    <>
      {/* Desktop */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-2 lg:top-2 lg:bottom-2",
          "lg:rounded-2xl lg:border lg:border-gray-200 admin-dark:lg:border-gray-700",
          "overflow-hidden bg-white admin-dark:bg-gray-800 shadow-lg z-10",
          "transition-all duration-300 ease-in-out transform",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </div>

      {/* Mobile */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className={cn(
            "w-64 p-0 overflow-hidden shadow-lg border-r transition-transform duration-300 ease-in-out",
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-50"
              : "bg-white border-gray-200 text-gray-900"
          )}
        >
          <SheetHeader className="h-16 admin-dark:bg-gray-800 flex items-center justify-between flex-row px-4 border-b border-gray-200 admin-dark:border-gray-800">
            <SheetTitle className="text-xl font-bold text-gray-900 admin-dark:text-gray-50">Modi</SheetTitle>
            <SheetDescription className="sr-only">
              Menu điều hướng admin
            </SheetDescription>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-transform duration-200 hover:scale-110"
              onClick={onClose}
              aria-label="Đóng menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <SidebarContent
            isCollapsed={false}
            toggleCollapse={toggleCollapse}
            onClose={onClose}
            isMobile
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminSidebar;
