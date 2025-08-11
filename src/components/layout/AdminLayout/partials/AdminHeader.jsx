import { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Bell, Settings, AlignJustify, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

  return (
    <header
      className={cn(
        "w-full bg-white shadow-sm rounded-3xl transition-all duration-300 ease-in-out",
        isHeaderSticky && "sticky top-2 z-50",
        "flex-shrink-0" // Đảm bảo header không bị co lại
      )}
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
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                "w-56 p-2", // Giảm chiều rộng để tránh vượt quá header
                "absolute right-0 mt-2" // Đảm bảo dropdown nằm trong giới hạn
              )}
            >
              <DropdownMenuItem className="flex items-center justify-between space-x-2 p-2">
                <Label htmlFor="sticky-header">Giữ header cố định</Label>
                <Switch
                  id="sticky-header"
                  checked={isHeaderSticky}
                  onCheckedChange={(checked) =>
                    setIsHeaderSticky(Boolean(checked))
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 cursor-pointer">
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