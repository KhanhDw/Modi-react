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
import PageSpeed from "./PageSpeed";

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
    if (user?.role === "dev") return true;
    if (user?.role === "admin") {
      if (item.path === "/managers/components") return false;
      return true;
    }
    if (
      item.path === "/managers/admin-zone" ||
      item.path === "/managers/components"
    ) {
      return false;
    }
    return true;
  });

  // Redirect page-config
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
    <div
      className={cn(
        "flex flex-col h-full border-r",
        isDark
          ? "bg-gray-800 border-gray-700 text-gray-50"
          : "bg-white border-gray-200 text-gray-900"
      )}
    >
      {/* Header */}
      {!isMobile && (
        <div
          className={cn(
            "flex items-center justify-between h-16 px-4 border-b",
            isDark ? "border-gray-700" : "border-gray-200"
          )}
        >
          <h1
            className={cn(
              "font-bold transition-all duration-300 ease-in-out",
              isDark ? "text-gray-50" : "text-gray-900",
              isCollapsed && !isMobile ? "text-2xl" : "text-xl"
            )}
          >
            {isCollapsed && !isMobile ? "M" : "Modi"}
          </h1>

          {!isMobile && (
            <Button
              theme={isDark ? "admin" : "light"}
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 transition-transform duration-200 hover:scale-110 cursor-pointer",
                isDark ? "text-slate-100" : "text-slate-800"
              )}
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
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
        {filteredMenuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group",
                isCollapsed && !isMobile ? "justify-center" : "px-3",
                active
                  ? isDark
                    ? "bg-slate-700 text-white shadow-sm scale-[0.98]"
                    : "bg-primary text-primary-foreground shadow-sm scale-[0.98]"
                  : isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-[0.99]"
                  : "text-gray-700 hover:bg-gray-100 hover:scale-[0.99]"
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
          );
        })}
      </nav>

      {/* Today visits */}
      <div className="px-2 flex items-center justify-between transition-all duration-300">
        {isCollapsed && !isMobile ? (
          ""
        ) : (
          <span
            className={cn(
              "font-medium text-xs transition-all duration-300 mb-2",
              isDark ? "text-gray-50" : "text-gray-900"
            )}
          >
            Lượt truy cập hôm nay:
          </span>
        )}

        <span
          className={cn(
            `${
              isCollapsed && !isMobile ? "w-full" : ""
            } font-medium text-xs text-center mb-2`,
            isDark ? "text-gray-50" : "text-gray-900"
          )}
        >
          {todayVisits.toLocaleString("vi-VN")}
        </span>
      </div>
      {/* speed load page */}
      <div className="px-2 flex items-center justify-between transition-all duration-300 ">
        {isCollapsed && !isMobile ? (
          ""
        ) : (
          <span
            className={cn(
              "font-medium text-xs transition-all duration-300 mb-2",
              isDark ? "text-gray-50" : "text-gray-900"
            )}
          >
            Tốc độ tải trang:
          </span>
        )}

        <span
          className={cn(
            `${
              isCollapsed && !isMobile ? "w-full" : ""
            } font-medium text-xs text-center mb-2`,
            isDark ? "text-gray-50" : "text-gray-900"
          )}
        >
          <PageSpeed />
        </span>
      </div>
      <div className="pb-3"></div>

      {/* Theme Toggle */}
      <div
        className={cn(
          "p-3 border-t overflow-hidden",
          isDark ? "border-gray-600" : "border-gray-200"
        )}
      >
        <Button
          theme={isDark ? "admin" : "light"}
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className={cn(
            "w-full text-xs cursor-pointer",
            isDark
              ? "bg-slate-800 text-slate-100 border-gray-600"
              : "bg-gray-200 text-slate-800 border-gray-700"
          )}
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
  const { isDark } = useAdminTheme();

  return (
    <>
      {/* Desktop ≥ lg */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-2 lg:top-2 lg:bottom-2",
          "lg:rounded-2xl lg:border overflow-hidden z-10",
          "transition-all duration-300 ease-in-out transform",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          isDark
            ? "bg-gray-800 border-gray-700 text-gray-50"
            : "bg-white border-gray-200 text-gray-900"
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </div>

      {/* Mobile < lg */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[80vw] max-w-xs transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isDark
            ? "bg-gray-800 border-r border-gray-700 text-gray-50"
            : "bg-white border-r border-gray-200 text-gray-900"
        )}
      >
        <div
          className={cn(
            "h-16 flex items-center justify-between px-4 border-b",
            isDark ? "border-gray-700" : "border-gray-200"
          )}
        >
          <h1
            className={cn(
              "text-lg font-bold",
              isDark ? "text-gray-50" : "text-gray-900"
            )}
          >
            Modi
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 transition-transform duration-200 hover:scale-110",
              isDark ? "text-slate-100" : "text-slate-800"
            )}
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SidebarContent
          isCollapsed={false}
          toggleCollapse={toggleCollapse}
          onClose={onClose}
          isMobile
        />
      </div>
    </>
  );
};

export default AdminSidebar;
