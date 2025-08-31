import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { HiX } from "react-icons/hi";
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from "framer-motion";


const baseUrl = import.meta.env.VITE_MAIN_BE_URL || "http://localhost:3000";

function Header({ scrolled, setActiveScoll_open_HeaderSideBar, isDarkHeader }) {
  const { t } = useLanguage();
  const location = useLocation();

  const [isHoverServices, setIsHoverServices] = useState(false);
  const [isHoverDesignWeb, setIsHoverDesignWeb] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    setActiveScoll_open_HeaderSideBar(next);
  };

  return (
    <>
      <div className={`${location.pathname === "/"
        ? (scrolled
          ? "xs:h-20 md:h-20 2xl:h-20 3xl:h-20 bg-gray-900  transition-all duration-200"
          : "xs:h-20 md:h-30 2xl:h-30 3xl:h-30  transition-all duration-200")
        : "h-20 bg-gray-800  transition-all duration-200"
        } w-full  flex justify-between items-center xs:px-3 sm:px-3 md:px-10 lg:px-20 fixed top-0 left-0 z-40`}>
        {/* Logo Section */}
        <Link to={'/'} className='flex items-center justify-center xs:h-10 2xl:h-20 px-3 py-2 overflow-hidden rounded-2xl w-fit'>
          <img src="/logoModi.png" className='xs:h-8 2xl:h-8 3xl:h-12 w-fit' alt='logo' />
        </Link>

        {/* Desktop Navigation - Hidden on mobile and tablet */}
        <nav className='items-center justify-center xs:hidden text-lg font-bold md:flex md:gap-6 lg:gap-8 xl:gap-10'>
          <Link
            to={'/'}
            className={`flex text-lg justify-center items-center ${location.pathname === '/' ? 'text-green-400' : 'text-white'}`}
          >
            {t("header.home.title")}
          </Link>

          <Link
            to={'/about'}
            className={`text-lg flex justify-center items-center ${location.pathname === '/about' ? 'text-green-400' : 'text-white'}`}
          >
            {t("header.about.title")}
          </Link>

          {/* Design Web Dropdown */}
          <div
            onMouseEnter={() => setIsHoverDesignWeb(true)}
            onMouseLeave={() => setIsHoverDesignWeb(false)}
            className="relative h-full flex items-center"
          >
            <Link
              to="/Products"
              className={`flex justify-center items-center text-lg h-full ${location.pathname.startsWith('/Products') ? 'text-green-400' : 'text-white'}`}
            >
              {t("header.designweb.title")}
              <IoMdArrowDropdown className={`ml-1 ${isHoverDesignWeb ? 'rotate-180' : ''}`} />
            </Link>

            {isHoverDesignWeb && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 min-w-max pt-2">
                <ModalDesignWeb />
              </div>
            )}
          </div>

          <div
            onMouseEnter={() => setIsHoverServices(true)}
            onMouseLeave={() => setIsHoverServices(false)}
            className="relative h-full flex items-center"
          >
            <Link
              to="/services"
              className={`flex justify-center items-center text-lg h-full ${location.pathname === '/services' ? 'text-green-400' : 'text-white'}`}
            >
              {t("header.services.title")}
              <IoMdArrowDropdown className={`ml-1 ${isHoverServices ? 'rotate-180' : ''}`} />
            </Link>

            {isHoverServices && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 min-w-max pt-2">
                <ModalServices />
              </div>
            )}
          </div>

          <Link
            to={'/marketing'}
            className={`flex justify-center items-center text-lg ${location.pathname === '/marketing' ? 'text-green-400' : 'text-white'}`}
          >
            {t("header.marketing.title")}
          </Link>

          <Link
            to="/news"
            className={`flex justify-center items-center text-lg h-full ${location.pathname === '/news' ? 'text-green-400' : 'text-white'}`}
          >
            {t("header.news.title")}
          </Link>

          <Link
            to={'/contact'}
            className={`flex justify-center items-center text-lg ${location.pathname === '/contact' ? 'text-green-400' : 'text-white'}`}
          >
            {t("header.contact.title")}
          </Link>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle - Hidden on small screens */}
          <div className='hidden md:flex'>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button - Show on mobile and tablet */}
          <button
            type="button"
            onClick={toggleSidebar}
            className='flex md:hidden transition-all duration-200 p-1 text-white justify-center items-center border-2 border-gray-500 rounded-lg gap-2 hover:bg-[#bf263d] hover:border-[#bf263d] cursor-pointer'
          >
            <TiThMenu className="text-base" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        onClick={toggleSidebar}
        className={`
          fixed top-0 left-0 w-full h-full z-30 md:hidden
          transition-opacity duration-300 ease-in-out
          ${isSidebarOpen ? 'opacity-100 pointer-events-auto bg-gray-900/80' : 'opacity-0 pointer-events-none'}
        `}
      />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  );
}

