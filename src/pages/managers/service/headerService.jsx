import { useState, useEffect } from "react";
import { BarChart3, Target, ShoppingCart, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "service_overview", label: "Tổng quan", icon: BarChart3 },
  { to: "service_list", label: "Danh sách dịch vụ", icon: Target },
  {
    to: "service_booking",
    label: "Danh sách đơn đặt hàng",
    icon: ShoppingCart,
  },
  { to: "service_customer", label: "Danh sách khách hàng", icon: Users },
];

export default function ServiceNav() {
  const location = useLocation();
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    // check initial size
    setIsMd(window.innerWidth < 769); // xs < 640px, md < 768
    const handleResize = () => setIsMd(window.innerWidth < 769);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLabel = (label) => {
    // Nếu không phải xs thì trả nguyên label
    if (!isMd) return label;

    const words = label.split(" ");
    const lastTwoWords = words.slice(-2);

    // Viết hoa chữ cái đầu mỗi từ
    return lastTwoWords
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav className="grid xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-3 items-center justify-center w-full">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 items-center sm:flex-col md:flex-row md:justify-center gap-2 p-2 rounded-md text-sm font-medium ${isActive ||
              (to === "service_overview" &&
                location.pathname === "/managers/services")
              ? "bg-gray-800 admin-dark:bg-gray-700 text-white"
              : "bg-gray-200 admin-dark:bg-gray-800 admin-dark:text-gray-300 hover:bg-gray-700 admin-dark:hover:bg-gray-700 hover:text-white admin-dark:hover:text-white"
            }`
          }
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          {getLabel(label)}
        </NavLink>
      ))}
    </nav>
  );
}
