import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function ServiceModi({ data, activeLang }) {
  const { t } = useLanguage();
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null); // card đang mở rộng

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024); // mobile & tablet
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = (id) => setHoveredItemId(id);
  const handleMouseLeave = () => setHoveredItemId(null);

  const getItemWidth = (id) => {
    if (hoveredItemId === null) {
      return `${100 / data.length}%`;
    }
    if (hoveredItemId === id) {
      return "35%";
    }
    return `${(100 - 35) / (data.length - 1)}%`;
  };

  if (!data || data.length === 0) return null;

  //--------------------------
  const [initialQuantity, setInitialQuantity] = useState([6]); // giá trị BE trả về
  async function fetchDataQuantity() {
    const res = await fetch(
      `${import.meta.env.VITE_MAIN_BE_URL}/api/service-home-page-ui`
    );
    const data = await res.json();
    setInitialQuantity([data.data.quantity]);
  }
  useEffect(() => {
    fetchDataQuantity();
  }, []);

  return (
    <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 bg-neutral-50 dark:bg-transparent w-full rounded-3xl">
      <div className="container mx-auto text-center flex flex-col gap-4 xs:gap-5 sm:gap-6 px-4 xs:px-5 sm:px-6 md:px-8 relative z-20">
        <h3 className="  text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-black dark:text-[#F3F4F6]">
          {t("home.serviceModi.title")}
        </h3>
        <div className="text-lg xs:text-xl sm:text-2xl text-gray-600 dark:text-[#D1D5DB]">
          {t("home.serviceModi.description")}
        </div>
      </div>

      <div className="relative z-20 mt-8 md:mt-12 container mx-auto w-full">
        {isMobileView ? (
          // ================= MOBILE / TABLET =================
          <div className="flex items-start overflow-x-auto snap-x snap-mandatory gap-6 px-4 pb-6 scrollbar-hide">
            {data.map((service) => {
              const isExpanded = expandedCardId === service.id;
              const description = service.description?.[activeLang] || "";

              return (
                <div
                  key={service.id}
                  className="snap-center shrink-0 w-[80%] sm:w-[60%] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                >
                  {/* Ảnh + overlay + title */}
                  <div className="relative h-65">
                    <img
                      src={`${import.meta.env.VITE_MAIN_BE_URL}${
                        service.image
                      }`}
                      alt={service.title?.[activeLang]}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/no-image.png")}
                    />

                    {/* Overlay phủ toàn bộ ảnh */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>

                    {/* Title nằm riêng dưới ảnh */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-lg sm:text-xl font-bold text-white">
                        {service.title?.[activeLang]}
                      </h4>
                    </div>
                  </div>

                  {/* Nội dung bên dưới ảnh */}
                  <div className="p-4 flex flex-col justify-start">
                    <p
                      className={`text-gray-700 dark:text-gray-200 text-sm sm:text-base transition-all duration-300 ${
                        isExpanded ? "line-clamp-none" : "line-clamp-3"
                      }`}
                    >
                      {description}
                    </p>

                    {/* Nút Xem thêm / Thu gọn */}
                    {description.length > 100 && (
                      <button
                        onClick={() => toggleExpand(service.id)}
                        className="text-blue-500 hover:underline text-sm self-start"
                      >
                        {isExpanded ? "Thu gọn" : "Xem thêm"}
                      </button>
                    )}

                    {/* CTA */}
                    <a
                      className="mt-3 inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors focus:bg-blue-600"
                      href={service.href || "#"}
                    >
                      {t("home.serviceModi.findOutMore")}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // ================= DESKTOP =================
          <div className="flex w-full h-[400px] overflow-hidden rounded-lg shadow-lg">
            {data.slice(0, initialQuantity).map((service) => (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredItemId(service.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                className={`relative overflow-hidden cursor-pointer transition-[flex-grow] duration-500 ease-in-out ${
                  hoveredItemId === service.id ? "flex-[4]" : "flex-[1]"
                }`}
              >
                <img
                  src={`${import.meta.env.VITE_MAIN_BE_URL}${service.image}`}
                  alt={service.title?.[activeLang]}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/no-image.png")}
                />
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 py-8 text-white z-10 bg-gradient-to-t from-black/80 dark:from-gray-900/90 to-transparent">
                  <h4 className="text-2xl font-bold mb-4">
                    {service.title?.[activeLang]}
                  </h4>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      hoveredItemId === service.id
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <p className="text-lg mb-4 font-light">
                      {service.description?.[activeLang]}
                    </p>
                    <a
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white text-white hover:bg-blue-500 hover:text-gray-900 transition-colors"
                      href={service.href || "#"}
                    >
                      Tìm hiểu thêm
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ServiceModi;
