import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { CgWebsite } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlignJustify } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminSettingsDropdown from "@/components/layout/AdminLayout/partials/header/AdminSettingsDropdown";
import { NotificationBell } from "@/components/layout/AdminLayout/partials/header/NotificationBell";
import AdminSearch from "@/components/layout/AdminLayout/partials/header/AdminSearch";
import axios from "axios";

const breadcrumbMap = {
  "/managers/dashboard": "Tổng quan",
  "/managers/page-config": "Cấu hình thông tin website",
  "/managers/marketing": "Truyền thông",
  "/managers/website-templates": "Thiết kế Website",
  "/managers/news": "Tin tức",
  "/managers/contact": "Liên hệ",
  "/managers/services": "Dịch vụ",
  "/managers/about-config": "Giới thiệu",
  "/managers/admin-zone": "Khu vực quản trị",
  "/managers/components": "Component",
  "/managers/profile": "Hồ sơ người dùng",
};

const AdminHeader = ({
  isSidebarOpen,
  setSidebarOpen,
  isHeaderSticky,
  setIsHeaderSticky,
  sidebarCollapsed,
}) => {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");

  // Gọi API lấy dữ liệu user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Chưa có token, cần login trước");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = res.data.user;
        setUsername(user.full_name || "");
        // Sử dụng đường dẫn đầy đủ từ server
        const avatarUrl = user.avatar_url
          ? `${import.meta.env.VITE_MAIN_BE_URL}${user.avatar_url}`
          : "";
        setAvatarUrl(avatarUrl);

        // Lưu vào localStorage để sử dụng lại (tùy chọn)
        localStorage.setItem("fullName", user.full_name || "");
        localStorage.setItem("avatar_url", user.avatar_url || "");
      } catch (err) {
        console.error("Lỗi lấy dữ liệu user:", err);
        // Fallback nếu API lỗi, thử lấy từ localStorage
        const storedUsername = localStorage.getItem("fullName");
        const storedAvatar_url = localStorage.getItem("avatar_url");
        if (storedUsername) setUsername(storedUsername);
        if (storedAvatar_url) setAvatarUrl(`${import.meta.env.VITE_MAIN_BE_URL}${storedAvatar_url}`);
      }
    };

    fetchUser();
  }, []);

  // Lưu trạng thái sticky header
  useEffect(() => {
    localStorage.setItem("headerSticky", String(isHeaderSticky));
  }, [isHeaderSticky]);

  const pathnames = location.pathname.split("/").filter(Boolean);
  const firstLevel = `/${pathnames.slice(0, 2).join("/")}`;
  const pageTitle = breadcrumbMap[firstLevel] || "Null";

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
            <div className="flex text-sm text-gray-500 admin-dark:text-gray-400 truncate">
              <span>Admin</span>
              {pathnames[1] && (
                <>
                  <span className="mx-1">/</span>
                  <span className="font-semibold capitalize">{pathnames[1]}</span>
                </>
              )}
            </div>
            <h1 className="text-xl flex items-center font-bold text-gray-800 admin-dark:text-gray-100 md:text-2xl truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
          <AdminSearch />
          {/* Website link */}
          <NavLink to={`${import.meta.env.VITE_MAIN_FE_URL}`} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              className="group flex items-center gap-2 text-black admin-dark:text-gray-100 admin-dark:bg-gray-400/10 hover:bg-gray-900 bg-slate-100 admin-dark:hover:bg-gray-700 flex-shrink-0 cursor-pointer"
              aria-label="Quay lại trang web"
            >
              <CgWebsite className="h-5 w-5" />
              <span className="hidden md:inline text-sm text-black group-hover:text-white admin-dark:text-gray-100">
                Xem Website
              </span>
            </Button>
          </NavLink>

          {/* Notifications */}
          <NotificationBell />

          {/* Avatar */}
          <NavLink to="/managers/profile">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 admin-dark:text-gray-300 hover:bg-gray-600 admin-dark:hover:bg-gray-600 flex-shrink-0 rounded-full cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg"} />
                <AvatarFallback>😢</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-bold">{username || "Khách"}</span>
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