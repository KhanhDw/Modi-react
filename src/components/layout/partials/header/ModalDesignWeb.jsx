import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

function ModalDesignWeb() {
  const { t } = useLanguage();
  const [hoveredItem, setHoveredItem] = useState(null);
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

        } catch (e) {
          console.log("header fetchCategories:", e);
        }

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

  if (!categories.length) {
    return null; // không render gì cả
  }


  return (
    <div
      className="w-fit animate-in slide-in-from-top-2 backdrop-blur-xl duration-200 relative rounded-md"
      onMouseLeave={handleMouseLeaveContainer}
    >
      <div className="rounded-md bg-gray-700/60 dark:bg-gray-800/70 shadow-2xl border border-gray-200/40 dark:border-gray-700/40  relative">
        <div className="w-50 lg:min-w-[400px] xl:min-w-[200px] relative">
          <div className="space-y-1">
            {categories.map((item, index) => {
              const isActive = hoveredItem === index;

              return (
                <div
                  key={item.id + index}
                  className={`
                group cursor-pointer transition-all duration-200 ease-in-out transform
                px-3 py-2 rounded-lg relative
                ${isActive
                      ? "text-white"
                      : "hover:bg-slate-900 text-gray-300 dark:text-gray-200 hover:text-white"}
              `}
                  onMouseEnter={() => handleMouseEnterItem(index)}
                >
                  {/* Overlay effect */}
                  <div
                    className={`
                  absolute inset-0 rounded-lg transition-opacity duration-100
                  ${isActive
                        ? "bg-gray-900"
                        : ""}
                `}
                  ></div>

                  <div className="flex items-center justify-between relative z-10">
                    <Link
                      to={`/Products?category=${encodeURIComponent(item.title)}`}
                      className={`
                    flex-1 text-xs lg:text-sm transition-all duration-100
                    ${isActive ? "font-semibold" : "font-medium group-hover:font-semibold"}
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

export default ModalDesignWeb;