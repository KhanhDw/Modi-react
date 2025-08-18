import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, Mail, Search, Share2, Target } from "lucide-react";

//------------------------------------------
export default function MarketingPageV1() {
    const location = useLocation();

    // class cho trạng thái active
    const activeClass =
        "bg-blue-400 text-gray-100 admin-dark:bg-gray-700 admin-dark:text-white ";

    // class cho trạng thái normal
    const normalClass =
        "border-gray-400 admin-dark:bg-gray-900 admin-dark:border-gray-700 border-2 hover:bg-gray-200 text-gray-700 flex item-center gap-2 p-2 rounded-md text-sm font-medium" +
        " admin-dark:hover:bg-gray-700 admin-dark:text-gray-300";



    return (
        <div className="">

            {/* hoàn chỉnh và đẩy đủ chức năng */}
            <div className="container mx-auto">
                <div className="mb-6">
                    <nav className="grid grid-cols-5 gap-2">
                        <NavLink
                            to="overview"
                            className={({ isActive }) =>
                                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${isActive ||
                                    (location.pathname === "/marketing" &&
                                        "overview" === "overview")
                                    ? activeClass
                                    : normalClass
                                }`
                            }
                        >
                            <BarChart3 className="h-4 w-4" />
                            Tổng quan
                        </NavLink>

                        <NavLink
                            to="campaigns"
                            className={({ isActive }) =>
                                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${isActive ? activeClass : normalClass
                                }`
                            }
                        >
                            <Target className="h-4 w-4" />
                            Chiến dịch
                        </NavLink>

                        <NavLink
                            to="seo"
                            className={({ isActive }) =>
                                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${isActive ? activeClass : normalClass
                                }`
                            }
                        >
                            <Search className="h-4 w-4" />
                            SEO & Content
                        </NavLink>

                        <NavLink
                            to="social"
                            className={({ isActive }) =>
                                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${isActive ? activeClass : normalClass
                                }`
                            }
                        >
                            <Share2 className="h-4 w-4" />
                            Mạng xã hội
                        </NavLink>

                        <NavLink
                            to="email"
                            className={({ isActive }) =>
                                `flex items-center gap-2 p-2 rounded-md text-sm font-medium ${isActive ? activeClass : normalClass
                                }`
                            }
                        >
                            <Mail className="h-4 w-4" />
                            Email Marketing
                        </NavLink>
                    </nav>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
