import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { HiX } from "react-icons/hi";
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../../../contexts/LanguageContext';

function Header({ scrolled, setActiveScoll_open_HeaderSideBar, isDarkHeader }) {
  const { t } = useLanguage();
  const location = useLocation();

  const [isHoverServices, setIsHoverServices] = useState(false);
  const [isHoverNews, setIsHoverNews] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    setActiveScoll_open_HeaderSideBar(next);
  };

  return (
    <>
      <header className={`
        ${location.pathname === "/"
          ? (scrolled
            ? "h-16 sm:h-20 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-gray-200/20"
            : "h-16 sm:h-20 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-gray-200/20") // Loại bỏ md:h-24 lg:h-28 xl:h-32
          : "h-16 sm:h-20 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-gray-200/20"
        } 
        w-full flex justify-between items-center transition-all duration-300 ease-in-out
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 fixed top-0 left-0 z-40
      `}>
        {/* Logo Section */}
        <Link 
          to={'/'} 
          className='group flex items-center justify-center h-10 sm:h-12 lg:h-16 px-2 sm:px-4 py-2 overflow-hidden rounded-xl w-fit hover:bg-white/10 transition-all duration-300'
        >
          <img 
            src="/logoModi.png" 
            className='h-6 sm:h-8 lg:h-10 xl:h-12 w-fit group-hover:scale-110 transition-transform duration-300' 
            alt='logo' 
          />
        </Link>

        {/* Desktop Navigation - Hidden on mobile and tablet */}
        <nav className='hidden xl:flex items-center justify-center text-base font-semibold gap-6 lg:gap-8 xl:gap-10 2xl:gap-12'>
          <Link 
            to={'/'} 
            className={`
              relative flex justify-center items-center px-3 py-2 rounded-lg text-sm lg:text-base xl:text-lg
              transition-all duration-300 hover:bg-white/10 group
              ${location.pathname === '/' 
                ? 'text-emerald-400 font-bold' 
                : 'text-gray-700 dark:text-white hover:text-emerald-400'
              }
            `}
          >
            {t("header.home.title")}
            {location.pathname === '/' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full"></span>
            )}
          </Link>

          <Link 
            to={'/about'} 
            className={`
              relative flex justify-center items-center px-3 py-2 rounded-lg text-sm lg:text-base xl:text-lg
              transition-all duration-300 hover:bg-white/10 group
              ${location.pathname === '/about' 
                ? 'text-emerald-400 font-bold' 
                : 'text-gray-700 dark:text-white hover:text-emerald-400'
              }
            `}
          >
            {t("header.about.title")}
            {location.pathname === '/about' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full"></span>
            )}
          </Link>

          {/* Services Dropdown */}
          <div
            onMouseEnter={() => setIsHoverServices(true)}
            onMouseLeave={() => setIsHoverServices(false)}
            className="relative h-full flex items-center group"
          >
            <Link
              to="/services"
              className={`
                relative flex justify-center items-center h-full px-3 py-2 rounded-lg text-sm lg:text-base xl:text-lg
                transition-all duration-300 hover:bg-white/10 group-hover:text-emerald-400
                ${location.pathname === '/services' 
                  ? 'text-emerald-400 font-bold' 
                  : 'text-gray-700 dark:text-white'
                }
              `}
            >
              {t("header.services.title")} 
              <IoMdArrowDropdown className={`ml-1 transition-transform duration-300 ${isHoverServices ? 'rotate-180' : ''}`} />
              {location.pathname === '/services' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full"></span>
              )}
            </Link>

            {isHoverServices && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 min-w-max pt-2">
                <ModalServices />
              </div>
            )}
          </div>

          <Link
            to="/news"
            className={`
              relative flex justify-center items-center h-full px-3 py-2 rounded-lg text-sm lg:text-base xl:text-lg
              transition-all duration-300 hover:bg-white/10
              ${location.pathname === '/news' 
                ? 'text-emerald-400 font-bold' 
                : 'text-gray-700 dark:text-white hover:text-emerald-400'
              }
            `}
          >
            {t("header.news.title")}
            {location.pathname === '/news' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full"></span>
            )}
          </Link>

          <Link 
            to={'/contact'} 
            className={`
              relative flex justify-center items-center px-3 py-2 rounded-lg text-sm lg:text-base xl:text-lg
              transition-all duration-300 hover:bg-white/10
              ${location.pathname === '/contact' 
                ? 'text-emerald-400 font-bold' 
                : 'text-gray-700 dark:text-white hover:text-emerald-400'
              }
            `}
          >
            {t("header.contact.title")}
            {location.pathname === '/contact' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full"></span>
            )}
          </Link>

          <Link 
            to={'/careers'} 
            className={`
              relative flex justify-center items-center px-3 lg:px-4 py-2 rounded-full text-sm lg:text-base xl:text-lg
              bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold
              hover:from-emerald-600 hover:to-teal-600 hover:scale-105 hover:shadow-lg
              transition-all duration-300 shadow-md
              ${location.pathname === '/recruitment' ? 'ring-2 ring-emerald-300' : ''}
            `}
          >
            {t("header.recruitment.title")}
          </Link>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle - Hidden on small screens */}
          <div className='hidden lg:flex'>
            <ThemeToggle />
          </div>
          
          {/* Mobile Menu Button - Show on mobile and tablet */}
          <button 
            type="button" 
            onClick={toggleSidebar} 
            className='flex xl:hidden transition-all duration-300 p-2 sm:p-3 text-gray-700 dark:text-white justify-center items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl gap-2 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white hover:scale-105 cursor-pointer shadow-md hover:shadow-lg'
          >
            <TiThMenu className="text-base sm:text-lg" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div>
        <div
          onClick={toggleSidebar}
          className={`
            fixed top-0 left-0 w-full h-full z-40 xl:hidden
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'opacity-100 pointer-events-auto bg-black/50 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}
          `}
        />
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
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
    { title: t("header.services.listServices.5"), slug: "comprehensive-management" },
    { title: t("header.services.listServices.6"), slug: "website-app" },
    { title: t("header.services.listServices.7"), slug: "re-vision" },
    { title: t("header.services.listServices.8"), link: "/services" },
    { title: t("header.services.listServices.9"), link: "/services" },
    { title: t("header.services.listServices.10"), link: "/services" },
    { title: t("header.services.listServices.11"), link: "/services" },
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
        <div className="grid grid-cols-3 gap-4 lg:gap-6 min-w-[700px] lg:min-w-[900px] xl:min-w-[1000px] relative">
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
                      ${
                        isActive && service.subItems
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white translate-x-1 z-20'
                          : 'bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 border-transparent hover:border-emerald-400 text-gray-700 dark:text-gray-200 hover:text-white hover:translate-x-1'
                      }
                    `}
                    onMouseEnter={() => handleMouseEnterItem(originalIndex, colIndex)}
                  >
                    <div
                      className={`
                        absolute inset-0 rounded-lg transition-opacity duration-300
                        ${
                          isActive && service.subItems
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
          >
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden">
              <ul className="list-none py-2">
                {services[hoveredItem].subItems.map((sub, subIndex) => (
                  <li
                    key={subIndex}
                    className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    <Link
                      to={`/services/${services[hoveredItem].slug}/${sub.slug}`}
                      className="text-xs lg:text-sm font-medium hover:font-semibold transition-all duration-300 whitespace-nowrap flex items-center"
                    >
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-60"></span>
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

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { t } = useLanguage();
  const MenuHeader = [
    { id: 1, name: t("header.home.title"), link: '/' },
    { id: 2, name: t("header.about.title"), link: '/about' },
    {
      id: 3,
      name: t("header.services.title"),
      link: '/services',
      subItems: [
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
        { title: t("header.services.listServices.5"), slug: "comprehensive-management" },
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
    { id: 4, name: t("header.news.title"), link: '/news' },
    { id: 5, name: t("header.contact.title"), link: '/contact' },
    { id: 6, name: t("header.recruitment.title"), link: '/careers' },
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
                              to={sub.slug ? `/services/${sub.slug}` : sub.link} 
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
                                    to={`/services/${sub.slug}/${subSub.slug}`} 
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