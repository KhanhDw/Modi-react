import React, { useState } from "react";
import {
    FiGrid,
    FiTool,
    FiMonitor,
    FiFilm,
    FiFileText,
    FiMail,
    FiUsers,
    FiSettings,
    FiBookOpen,
    FiMenu,
    FiSearch,
    FiBell,
} from "react-icons/fi";

const sidebarMenu = [
    { label: "Dashboard", icon: FiGrid },
    { label: "Dịch vụ", icon: FiTool },
    { label: "Mẫu website", icon: FiMonitor },
    { label: "Truyền thông", icon: FiFilm },
    { label: "Tin tức", icon: FiFileText },
    { label: "Liên hệ", icon: FiMail },
    { label: "Người dùng", icon: FiUsers },
    { label: "Cài đặt", icon: FiSettings },
    { label: "Quản trị", icon: FiBookOpen },
    { label: "Quản trị", icon: FiBookOpen },
    { label: "Quản trị", icon: FiBookOpen },
    { label: "Quản trị", icon: FiBookOpen },
    { label: "Quản trị", icon: FiBookOpen },
    { label: "Quản trị", icon: FiBookOpen },
    { label: "Quản trị", icon: FiBookOpen },
];

export default function BerryDashboard() {
    const [showProfile, setShowProfile] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const sidebarWidth = collapsed ? 60 : 210;
    const headerHeight = 64;

    return (
        <div className="font-san px-6 h-screen">

            {/* Header */}
            <header
                className="fixed top-0 left-0 w-full z-40 bg-white py-4 px-6 flex items-center justify-between"
                style={{ height: headerHeight }}
            >
                {/* Left: Logo + toggle + search */}
                <div className="flex items-center">
                    <div className="flex items-center justify-between w-[200px]">
                        <div className="flex items-center gap-4">
                            <img
                                src="https://img.icons8.com/ios-filled/30/4a90e2/berry.png"
                                alt="logo"
                                className="w-7 h-7"
                            />
                            <h1 className="text-purple-700 font-extrabold text-xl select-none">
                                BERRY
                            </h1>
                        </div>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 rounded-lg bg-purple-100 hover:bg-purple-300 transition"
                            aria-label="Toggle sidebar"
                        >
                            <FiMenu className="w-6 h-6 text-purple-700" />
                        </button>
                    </div>

                    <div className="flex items-start max-w-md bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden mx-4">
                        <input
                            type="search"
                            placeholder="Search"
                            className="flex-grow px-4 py-2 outline-none text-gray-500 placeholder-gray-400"
                        />
                        <button className="p-2 bg-purple-100 hover:bg-purple-200 rounded-r-xl transition">
                            <FiSearch className="w-6 h-6 text-purple-700" />
                        </button>
                    </div>
                </div>

                {/* Right: Notif, Avatar */}
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition relative">
                        <FiBell className="w-6 h-6 text-gray-600" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                    </button>

                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-300 transition"
                    >
                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className="fixed bg-white pr-2 flex flex-col transition-width duration-300 ease-in-out"
                style={{
                    left: collapsed ? 0 : 10,
                    top: headerHeight,
                    width: sidebarWidth,
                    height: `calc(100vh - ${headerHeight}px)`,
                    boxSizing: "border-box",
                    marginLeft: 10,
                    marginRight: 10,
                    overflowY: "auto",
                }}
            >
                <nav className="flex flex-col h-full space-y-2">
                    {sidebarMenu.map(({ label, icon: Icon }) => (
                        <button
                            key={label}
                            className="flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-purple-100 focus:bg-purple-200 text-purple-700"
                            style={{
                                justifyContent: collapsed ? "center" : "flex-start",
                                gap: collapsed ? 0 : 12,
                            }}
                            aria-label={label}
                            title={collapsed ? label : ""}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span
                                className="truncate"
                                style={{
                                    opacity: collapsed ? 0 : 1,
                                    width: collapsed ? 0 : "auto",
                                    marginLeft: collapsed ? 0 : 12,
                                    transition:
                                        "opacity 0.3s ease, width 0.3s ease, margin-left 0.3s ease",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {label}
                            </span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content */}
            <main
                className="p-5 bg-[#eef2f6]"
                style={{
                    marginLeft: collapsed ? 50 : sidebarWidth,
                    marginTop: headerHeight,
                    height: `calc(100vh - ${headerHeight}px)`,
                    overflowY: "auto",
                    borderTopRightRadius: 12,
                    borderTopLeftRadius: 12,
                }}
            >
                <div className="w-full h-auto">
                    {Array(30)
                        .fill(0)
                        .map((_, i) => (
                            <p key={i} className="text-gray-700">
                                Đây là dòng nội dung thứ {i + 1} trong phần nội dung chính.
                            </p>
                        ))}
                </div>
            </main>
        </div>
    );
}
