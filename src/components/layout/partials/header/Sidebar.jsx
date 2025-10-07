import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiX } from "react-icons/hi";
import ThemeToggle from "../ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

const categoriesList = [
  { key: "E-commerce", name: "Thương Mại Điện Tử" },
  { key: "Portfolio", name: "Danh Mục Cá Nhân" },
  { key: "Business", name: "Kinh Doanh/Doanh Nghiệp" },
  { key: "Blog", name: "Blog/Tin Tức" },
  { key: "Landing Page", name: "Trang Đích (Landing Page)" },
  { key: "Corporate", name: "Công Ty/Tập Đoàn" },
  { key: "Creative", name: "Sáng Tạo/Nghệ Thuật" },
];

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { t } = useLanguage();
  const [logoUrl, setLogoUrl] = useState("/logoModi.png");
  const [services, setServices] = useState([]);

  const [categories, setCategories] = useState([]); // State cho danh mục động

  // Gọi API để lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/web-samples`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        try {
          const parsedData = (result.data || []).map((item) => ({
            ...item,
            tags:
              typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags,
            tech:
              typeof item.tech === "string" ? JSON.parse(item.tech) : item.tech,
            top_features:
              typeof item.top_features === "string"
                ? JSON.parse(item.top_features)
                : item.top_features,
            export_state: item.export_state ? 1 : 0,
          }));

          const activeData = parsedData.filter(
            (item) => item.export_state === 1
          );
          const uniqueCategories = [
            ...new Set(activeData.map((s) => s.category)),
          ]; // Không thêm "Tất cả"

          // Định nghĩa item bạn muốn thêm vào đầu
          const allCategoryItem = {
            title: "Tất cả website", // Hoặc bất kỳ tiêu đề nào bạn muốn
            slug: "all", // Hoặc một slug đặc biệt, ví dụ: "all"
          };

          // Tạo mảng categories đã xử lý
          const processedCategories = uniqueCategories.map((category) => {
            // Tối ưu hóa việc tìm titleCategory (nên dùng find() thay vì filter())
            const foundCategory = categoriesList.find(
              (u) => u.key === category
            );

            // Lấy tên, nếu không tìm thấy thì để trống hoặc "Không tên"
            const titleCategory = foundCategory ? foundCategory.name : "";

            return {
              title: titleCategory,
              slug: category,
            };
          });

          // Gộp: Đặt item mới ở đầu, sau đó trải mảng processedCategories
          const finalCategories = [
            allCategoryItem, // Item mới ở đầu
            ...processedCategories, // Các item cũ theo sau
          ];

          setCategories(finalCategories);
        } catch (e) {
          console.log("header fetchCategories:", e);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchLogo = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/section-items/type/logo?slug=header`
      );
      if (!res.ok) throw new Error("Không thể tải logo");
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        setLogoUrl(
          item.image_url ? `${API_BASE_URL}${item.image_url}` : "/logoModi.png"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllData = async () => {
    try {
      // 1) fetch danh mục cha
      const res = await fetch(`${API_BASE_URL}/api/sections?slug=header`);
      if (!res.ok) throw new Error("Không thể tải danh mục cha");
      const sectionsRes = await res.json();

      // sectionsRes có thể là { success, data: [...] } hoặc trả trực tiếp mảng tùy backend
      const sectionsArray = Array.isArray(sectionsRes)
        ? sectionsRes
        : Array.isArray(sectionsRes.data)
        ? sectionsRes.data
        : [];

      // lọc và chuẩn hóa danh sách cha
      const merged = sectionsArray
        .filter((section) => section.type !== "logo")
        .map((section) => ({
          slug: section.type,
          title: section.title?.vi || section.title?.en || "No Title",
        }));

      const moreMerged = [
        {
          slug: "services",
          title: "Tất cả dịch vụ",
        },
        ...merged,
      ];
      setServices(moreMerged);
    } catch (err) {
      console.error("Lỗi loadAllData:", err);
    }
  };

  useEffect(() => {
    fetchLogo();
    loadAllData();
  }, []);

  const MenuHeader = [
    { id: 1, name: t("header.home.title"), link: "/" },
    { id: 2, name: t("header.about.title"), link: "/about" },
    {
      id: 3,
      name: t("header.designweb.title"),
      link: "/Products",
      subItems: categories, // Sử dụng danh mục động
    },
    { id: 4, name: t("header.marketing.title"), link: "/marketing" },
    {
      id: 5,
      name: t("header.services.title"),
      link: "/services",
      subItems: services,
    },
    { id: 6, name: t("header.news.title"), link: "/news" },
    { id: 7, name: t("header.contact.title"), link: "/contact" },
  ];

  const [openItems, setOpenItems] = useState({});
  const [openSubItems, setOpenSubItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSubItem = (parentId, subIndex) => {
    setOpenSubItems((prev) => ({
      ...prev,
      [`${parentId}-${subIndex}`]: !prev[`${parentId}-${subIndex}`],
    }));
  };

  return (
    <div className="xl:hidden">
      <aside
        className={`
      fixed top-0 left-0 z-50 w-72 sm:w-80 h-screen p-0
      bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-700
      transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="shrink-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 w-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center">
                <img
                  src={`${logoUrl}`}
                  className="h-6 sm:h-8 w-fit"
                  alt="logo"
                />
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                type="button"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg p-2 transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <HiX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Menu (scrollable) */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-5">
            <ul className="space-y-1 sm:space-y-2 font-medium w-full">
              {MenuHeader.map((item) => (
                <li key={item.id}>
                  <div
                    className="flex items-center p-2 sm:p-3 text-gray-900 dark:text-white rounded-lg hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white transition-all duration-300 cursor-pointer group"
                    onClick={() => {
                      if (item.subItems) {
                        toggleItem(item.id);
                      } else {
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    <Link
                      to={item.link}
                      onClick={(e) => {
                        if (item.subItems) e.preventDefault();
                      }}
                      className="flex-1 text-sm sm:text-base font-medium group-hover:font-semibold transition-all duration-300"
                    >
                      {item.name}
                    </Link>
                    {item.subItems && (
                      <IoMdArrowDropdown
                        className={`ml-auto transition-transform duration-300 ${
                          openItems[item.id] ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>

                  {/* Sub Items */}
                  {item.subItems && openItems[item.id] && (
                    <ul className="ml-3 sm:ml-4 space-y-1 mt-2 animate-in slide-in-from-top-2 duration-200">
                      {item.subItems.map((sub, subIndex) => (
                        <li key={subIndex}>
                          <div
                            className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 cursor-pointer group"
                            onClick={() => {
                              if (sub.subSubItems) {
                                toggleSubItem(item.id, subIndex);
                              } else {
                                setIsSidebarOpen(false);
                              }
                            }}
                          >
                            <Link
                              to={
                                sub.slug
                                  ? `${item.link}?category=${encodeURIComponent(
                                      sub.title
                                    )}`
                                  : sub.link
                              } // Encode cho design web
                              onClick={(e) => {
                                if (sub.subSubItems) e.preventDefault();
                              }}
                              className="flex-1 text-xs sm:text-sm group-hover:font-medium transition-all duration-300"
                            >
                              {sub.title}
                            </Link>
                            {sub.subSubItems && (
                              <IoMdArrowDropdown
                                className={`ml-auto transition-transform duration-300 ${
                                  openSubItems[`${item.id}-${subIndex}`]
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            )}
                          </div>

                          {/* Sub Sub Items */}
                          {sub.subSubItems &&
                            openSubItems[`${item.id}-${subIndex}`] && (
                              <ul className="ml-4 sm:ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                {sub.subSubItems.map((subSub, subSubIndex) => (
                                  <li
                                    key={subSubIndex}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300 rounded-lg transition-all duration-300 cursor-pointer"
                                  >
                                    <Link
                                      to={`${item.link}/${sub.slug}/${subSub.slug}`}
                                      onClick={() => setIsSidebarOpen(false)}
                                      className="text-xs hover:font-medium transition-all duration-300"
                                    >
                                      {subSub.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
