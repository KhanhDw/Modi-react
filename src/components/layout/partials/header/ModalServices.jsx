import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

function ModalServices() {
  // Mock translation function
  const t = (key) => {
    const translations = {
      "header.services.listServices.0": "Online Kickstart",
      "header.services.listServices.1": "One Me",
      "header.services.listServices.2": "Brand Building", 
      "header.services.listServices.3": "Online Store",
      "header.services.listServices.4": "Service Booking",
      "header.services.listServices.5": "Comprehensive Management",
      "header.services.listServices.6": "Website & App",
      "header.services.listServices.7": "Re-Vision",
      "header.services.listServices.8": "Digital Marketing",
      "header.services.listServices.9": "SEO Services",
      "header.services.listServices.10": "Social Media",
      "header.services.listServices.11": "Consulting",
      "header.services.listServices.12": "Training",
      "header.services.listServices.13": "Support"
    };
    return translations[key] || key;
  };
  
  // Data structure
  const services = useMemo(() => [
    {
      id: 0,
      title: t("header.services.listServices.0"),
      href: "/services/online-kickstart",
      subItems: [
        { title: "Tư Vấn Cơ Bản", href: "/services/online-kickstart/advise" },
        { title: "Thiết Kế Gói Dịch Vụ", href: "/services/online-kickstart/design-service-package" },
        { title: "Hỗ Trợ Triển Khai", href: "/services/online-kickstart/support-implementation" },
      ],
    },
    {
      id: 1,
      title: t("header.services.listServices.1"),
      href: "/services/one-me",
    },
    {
      id: 2,
      title: t("header.services.listServices.2"),
      href: "/services/brand-building",
      subItems: [
        { title: "Xây Dựng Thương Hiệu Cá Nhân", href: "/services/brand-building/personal-brand" },
        { title: "Chiến Lược Thương Hiệu", href: "/services/brand-building/brand-strategy" },
        { title: "Thiết Kế Nhận Diện", href: "/services/brand-building/identity-design" },
        { title: "Quản Lý Thương Hiệu", href: "/services/brand-building/brand-management" },
      ],
    },
    { 
      id: 3,
      title: t("header.services.listServices.3"), 
      href: "/services/online-store" 
    },
    { 
      id: 4,
      title: t("header.services.listServices.4"), 
      href: "/services/service-booking" 
    },
    {
      id: 5,
      title: t("header.services.listServices.5"),
      href: "/services/comprehensive-management",
      subItems: [
        { title: "Quản Lý Toàn Diện", href: "/services/comprehensive-management/full-management" },
        { title: "Phân Tích & Báo Cáo", href: "/services/comprehensive-management/analytics" },
        { title: "Tối Ưu Hóa", href: "/services/comprehensive-management/optimization" },
      ],
    },
    { 
      id: 6,
      title: t("header.services.listServices.6"), 
      href: "/services/website-app" 
    },
    { 
      id: 7,
      title: t("header.services.listServices.7"), 
      href: "/services/re-vision" 
    },
    { 
      id: 8,
      title: t("header.services.listServices.8"), 
      href: "/services/digital-marketing" 
    },
    { 
      id: 9,
      title: t("header.services.listServices.9"), 
      href: "/services/seo" 
    },
    { 
      id: 10,
      title: t("header.services.listServices.10"), 
      href: "/services/social-media" 
    },
    {
      id: 11,
      title: t("header.services.listServices.11"),
      href: "/services/consulting",
      subItems: [
        { title: "Tư Vấn Chiến Lược", href: "/services/consulting/strategy" },
        { title: "Tư Vấn Kỹ Thuật", href: "/services/consulting/technical" },
        { title: "Tư Vấn Marketing", href: "/services/consulting/marketing" },
      ],
    },
    { 
      id: 12,
      title: t("header.services.listServices.12"), 
      href: "/services/training" 
    },
    { 
      id: 13,
      title: t("header.services.listServices.13"), 
      href: "/services/support" 
    },
  ], []);

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnterItem = (serviceId) => {
    setHoveredItem(serviceId);
  };

  const handleMouseLeaveContainer = () => {
    setHoveredItem(null);
  };

  // Kiểm tra xem có submenu nào đang được hiển thị không
  const activeService = services.find(s => s.id === hoveredItem);
  const hasActiveSubmenu = activeService && activeService.subItems && activeService.subItems.length > 0;

  return (
    <div
      className="w-fit animate-in slide-in-from-top-2 duration-200 relative"
      onMouseLeave={handleMouseLeaveContainer}
    >
      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden">
        <div className="flex">
          {/* Cột 1: Menu cấp 1 */}
          <div className="flex-shrink-0 w-80 p-4 border-r border-gray-200/50 dark:border-gray-700/50">
            <div className="space-y-1">
              {services.map((service) => {
                const isActive = hoveredItem === service.id;
                const hasSubItems = service.subItems && service.subItems.length > 0;

                return (
                  <div
                    key={service.id}
                    className={`
                      group cursor-pointer transition-all duration-300 ease-in-out transform
                      px-4 py-3 rounded-lg border-l-4 relative
                      ${isActive && hasSubItems
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white translate-x-1'
                        : 'bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 border-transparent hover:border-emerald-400 text-gray-700 dark:text-gray-200 hover:text-white hover:translate-x-1'
                      }
                    `}
                    onMouseEnter={() => handleMouseEnterItem(service.id)}
                  >
                    <div
                      className={`
                        absolute inset-0 rounded-lg transition-opacity duration-300
                        ${isActive && hasSubItems
                          ? 'bg-gradient-to-r from-transparent to-emerald-200 dark:to-emerald-800/30 opacity-100'
                          : 'bg-gradient-to-r from-transparent to-emerald-100 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100'
                        }
                      `}
                    />

                    <div className="flex items-center justify-between relative z-10">
                      <a
                        href={service.href}
                        className={`
                          flex-1 text-sm transition-all duration-300
                          ${isActive && hasSubItems ? 'font-bold' : 'font-medium group-hover:font-semibold'}
                        `}
                      >
                        {service.title}
                      </a>
                      {hasSubItems && (
                        <ChevronDown
                          className={`
                            ml-2 w-4 h-4 transition-transform duration-300
                            ${isActive ? 'rotate-90' : 'group-hover:rotate-90'}
                          `}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột 2: Menu cấp 2 - chỉ hiển thị khi có submenu */}
          <div 
            className={`
              transition-all duration-300 ease-in-out overflow-hidden
              ${hasActiveSubmenu ? 'w-72 opacity-100' : 'w-0 opacity-0'}
            `}
          >
            {hasActiveSubmenu && (
              <div className="p-4 min-h-full bg-gray-50/50 dark:bg-gray-800/50">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {activeService.title}
                  </h3>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                </div>
                
                <ul className="space-y-2">
                  {activeService.subItems.map((sub, subIndex) => (
                    <li key={subIndex} className="group">
                      <a
                        href={sub.href}
                        className="flex items-center px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white transition-all duration-300 cursor-pointer rounded-lg text-sm font-medium hover:font-semibold hover:translate-x-1"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:scale-125" />
                        {sub.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalServices;