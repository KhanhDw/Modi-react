import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TiArrowSortedDown } from "react-icons/ti";
import { useLanguage } from "../../contexts/LanguageContext";

function BenefitBusiness({ data, activeLang }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.8 });
  const [hovered, setHovered] = useState(null);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div
      ref={ref}
      className="flex flex-col md:flex-row items-center justify-center w-full mx-auto gap-6 xs:pb-4 md:pb-10 xs:px-2"
    >
      {/* Left Images */}
      <div className="flex flex-col md:flex-row items-center justify-center md:w-1/2 gap-3 xs:w-full">
        {/* Hình ảnh chỉ hiển thị trên md+ */}
        <div className="hidden md:flex w-full gap-3">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-2xl shadow-sm shadow-black h-40 md:h-140 3xl:h-180 w-1/2"
          >
            <img
              src="/images/company.jpg"
              className="object-cover w-full h-full"
            />
          </motion.div>
          <div className="flex flex-col gap-3 w-1/2">
            <motion.img
              initial={{ y: -80, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              src="/images/business.jpg"
              className="object-cover w-full h-1/2 rounded-2xl shadow-sm shadow-black"
            />
            <motion.img
              initial={{ y: 80, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              src="/images/Benefits.jpg"
              className="object-cover w-full h-1/2 rounded-2xl shadow-sm shadow-black"
            />
          </div>
        </div>
      </div>

      {/* Right Text */}
      <div className="flex flex-col items-center md:items-start justify-center md:w-1/2 gap-4 xs:w-full xs:px-2">
        <motion.p
          initial={{ x: 100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="font-bold text-center md:text-left text-3xl lg:text-4xl xl:text-5xl dark:text-white text-black"
        >
          {t("home.benefit.mainTitle")}
        </motion.p>

        {data.map((item, index) => (
          <div
            key={item.id}
            className="w-full"
          >
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center justify-start gap-2 w-full text-left px-2 py-2 rounded-lg font-semibold xs:text-sm text-base md:text-lg lg:text-xl xl:text-2xl transition-all duration-300 cursor-pointer dark:text-white text-black bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <TiArrowSortedDown
                className={`transition-all duration-300 ${
                  hovered === index
                    ? "text-green-600"
                    : "text-black dark:text-white"
                }`}
              />
              <span className="xs:text-lg xs:font-semibold">
                {item.title?.[activeLang]}
              </span>
            </motion.button>

            <AnimatePresence mode="wait">
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="pl-6 mt-2"
                >
                  <ul className="list-disc space-y-1 dark:text-white text-black xs:text-sm md:text-base lg:text-lg xl:text-xl">
                    {item.description?.[activeLang]?.map(
                      (contentItem, subIndex) => (
                        <li key={subIndex}>{contentItem}</li>
                      )
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BenefitBusiness;
