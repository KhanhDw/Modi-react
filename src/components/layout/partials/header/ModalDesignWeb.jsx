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
                  key={item.id + index}
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

export default ModalDesignWeb;