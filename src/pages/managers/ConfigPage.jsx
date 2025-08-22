import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, PanelTop, PanelBottom, Home, Info } from "lucide-react";

function ConfigPage() {
    const location = useLocation();

    const activeClass =
        "bg-blue-400 text-gray-100 admin-dark:bg-gray-700 admin-dark:text-white";
    const normalClass =
        "border-gray-400 admin-dark:bg-gray-900 admin-dark:border-gray-700 border-2 hover:bg-gray-200 text-gray-700 flex items-center gap-2 p-2 rounded-md text-sm font-medium admin-dark:hover:bg-gray-700 admin-dark:text-gray-300";

    const menus = [
        { to: "overview", icon: BarChart3, label: "Tổng quan" },       // biểu đồ tổng quan
        { to: "header", icon: PanelTop, label: "Đầu trang" },    // header
        { to: "footer", icon: PanelBottom, label: "Cuối trang" },// footer
        { to: "home", icon: Home, label: "Trang chủ" },                // home page
        { to: "about", icon: Info, label: "Trang giới thiệu" },        // thông tin
    ];

    const getClassName = (isActive, to) => {
        // trường hợp đặc biệt: khi ở /marketing thì "overview" vẫn active
        const isOverviewActive =
            location.pathname === "/marketing" && to === "overview";
        return `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${isActive || isOverviewActive ? activeClass : normalClass
            }`;
    };

    return (
        <div className="container mx-auto">
            <div className="mb-6">
                <nav className="grid grid-cols-5 gap-2">
                    {menus.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to} className={({ isActive }) => getClassName(isActive, to)}>
                            <Icon className="h-4 w-4" />
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