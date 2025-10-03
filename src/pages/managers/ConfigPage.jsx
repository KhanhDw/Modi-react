import { Contact, Home, Info, PanelBottom, PanelTop } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
function ConfigPage() {
    const location = useLocation();

    const activeClass =
        "bg-blue-400 text-gray-100 admin-dark:bg-gray-700 admin-dark:text-white";
    const normalClass =
        "border-gray-400 admin-dark:bg-gray-900 admin-dark:border-gray-700 border-2 hover:bg-gray-200 text-gray-700 flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-md text-xs sm:text-sm font-medium admin-dark:hover:bg-gray-700 admin-dark:text-gray-300";

    const menus = [
        // { to: "overview", icon: BarChart3, label: "Tổng quan" },       // biểu đồ tổng quan
        { to: "header", icon: PanelTop, label: "Đầu trang" },    // header
        { to: "footer", icon: PanelBottom, label: "Cuối trang" },// footer
        { to: "home", icon: Home, label: "Trang chủ" },                // home page
        { to: "about", icon: Info, label: "Trang giới thiệu" },        // thông tin
        { to: "contact", icon: Contact, label: "Liên hệ" },        // thông tin
    ];

    const getClassName = (isActive, to) => {
        // trường hợp đặc biệt: khi ở /marketing thì "overview" vẫn active
        const isOverviewActive =
            location.pathname === "/marketing" && to === "overview";
        return `flex justify-center items-center gap-1 sm:gap-2 p-2 rounded-md text-xs sm:text-sm font-medium ${isActive || isOverviewActive ? activeClass : normalClass}`;
    };

    return (
        <div className="container mx-auto">
            <div className="mb-3 flex items-center justify-center">
                <nav className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-5">
                    {menus.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => getClassName(isActive, to)}
                        >
                            <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <Outlet />
        </div>
    );
}

export default ConfigPage;
export { ConfigPage };
