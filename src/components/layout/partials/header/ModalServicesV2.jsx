import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { useLanguage } from '@/contexts/LanguageContext';

function ModalServices({ maxColumns = 1, minColumnWidth = 250 }) {
  const { t } = useLanguage();
  
  // Chuẩn hóa data structure
  const services = useMemo(() => [
    {
      title: t("header.services.listServices.0"),
      href: "/services/online-kickstart",
      subItems: [
        { title: "Tư Vấn Cơ Bản", href: "/services/online-kickstart/advise" },
        { title: "Thiết Kế Gói Dịch Vụ", href: "/services/online-kickstart/design-service-package" },
        { title: "Hỗ Trợ Triển Khai", href: "/services/online-kickstart/support-implementation" },
      ],
    },
    {
      title: t("header.services.listServices.1"),
      href: "/services/one-me",
    },
    {
      title: t("header.services.listServices.2"),
      href: "/services/brand-building",
      subItems: [
        { title: "Xây Dựng Thương Hiệu Cá Nhân", href: "/services/brand-building/personal-brand" },
        { title: "Chiến Lược Thương Hiệu", href: "/services/brand-building/brand-strategy" },
        { title: "Thiết Kế Nhận Diện", href: "/services/brand-building/identity-design" },
      ],
    },
    { title: t("header.services.listServices.3"), href: "/services/online-store" },
    { title: t("header.services.listServices.4"), href: "/services/service-booking" },
    {
      title: t("header.services.listServices.5"),
      href: "/services/comprehensive-management",
      subItems: [
        { title: "Xây Dựng Thương Hiệu Cá Nhân", href: "/services/comprehensive-management/personal-brand" },
        { title: "Chiến Lược Thương Hiệu", href: "/services/comprehensive-management/brand-strategy" },
        { title: "Thiết Kế Nhận Diện", href: "/services/comprehensive-management/identity-design" },
      ],
    },
    { title: t("header.services.listServices.6"), href: "/services/website-app" },
    { title: t("header.services.listServices.7"), href: "/services/re-vision" },
    { title: t("header.services.listServices.8"), href: "/services" },
    { title: t("header.services.listServices.9"), href: "/services" },
    { title: t("header.services.listServices.10"), href: "/services" },
    {
      title: t("header.services.listServices.11"),
      href: "/services",
      subItems: [
        { title: "Xây Dựng Thương Hiệu Cá Nhân", href: "/services/personal-brand" },
        { title: "Chiến Lược Thương Hiệu", href: "/services/brand-strategy" },
        { title: "Thiết Kế Nhận Diện", href: "/services/identity-design" },
      ],
    },
    { title: t("header.services.listServices.12"), href: "/services" },
    { title: t("header.services.listServices.13"), href: "/services" },
  ], [t]);

  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);

  // Tính toán số cột động dựa trên số items và maxColumns
  const { columns, columnCount } = useMemo(() => {
    const actualColumns = Math.min(maxColumns, Math.ceil(services.length / 5)); // Tối đa 5 items/cột
    const itemsPerColumn = Math.ceil(services.length / actualColumns);
    
    const columnsData = [];
    for (let i = 0; i < actualColumns; i++) {
      const start = i * itemsPerColumn;
      const end = Math.min(start + itemsPerColumn, services.length);
      columnsData.push(services.slice(start, end));
    }
    
    return {
      columns: columnsData,
      columnCount: actualColumns
    };
  }, [services, maxColumns]);

  // Tính toán width động
  const containerWidth = useMemo(() => {
    const baseWidth = columnCount * minColumnWidth;
    const gaps = (columnCount - 1) * 24; // gap-6 = 24px
    const padding = 32; // p-4 = 16px * 2
    return Math.max(baseWidth + gaps + padding, 500);
  }, [columnCount, minColumnWidth]);

  const handleMouseEnterItem = (originalIndex, columnIndex) => {
    setHoveredItem(originalIndex);
    setHoveredColumn(columnIndex);
  };

  const handleMouseLeaveContainer = () => {
    setHoveredItem(null);
    setHoveredColumn(null);
  };

  // Tính toán vị trí submenu động
  const getSubMenuPosition = (columnIndex) => {
    const columnWidth = 100 / columnCount; // Phần trăm width mỗi cột
    const nextColumnStart = (columnIndex + 1) * columnWidth;
    
    if (columnIndex === columnCount - 1) {
      // Cột cuối cùng - hiện bên trái
      return {
        right: `${columnWidth}%`,
        transform: 'translateX(12px)',
      };
    } else {
      // Các cột khác - hiện bên phải
      return {
        left: `${nextColumnStart}%`,
        transform: 'translateX(12px)',
      };
    }
  };

  return (
    <div
      className="w-fit animate-in slide-in-from-top-2 duration-200 relative"
      onMouseLeave={handleMouseLeaveContainer}
    >
      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl p-4 relative">
        <div 
          className={`grid gap-4 lg:gap-6 relative`}
          style={{ 
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            minWidth: `${containerWidth}px`
          }}
        >
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-1">
              {column.map((service, index) => {
                const originalIndex = colIndex * Math.ceil(services.length / columnCount) + index;
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
                        to={service.href}
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

                    {/* Bridge element for smooth hover - cho cột không phải cuối */}
                    {service.subItems && colIndex < columnCount - 1 && isActive && (
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

        {/* Submenu */}
        {hoveredItem !== null && services[hoveredItem]?.subItems && hoveredColumn !== null && (
          <div
            className="absolute top-4 z-70 min-w-[250px] lg:min-w-[280px] animate-in slide-in-from-top-2 duration-200"
            style={getSubMenuPosition(hoveredColumn)}
            onMouseEnter={() => setHoveredItem(hoveredItem)}
            onMouseLeave={() => {
              setTimeout(() => {
                setHoveredItem(null);
                setHoveredColumn(null);
              }, 50);
            }}
          >
            {/* Bridge element */}
            {hoveredColumn < columnCount - 1 && (
              <div
                className="absolute -left-4 top-0 w-4 h-full bg-transparent z-10"
                onMouseEnter={() => setHoveredItem(hoveredItem)}
              />
            )}

            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden">
              <ul className="list-none py-3">
                {services[hoveredItem].subItems.map((sub, subIndex) => (
                  <li
                    key={subIndex}
                    className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white transition-all duration-300 cursor-pointer mx-2 mb-1 last:mb-0 rounded-lg"
                  >
                    <Link
                      to={sub.href}
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

export default ModalServices;