function ModalServices() {
  const { t } = useLanguage();
  const services = [
    {
      title: t("header.services.listServices.0"),
      slug: "online-kickstart",
      subItems: [
        { title: "Tư Vấn Cơ Bản", slug: "advise" },
        { title: "Thiết Kế Gói Dịch Vụ", slug: "design-service-package" },
        { title: "Hỗ Trợ Triển Khai", slug: "support-implementation" },
      ],
    },
    { title: t("header.services.listServices.1"), slug: "one-me" },
    {
      title: t("header.services.listServices.2"),
      slug: "brand-building",
      subItems: [
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
      subItems: [
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
    {
      title: t("header.services.listServices.11"), link: "/services",
      subItems: [
        { title: "Xây Dựng Thương Hiệu Cá Nhân", slug: "personal-brand" },
        { title: "Chiến Lược Thương Hiệu", slug: "brand-strategy" },
        { title: "Thiết Kế Nhận Diện", slug: "identity-design" },
      ],
    },
    { title: t("header.services.listServices.12"), link: "/services" },
    { title: t("header.services.listServices.13"), link: "/services" },
  ];

  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const getColumnsData = () => {
    const itemsPerColumn = Math.ceil(services.length / 3);
    return [
      services.slice(0, itemsPerColumn),
      services.slice(itemsPerColumn, itemsPerColumn * 2),
      services.slice(itemsPerColumn * 2),
    ];
  };

  const columns = getColumnsData();

  const handleMouseEnterItem = (originalIndex, columnIndex) => {
    setHoveredItem(originalIndex);
    setHoveredColumn(columnIndex);
  };

  const handleMouseLeaveContainer = () => {
    setHoveredItem(null);
    setHoveredColumn(null);
  };

  const getSubMenuPosition = (columnIndex) => {
    switch (columnIndex) {
      case 0:
        return {
          left: 'calc(33.333% + 12px)',
          transform: 'translateX(0)',
        };
      case 1:
        return {
          left: 'calc(66.666% + 24px)',
          transform: 'translateX(0)',
        };
      case 2:
        return {
          right: 'calc(33.333% + 12px)',
          transform: 'translateX(0)',
        };
      default:
        return {
          left: 'calc(33.333% + 12px)',
          transform: 'translateX(0)',
        };
    }
  };

  return (
    <div
      className="w-fit animate-in slide-in-from-top-2 duration-200 relative"
      onMouseLeave={handleMouseLeaveContainer}
    >
      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl p-4 relative">
        <div className="grid grid-cols-3 gap-4 lg:gap-6 min-w-[700px] lg:min-w-[900px] xl:min-w-[900px] relative">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-1">
              {column.map((service, index) => {
                const originalIndex = colIndex * Math.ceil(services.length / 3) + index;
                const isActive = hoveredItem === originalIndex;

                return (
                  <div
                    key={originalIndex}
                    className={`
                      group cursor-pointer transition-all duration-300 ease-in-out transform
                      px-3 py-2 rounded-lg border-l-4 relative
                      ${isActive && service.subItems
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white translate-x-1 z-20'
                        : 'bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 border-transparent hover:border-emerald-400 text-gray-700 dark:text-gray-200 hover:text-white hover:translate-x-1'
                      }
                    `}
                    onMouseEnter={() => handleMouseEnterItem(originalIndex, colIndex)}
                  >
                    <div
                      className={`
                        absolute inset-0 rounded-lg transition-opacity duration-300
                        ${isActive && service.subItems
                          ? 'bg-gradient-to-r from-transparent to-emerald-200 dark:to-emerald-800/30 opacity-100'
                          : 'bg-gradient-to-r from-transparent to-emerald-100 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100'
                        }
                      `}
                    ></div>

                    <div className="flex items-center justify-between relative z-10">
                      <Link
                        to={service.slug ? `/services/${service.slug}` : service.link}
                        className={`
                          flex-1 text-xs lg:text-sm transition-all duration-300
                          ${isActive && service.subItems ? 'font-bold' : 'font-medium group-hover:font-semibold'}
                        `}
                      >
                        {service.title}
                      </Link>
                      {service.subItems && (
                        <IoMdArrowDropdown
                          className={`
                            ml-2 text-xs transition-transform duration-300
                            ${isActive ? 'rotate-90' : 'group-hover:rotate-90'}
                          `}
                        />
                      )}
                    </div>

                    {/* Invisible bridge for smooth hover transition - chỉ cho cột giữa */}
                    {service.subItems && colIndex === 1 && isActive && (
                      <div
                        className="absolute top-0 -right-4 w-8 h-full z-30 bg-transparent"
                        onMouseEnter={() => setHoveredItem(originalIndex)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {hoveredItem !== null && services[hoveredItem]?.subItems && hoveredColumn !== null && (
          <div
            className="absolute top-4 z-70 min-w-[250px] lg:min-w-[280px] animate-in slide-in-from-top-2 duration-200"
            style={getSubMenuPosition(hoveredColumn)}
            onMouseEnter={() => setHoveredItem(hoveredItem)}
            onMouseLeave={() => {
              // Delay để tránh flicker khi di chuyển chuột
              setTimeout(() => {
                setHoveredItem(null);
                setHoveredColumn(null);
              }, 50);
            }}
          >
            {/* Bridge element để kết nối với menu cha - chỉ cho cột giữa */}
            {hoveredColumn === 1 && (
              <div
                className="absolute -left-4 top-0 w-4 h-full bg-transparent z-10"
                onMouseEnter={() => setHoveredItem(hoveredItem)}
              />
            )}

            {/* Menu cấp 3 với bo góc */}
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden">
              <ul className="list-none py-3">
                {services[hoveredItem].subItems.map((sub, subIndex) => (
                  <li
                    key={subIndex}
                    className={`
                      px-4 py-3 text-gray-700 dark:text-gray-200 
                      hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white 
                      transition-all duration-300 cursor-pointer
                      ${subIndex === 0 ? 'rounded-t-xl' : ''}
                      ${subIndex === services[hoveredItem].subItems.length - 1 ? 'rounded-b-xl' : ''}
                      mx-2 mb-1 last:mb-0 rounded-lg
                    `}
                  >
                    <Link
                      to={`/services/${services[hoveredItem].slug}/${sub.slug}`}
                      className="text-xs lg:text-sm font-medium hover:font-semibold transition-all duration-300 whitespace-nowrap flex items-center"
                    >
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"></span>
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalDesignWeb() {
  const { t } = useLanguage();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [categories, setCategories] = useState([]); // State cho danh mục động

  // Gọi API để lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/web-samples`);
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
          slug: category // Lấy thẳng category làm slug (sẽ encode sau)
        })));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnterItem = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeaveContainer = () => {
    setHoveredItem(null);
  };

  return (
    <div
      className="w-fit animate-in slide-in-from-top-2 duration-200 relative"
      onMouseLeave={handleMouseLeaveContainer}
    >
      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl p-4 relative">
        <div className="min-w-[300px] lg:min-w-[400px] xl:min-w-[200px] relative">
          <div className="space-y-1">
            {categories.map((item, index) => {
              const isActive = hoveredItem === index;

              return (
                <div
                  key={index}
                  className={`
                    group cursor-pointer transition-all duration-300 ease-in-out transform
                    px-3 py-2 rounded-lg border-l-4 relative
                    ${isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white translate-x-1 z-20'
                      : 'bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 border-transparent hover:border-emerald-400 text-gray-700 dark:text-gray-200 hover:text-white hover:translate-x-1'
                    }
                  `}
                  onMouseEnter={() => handleMouseEnterItem(index)}
                >
                  <div
                    className={`
                      absolute inset-0 rounded-lg transition-opacity duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-transparent to-emerald-200 dark:to-emerald-800/30 opacity-100'
                        : 'bg-gradient-to-r from-transparent to-emerald-100 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100'
                      }
                    `}
                  ></div>

                  <div className="flex items-center justify-between relative z-10">
                    <Link
                      to={`/Products?category=${encodeURIComponent(item.title)}`} // Encode trực tiếp category
                      className={`
                        flex-1 text-xs lg:text-sm transition-all duration-300
                        ${isActive ? 'font-bold' : 'font-medium group-hover:font-semibold'}
                      `}
                    >
                      {item.title}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]); // State cho danh mục động trong Sidebar

  // Gọi API để lấy danh mục cho Sidebar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/web-samples`);
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
    { id: 8, name: t("header.recruitment.title"), link: '/careers' },
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
                src="/logoModi.png"
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

export default Header;