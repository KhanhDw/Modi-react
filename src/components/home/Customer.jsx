import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import LazyImage from "@/utils/LazyImage";

function Customer({ data, activeLang, sectionType }) {
  const { t } = useLanguage();
  
  // Simplified animation using CSS transitions instead of Framer Motion for better performance
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full rounded-lg bg-transparent p-6 md:p-10">
      <div ref={ref}>
        <div className="flex flex-col items-center justify-center w-full xs:gap-2 md:p-4 xs:px-3 xs:py-6 md:px-3 mb-10 bg-transparent rounded-lg md:flex-row">
          {/* Hình ảnh khách hàng cho màn hình nhỏ (ẩn trên md:) */}
          <div
            className="md:hidden md:p-2 xs:p-2 overflow-hidden shadow-sm md:w-1/2 shadow-black rounded-2xl transition-all duration-800"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-100px) scale(0.8)',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <LazyImage
              src="./images/What-Customers-Want.jpg"
              alt={t("home.customer.alt")}
              className="rounded-lg w-full h-auto"
            />
          </div>

          {/* Nội dung với hình ảnh nền (hiển thị từ md:) */}
          <div className="border-2 border-slate-700 relative xs:w-full md:w-full md:min-h-[400px] flex flex-col justify-center items-center md:items-start rounded-lg overflow-hidden">
            {/* Hình ảnh nền (ẩn trên xs:, hiển thị từ md:) */}
            <div className="absolute inset-0 hidden md:block w-full">
              <LazyImage
                src="./images/What-Customers-Want.jpg" // Sử dụng hình ảnh phù hợp làm nền
                alt="Background image of customer support"
                className="object-cover opacity-3 rounded-lg w-full" // Che phủ, độ mờ nhẹ
              />
            </div>
            {/* Lớp phủ để đảm bảo chữ dễ đọc */}
            <div className="absolute inset-0 hidden md:block bg-black/30 rounded-lg"></div>
            <div className="flex justify-between items-center gap-3 px-3">
              {/* Nội dung văn bản (tiêu đề, mô tả, nút) */}
              <div className="relative z-10 text-center md:text-left text-black md:text-white md:w-1/2 md:px-10">
                <h2
                  className="mb-4 xs:text-2xl md:text-3xl 2xl:text-7xl 3xl:text-8xl font-bold xs:py-2 md:py-6 dark:text-slate-100 transition-all duration-700"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
                    transitionTimingFunction: 'cubic-bezier(0.36, 0.66, 0.04, 1)'
                  }}
                >
                  {t("home.customer.title")}
                </h2>
                {data.map((customer, index) => (
                  <p
                    key={customer.id || index}
                    className="mb-4 text-justify text-gray-700 dark:text-gray-300 md:text-sm 2xl:text-lg 3xl:text-3xl xs:py-2 md:py-5 transition-all duration-1000 delay-200"
                    style={{
                      opacity: isVisible ? 1 : 0
                    }}
                  >
                    {/* {t("home.customer.description")} */}
                    {customer.description?.[activeLang]}
                  </p>
                ))}
                <div className="flex justify-center md:justify-start py-5">
                  <Link
                    to={`/contact`}
                    className="bg-[#2C3E50] hover:bg-[#415263] text-white px-6 xs:py-2 rounded-md text-lg cursor-pointer transition-colors duration-300"
                  >
                    {t("home.customer.btn")}
                  </Link>
                </div>
              </div>
              <div className="hidden md:block bg-black/30 rounded-lg w-1/2">
                <LazyImage
                  src="./images/What-Customers-Want.jpg"
                  alt={t("home.customer.alt")}
                  className="rounded-lg w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;
