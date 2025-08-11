import { useEffect, useRef, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Bell, Settings, AlignJustify, ArrowLeft, Moon, Sun, LogOut, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const breadcrumbMap = {
  "/managers/dashboard": "Tổng quan",
  "/managers/services": "Dịch vụ",
  "/managers/news": "Tin tức",
  "/managers/recruitment": "Tuyển dụng",
  "/managers/contact": "Liên hệ",
  "/managers/components": "Component",
};

const AdminHeader = ({
  isSidebarOpen,
  setSidebarOpen,
  isHeaderSticky,
  setIsHeaderSticky,
  sidebarCollapsed,
}) => {
  const location = useLocation();

  useEffect(() => {
    const savedSticky = localStorage.getItem("headerSticky");
    if (savedSticky !== null) {
      setIsHeaderSticky(savedSticky === "true");
    }
  }, [setIsHeaderSticky]);

  useEffect(() => {
    localStorage.setItem("headerSticky", String(isHeaderSticky));
  }, [isHeaderSticky]);

  const currentPath = location.pathname;
  const pageTitle = breadcrumbMap[currentPath] || "Tổng quan";
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
        "w-full bg-white shadow-sm rounded-3xl transition-all duration-300 ease-in-out",
        isHeaderSticky && "fixed left-0 right-0 z-50",
        "flex-shrink-0" // Đảm bảo header không bị co lại
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
            <AlignJustify className="h-6 w-6 text-gray-600" />
          </Button>
          <div className="flex flex-col min-w-0">
            <div className="text-sm text-gray-500 truncate">{breadcrumb}</div>
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
          <NavLink to="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 flex-shrink-0"
              aria-label="Quay lại trang web"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden md:inline text-sm">Quay lại</span>
            </Button>
          </NavLink>

          <Input
            type="search"
            placeholder="Tìm kiếm..."
            className="min-w-0 w-32 sm:w-40 md:w-48 lg:w-64 max-w-64 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-gray-400 focus:ring-gray-400"
          />

          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 flex-shrink-0"
          >
            <User className="h-5 w-5" />
            <span className="hidden md:inline text-sm">Đăng nhập</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-100 flex-shrink-0"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:bg-gray-100 flex-shrink-0"
                aria-label="Cài đặt"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                "w-64 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out",
                "absolute right-0 mt-2 min-w-[16rem] max-w-none", // bỏ giới hạn max-w cũ
                "animate-in fade-in-0 zoom-in-95 duration-200"
              )}
            >

              <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Cài đặt
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

              <DropdownMenuItem
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-150"
                asChild
              >
                <div>
                  <Label htmlFor="sticky-header" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Giữ header cố định
                  </Label>
                  <Switch
                    id="sticky-header"
                    checked={isHeaderSticky}
                    onCheckedChange={(checked) => setIsHeaderSticky(Boolean(checked))}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </DropdownMenuItem>

              {/* <DropdownMenuItem
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-150"
                onClick={toggleTheme}
              >
                <div className="flex items-center gap-2">
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  {theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
                </div>
              </DropdownMenuItem> */}

              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-150"
                asChild
              >
                <NavLink to="/profile">
                  <UserCircle className="h-4 w-4" />
                  Hồ sơ
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md cursor-pointer transition-colors duration-150"
                onClick={() => console.log("Logout clicked")} // Replace with actual logout logic
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;