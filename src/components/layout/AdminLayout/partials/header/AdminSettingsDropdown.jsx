import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Settings, UserCircle, LogOut, SunMedium, Moon } from "lucide-react";
import { CgWebsite } from "react-icons/cg";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CustomDropdown,
  CustomDropdownItem,
  CustomDropdownSeparator,
  CustomDropdownLabel,
} from "@/components/adminComponent/CustomDropdown";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAdminTheme } from "@/contexts/ThemeLocalContext";

const AdminSettingsDropdown = ({ isHeaderSticky, setIsHeaderSticky, username, avatar_url }) => {
  const { isDark, toggleTheme } = useAdminTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await axios.post(
          `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi đăng xuất");
    }
  };

  return (
    <div className="z-2">
      <CustomDropdown
        className="w-64 md:w-72" // Tăng chiều rộng dropdown trên mobile và desktop
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 cursor-pointer"
            aria-label="Cài đặt"
          >
            <Settings color={isDark ? '#ffffff' : '#000000'} className="h-5 w-5" />
          </Button>
        }
        align="end"
      >
        
        

        {/* Profile Link - chỉ hiển thị trên mobile */}
        <CustomDropdownItem asChild className="md:hidden">
          <NavLink
            to="/managers/profile"
            className="flex items-center font-medium gap-2 hover:underline underline-offset-4 px-4 py-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg"} />
              <AvatarFallback>😢</AvatarFallback>
            </Avatar>
            {username || "Hồ sơ"}
          </NavLink>
        </CustomDropdownItem>

        {/* Website Link - chỉ hiển thị trên mobile */}
        <CustomDropdownItem asChild className="md:hidden">
          <NavLink
            to={`${import.meta.env.VITE_MAIN_FE_URL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center font-medium gap-2 hover:underline underline-offset-4 px-4 py-2"
          >
            <CgWebsite className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Xem Website
          </NavLink>
        </CustomDropdownItem>

        {/* Sticky Header Toggle - ẩn trên mobile */}
        <CustomDropdownItem asChild className="hidden md:flex">
          <div className="flex items-center justify-between w-full px-4 py-2">
            <Label
              htmlFor="sticky-header"
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Giữ header cố định
            </Label>
            <Switch
              id="sticky-header"
              checked={isHeaderSticky}
              onCheckedChange={(checked) => setIsHeaderSticky(Boolean(checked))}
              className="data-[state=checked]:bg-red-600 cursor-pointer"
            />
          </div>
        </CustomDropdownItem>

        {/* Theme Toggle */}
        <CustomDropdownItem asChild>
          <div className="flex items-center justify-between w-full px-4 py-2">
            <Label className="flex items-center gap-2 cursor-pointer text-sm">
              {isDark ? (
                <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <SunMedium className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
              Giao diện {isDark ? "tối" : "sáng"}
            </Label>
            <Switch
              id="change-theme-admin"
              checked={isDark}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-blue-600 cursor-pointer"
            />
          </div>
        </CustomDropdownItem>

        <CustomDropdownSeparator />

        {/* Logout */}
        <CustomDropdownItem
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 active:scale-[0.98] transition-all px-4 py-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </CustomDropdownItem>
      </CustomDropdown>
    </div>
  );
};

export default AdminSettingsDropdown;