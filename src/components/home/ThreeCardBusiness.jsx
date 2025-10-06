import React, { useState, useEffect } from "react";

function ThreeCardBusiness({ data, activeLang }) {
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024); // mobile + tablet
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  if (!data || data.length === 0) return null;

  return (
    <section className="w-full rounded-2xl">
      <div className="container mx-auto w-full my-4">
        {isMobileView ? (
          // ================= MOBILE / TABLET =================
          <div className="flex items-start overflow-x-auto snap-x snap-mandatory gap-6 px-2 scrollbar-hide">
            {data.map((item) => {
              const isExpanded = expandedCardId === item.id;
              const description = item.description?.[activeLang] || "";

              return (
                <div
                  key={item.id}
                  className="snap-center shrink-0
                   w-[80%] sm:w-[70%] md:w-[60%]
                   bg-white dark:bg-gray-800
                   rounded-2xl shadow-lg overflow-hidden flex flex-col "
                >
                  {/* Hình ảnh */}
                  <div className="h-56 sm:h-60 md:h-70 rounded-xl p-4 overflow-hidden  ">
                    <img
                      src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image}`}
                      alt={item.title?.[activeLang]}
                      className="w-full h-full object-cover  border-2 border-gray-600 rounded-xl"
                      onError={(e) => (e.currentTarget.src = "/no-image.png")}
                    />
                  </div>

                  {/* Title + Mô tả */}
                  <div className="p-4 md:p-6 flex flex-col justify-start">
                    <h4
                      className={`text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2
                                        ${
                                          isExpanded
                                            ? "line-clamp-none"
                                            : "line-clamp-1"
                                        }`}
                    >
                      {item.title?.[activeLang]}
                    </h4>

                    <p
                      className={`text-gray-700 dark:text-gray-200
                        text-sm sm:text-base md:text-lg
                        transition-all duration-300
                        ${isExpanded ? "line-clamp-none" : "line-clamp-3"}`}
                    >
                      {description}
                    </p>

                    {/* Nút Xem thêm / Thu gọn */}
                    {description.length > 100 && (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-blue-500 hover:underline text-sm self-start mt-2 cursor-pointer"
                      >
                        {isExpanded ? "Thu gọn" : "Xem thêm"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // ================= DESKTOP =================
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 items-start">
            {data.map((item) => {
              const isExpanded = expandedCardId === item.id;
              const description = item.description?.[activeLang] || "";

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col"
                >
                  {/* Hình ảnh */}
                  <div className="h-65  rounded-xl p-4 overflow-hidden ">
                    <img
                      src={`${import.meta.env.VITE_MAIN_BE_URL}${item.image}`}
                      alt={item.title?.[activeLang]}
                      className="w-full h-full object-cover  border-2 border-gray-300 dark:border-gray-600 rounded-xl"
                      onError={(e) => (e.currentTarget.src = "/no-image.png")}
                    />
                  </div>

                  {/* Title + Mô tả */}
                  <div className="p-6 flex flex-col">
                    <h4
                      className={`text-xl font-bold text-gray-900 dark:text-white mb-2
                                             ${
                                               isExpanded
                                                 ? "line-clamp-none"
                                                 : "line-clamp-1"
                                             }`}
                    >
                      {item.title?.[activeLang]}
                    </h4>

                    {/* Mô tả thu gọn/mở rộng */}
                    <p
                      className={`text-gray-700 dark:text-gray-200 text-base leading-relaxed transition-all duration-300 ${
                        isExpanded ? "line-clamp-none" : "line-clamp-3"
                      }`}
                    >
                      {description}
                    </p>

                    {/* Nút Xem thêm / Thu gọn */}
                    {description.length > 120 && (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-blue-500 hover:underline text-sm self-start mt-2 cursor-pointer"
                      >
                        {isExpanded ? "Thu gọn" : "Xem thêm"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ThreeCardBusiness;
