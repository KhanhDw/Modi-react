import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { CgWebsite } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlignJustify, Search, X } from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        const avatarUrl = user.avatar_url
          ? `${import.meta.env.VITE_MAIN_BE_URL}${user.avatar_url}`
          : "";
        setAvatarUrl(avatarUrl);

        localStorage.setItem("fullName", user.full_name || "");
        localStorage.setItem("avatar_url", user.avatar_url || "");
      } catch (err) {
        console.error("Lỗi lấy dữ liệu user:", err);
        const storedUsername = localStorage.getItem("fullName");
        const storedAvatar_url = localStorage.getItem("avatar_url");
        if (storedUsername) setUsername(storedUsername);
        if (storedAvatar_url)
          setAvatarUrl(`${import.meta.env.VITE_MAIN_BE_URL}${storedAvatar_url}`);
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
    <>
      {/* Header chính */}
      <header
        className={cn(
          "w-full bg-white admin-dark:bg-slate-900 shadow-sm rounded-3xl transition-shadow duration-300 ease-in-out",
          isHeaderSticky && "fixed left-0 right-0 z-50",
          "flex-shrink-0 ",
          isSearchOpen && "hidden"
        )}
        style={headerStyle}
      >
        <div className="flex items-center justify-between p-4 mx-auto max-w-full">
          {/* Left */}
          <div className="flex items-center xs:gap-0 gap-3 min-w-0">
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
              <div className="flex text-sm text-gray-500 admin-dark:text-gray-400 truncate xs:text-xs md:text-sm">
                <span>Admin</span>
                {pathnames[1] && (
                  <>
                    <span className="mx-1">/</span>
                    <span className="font-semibold capitalize">
                      {pathnames[1]}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-lg xs:text-sm sm:text-lg md:text-xl flex items-center font-bold text-gray-800 admin-dark:text-gray-100 truncate">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center md:space-x-2  flex-shrink-0 ">
            {/* Search Icon cho mobile + tablet */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden "
              onClick={() => setIsSearchOpen(true)}
              aria-label="Mở tìm kiếm"
            >
              <Search className="h-5 w-5 text-gray-600 admin-dark:text-gray-300 " />
            </Button>

            {/* Search Component cho desktop */}
            <div className="hidden md:block ">
              <AdminSearch />
            </div>

            {/* Website link - chỉ hiển thị trên desktop */}
            <NavLink
              to={`${import.meta.env.VITE_MAIN_FE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Button
                variant="ghost"
                className="group flex items-center gap-2 text-black admin-dark:text-gray-100 admin-dark:bg-gray-400/10 hover:bg-gray-900 bg-slate-100 admin-dark:hover:bg-gray-700 flex-shrink-0 cursor-pointer"
                aria-label="Quay lại trang web"
              >
                <CgWebsite className="h-5 w-5" />
                <span className="text-sm text-black group-hover:text-white admin-dark:text-gray-100 md:hidden xl:inline">
                  Xem Website
                </span>
              </Button>
            </NavLink>

            {/* Notifications */}
            <div className="hidden md:block ">
              <NotificationBell />
            </div>

            {/* Avatar - chỉ hiển thị trên desktop */}
            <NavLink to="/managers/profile">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-600 admin-dark:text-gray-300  md:flex 
                        hover:bg-gray-600 admin-dark:hover:bg-gray-600 flex-shrink-0 rounded-full cursor-pointer px-2 py-1"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage
                    src={
                      avatar_url ||
                      "https://randomuser.me/api/portraits/lego/1.jpg"
                    }
                  />
                  <AvatarFallback>😢</AvatarFallback>
                </Avatar>
                {/* Chỉ hiện tên khi từ xl trở lên */}
                <span className="hidden xl:inline text-sm font-bold truncate">
                  {username || "Khách"}
                </span>
              </Button>
            </NavLink>
            {/* Settings */}
            <AdminSettingsDropdown
              isHeaderSticky={isHeaderSticky}
              setIsHeaderSticky={setIsHeaderSticky}
              username={username}
              avatar_url={avatar_url}
            />
          </div>
        </div>
      </header>

      {/* Search Fullscreen cho mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white admin-dark:bg-slate-900 flex flex-col p-4 ">
          <div className="flex h-full flex-col">
            {/* Desktop giữ nguyên thứ tự */}
            <div className="hidden md:flex md:flex-col h-full">
              {/* Thanh nhập tìm kiếm */}
              <div className="flex items-center justify-between mb-4 ">
                <h2 className="text-lg font-bold text-gray-800 admin-dark:text-gray-100">
                  Tìm kiếm
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Đóng tìm kiếm"
                >
                  <X className="h-6 w-6 text-gray-600 admin-dark:text-gray-300" />
                </Button>
              </div>
              {/* Component search */}
              <div className="flex-1 overflow-y-auto">
                <AdminSearch isFullScreen />
              </div>
            </div>

            {/* Mobile: kết quả trên, search bar dính dưới */}
            <div className="flex flex-col h-full md:hidden">
              {/* Kết quả + gợi ý */}
              <div className="flex-1 overflow-y-auto">
                <AdminSearch isFullScreen />
              </div>

              {/* Thanh nhập dính dưới */}
              <div className="border-t pt-3 mt-auto">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 admin-dark:text-gray-100">
                    Tìm kiếm
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                    aria-label="Đóng tìm kiếm"
                  >
                    <X className="h-6 w-6 text-gray-600 admin-dark:text-gray-300" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default AdminHeader;
