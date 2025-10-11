import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";

function Customer({ data, activeLang }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.8 });

  return (
    <div className="w-full  rounded-lg bg-transparent p-6  md:p-10">
      <div ref={ref}>
        <div className="flex flex-col items-center justify-center w-full xs:gap-2 md:p-4 xs:px-3 xs:py-6 md:px-3 mb-10 bg-transparent rounded-lg md:flex-row">
          {/* Hình ảnh khách hàng cho màn hình nhỏ (ẩn trên md:) */}
          <motion.div
            initial={{ x: -100, scale: 0.8, opacity: 0 }}
            animate={isInView ? { x: 0, scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:hidden md:p-2 xs:p-2 overflow-hidden shadow-sm md:w-1/2 shadow-black rounded-2xl"
          >
            <img
              src="./images/What-Customers-Want.jpg"
              alt={t("home.customer.alt")}
              className="rounded-lg w-full h-auto"
            />
          </motion.div>

          {/* Nội dung với hình ảnh nền (hiển thị từ md:) */}
          <div className="border-2 border-slate-700 relative  xs:w-full md:w-full md:min-h-[400px]  flex flex-col justify-center items-center md:items-start rounded-lg overflow-hidden">
            {/* Hình ảnh nền (ẩn trên xs:, hiển thị từ md:) */}
            <div className="absolute inset-0 hidden md:block  w-full">
              <img
                src="./images/What-Customers-Want.jpg" // Sử dụng hình ảnh phù hợp làm nền
                alt="Background image of customer support"
                className="object-cover opacity-3 rounded-lg  w-full" // Che phủ, độ mờ nhẹ
              />
            </div>
            {/* Lớp phủ để đảm bảo chữ dễ đọc */}
            <div className="absolute inset-0 hidden md:block bg-black/30 rounded-lg "></div>
            <div className="flex justify-between items-center gap-3 px-3">
              {/* Nội dung văn bản (tiêu đề, mô tả, nút) */}
              <div className="relative z-10 text-center md:text-left text-black md:text-white md:w-1/2 md:px-10">
                <motion.h2
                  initial={{ y: -50, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ type: "spring", stiffness: 120 }}
                  className="mb-4 xs:text-2xl md:text-3xl 2xl:text-7xl 3xl:text-8xl font-bold xs:py-2 md:py-6 dark:text-slate-100"
                >
                  {t("home.customer.title")}
                </motion.h2>
                {data.map((customer, index) => (
                  <motion.p
                    key={customer.id || index}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mb-4 text-justify text-gray-700 dark:text-gray-300 md:text-sm 2xl:text-lg 3xl:text-3xl xs:py-2 md:py-5"
                  >
                    {/* {t("home.customer.description")} */}
                    {customer.description?.[activeLang]}
                  </motion.p>
                ))}
                <div className="flex justify-center md:justify-start py-5">
                  <Link
                    to={`/contact`}
                    className="bg-[#2C3E50] hover:bg-[#415263] text-white px-6 xs:py-2  rounded-md text-lg cursor-pointer"
                  >
                    {t("home.customer.btn")}
                  </Link>
                </div>
              </div>
              <div className="hidden md:block bg-black/30 rounded-lg w-1/2 ">
                <img
                  src="./images/What-Customers-Want.jpg"
                  alt={t("home.customer.alt")}
                  className="rounded-lg w-full h-auto"
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
