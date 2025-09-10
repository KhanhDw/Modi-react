import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { HiX } from "react-icons/hi";
import ThemeToggle from '../ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]); // State cho danh mục động trong Sidebar

  // Gọi API để lấy danh mục cho Sidebar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/web-samples`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        const parsedData = (result.data || []).map((item) => ({
          ...item,
          tags: typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags,
          tech: typeof item.tech === "string" ? JSON.parse(item.tech) : item.tech,
          top_features: typeof item.top_features === "string" ? JSON.parse(item.top_features) : item.top_features,
          export_state: item.export_state ? 1 : 0,
        }));
        const activeData = parsedData.filter((item) => item.export_state === 1);
        const uniqueCategories = [...new Set(activeData.map((s) => s.category))]; // Không thêm "Tất cả"
        setCategories(uniqueCategories.map(category => ({
          title: category,
          slug: category // Lấy thẳng
        })));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const [logoUrl, setLogoUrl] = useState("/logoModi.png");

  const fetchLogo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/section-items/type/logo?slug=header`);
      if (!res.ok) throw new Error("Không thể tải logo");
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        setLogoUrl(item.image_url ? `${API_BASE_URL}${item.image_url}` : "/logoModi.png");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const MenuHeader = [
    { id: 1, name: t("header.home.title"), link: '/' },
    { id: 2, name: t("header.about.title"), link: '/about' },
    {
      id: 3,
      name: t("header.designweb.title"),
      link: '/Products',
      subItems: categories // Sử dụng danh mục động
    },
    { id: 4, name: t("header.marketing.title"), link: '/marketing' },
    {
      id: 5,
      name: t("header.services.title"),
      link: '/services',
      subItems: [
        // Giữ nguyên subItems tĩnh cho services
        {
          title: t("header.services.listServices.0"),
          slug: "online-kickstart",
          subSubItems: [
            { title: "Tư Vấn Cơ Bản", slug: "advise" },
            { title: "Thiết Kế Gói Dịch Vụ", slug: "design-service-package" },
            { title: "Hỗ Trợ Triển Khai", slug: "support-implementation" },
          ],
        },
        { title: t("header.services.listServices.1"), slug: "one-me" },
        {
          title: t("header.services.listServices.2"),
          slug: "brand-building",
          subSubItems: [
            { title: "Xây Dựng Thương Hiệu Cá Nhân", slug: "personal-brand" },
            { title: "Chiến Lược Thương Hiệu", slug: "brand-strategy" },
            { title: "Thiết Kế Nhận Diện", slug: "identity-design" },
          ],
        },
        { title: t("header.services.listServices.3"), slug: "online-store" },
        { title: t("header.services.listServices.4"), slug: "service-booking" },
        {
          title: t("header.services.listServices.5"),
          slug: "comprehensive-management",
          subSubItems: [
            { title: "Xây Dựng Thương Hiệu Cá Nhân", slug: "personal-brand" },
            { title: "Chiến Lược Thương Hiệu", slug: "brand-strategy" },
            { title: "Thiết Kế Nhận Diện", slug: "identity-design" },
          ],
        },
        { title: t("header.services.listServices.6"), slug: "website-app" },
        { title: t("header.services.listServices.7"), slug: "re-vision" },
        { title: t("header.services.listServices.8"), link: "/services" },
        { title: t("header.services.listServices.9"), link: "/services" },
        { title: t("header.services.listServices.10"), link: "/services" },
        { title: t("header.services.listServices.11"), link: "/services" },
        { title: t("header.services.listServices.12"), link: "/services" },
        { title: t("header.services.listServices.13"), link: "/services" },
      ],
    },
    { id: 6, name: t("header.news.title"), link: '/news' },
    { id: 7, name: t("header.contact.title"), link: '/contact' },
    // { id: 8, name: t("header.recruitment.title"), link: '/careers' },
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
    <aside
      className={`
        fixed top-0 left-0 z-50 w-72 sm:w-80 h-screen p-0 overflow-y-auto 
        bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className='flex items-start justify-between flex-col w-full h-full'>
        {/* Header */}
        <div className='flex items-start justify-start flex-col w-full'>
          <div className='flex items-center justify-between mb-4 sm:mb-6 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 w-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800'>
            <div className='flex items-center justify-start'>
              <img
                src={`${logoUrl}`}
                className='h-6 sm:h-8 w-fit'
                alt='logo'
              />
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              type="button"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg p-2 transition-all duration-300 hover:scale-110"
            >
              <HiX className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="px-3 sm:px-4 overflow-y-auto w-full flex-1">
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
                      onClick={(e) => { if (item.subItems) e.preventDefault(); }}
                      className="flex-1 text-sm sm:text-base font-medium group-hover:font-semibold transition-all duration-300"
                    >
                      {item.name}
                    </Link>
                    {item.subItems && (
                      <IoMdArrowDropdown className={`ml-auto transition-transform duration-300 ${openItems[item.id] ? 'rotate-180' : ''}`} />
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
                              to={sub.slug ? `${item.link}?category=${encodeURIComponent(sub.title)}` : sub.link} // Encode cho design web
                              onClick={(e) => { if (sub.subSubItems) e.preventDefault(); }}
                              className="flex-1 text-xs sm:text-sm group-hover:font-medium transition-all duration-300"
                            >
                              {sub.title}
                            </Link>
                            {sub.subSubItems && (
                              <IoMdArrowDropdown className={`ml-auto transition-transform duration-300 ${openSubItems[`${item.id}-${subIndex}`] ? 'rotate-180' : ''}`} />
                            )}
                          </div>

                          {/* Sub Sub Items */}
                          {sub.subSubItems && openSubItems[`${item.id}-${subIndex}`] && (
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
        </div>

        {/* Theme Toggle Footer */}
        <div className='flex items-center justify-center w-full p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;