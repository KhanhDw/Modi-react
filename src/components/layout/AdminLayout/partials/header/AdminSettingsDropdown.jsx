import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import { Settings, UserCircle, LogOut, SunMedium, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CustomDropdown,
  CustomDropdownItem,
  CustomDropdownSeparator,
  CustomDropdownLabel,
} from "@/components/adminComponent/CustomDropdown";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "@/contexts/ThemeLocalContext";

const AdminSettingsDropdown = ({ isHeaderSticky, setIsHeaderSticky }) => {
  const { isDark, toggleTheme } = useAdminTheme();
  const navigate = useNavigate()


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

      // Xóa token localStorage
      localStorage.removeItem("accessToken");

      // Điều hướng về trang login
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi đăng xuất");
    }
  };

  return (
    <div className="z-999">
      <CustomDropdown
        className="z-9"
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className=" text-gray-600 hover:bg-gray-100 admin-dark:text-gray-300 admin-dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 cursor-pointer"
            aria-label="Cài đặt"
          >
            <Settings color={isDark ? '#ffffff' : '#000000'} className="h-5 w-5" />
          </Button>
        }
        align="end"
      >
        <CustomDropdownLabel>Cài đặt</CustomDropdownLabel>
        <CustomDropdownSeparator />

        {/* Sticky Header Toggle */}
        <CustomDropdownItem asChild>
          <div className="flex items-center justify-between w-full">
            <Label
              htmlFor="sticky-header"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Settings className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
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
          <div className="flex items-center justify-between w-full">
            <Label className="flex items-center gap-2 cursor-pointer">
              {isDark ? (
                <Moon className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
              ) : (
                <SunMedium className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
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

        {/* Profile Link */}
        {/* <CustomDropdownItem asChil >
          <NavLink
            onClick={() => navigate("/managers/profile")}
            className="flex items-center font-medium gap-2 hover:underline underline-offset-4"
          >
            <UserCircle className="h-4 w-4 text-gray-500 admin-dark:text-gray-400" />
            Hồ sơ
          </NavLink>
        </CustomDropdownItem> */}

        <CustomDropdownSeparator />

        {/* Logout */}
        <CustomDropdownItem
          className="text-red-600 admin-dark:text-red-400 hover:bg-red-50 admin-dark:hover:bg-red-900/50 active:scale-[0.98] transition-all"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </CustomDropdownItem>
      </CustomDropdown>
    </div>
  );
};

export default AdminSettingsDropdown;
