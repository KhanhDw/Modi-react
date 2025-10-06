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
      className="flex items-center justify-center w-full mx-auto md:gap-2 xs:pb-1 md:pb-10 xs:px-2"
    >
      {/* Left Images */}
      <div className="flex items-center justify-end md:w-1/2 xs:hidden md:flex md:gap-3">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex md:w-1/2 overflow-hidden xs:h-140 md:h-140 3xl:h-180 rounded-2xl shadow-sm shadow-black"
        >
          <img
            src="/images/company.jpg"
            className="object-cover w-full h-full"
          />
        </motion.div>
        <div className="flex flex-col w-1/2 gap-3 h-140 3xl:h-180">
          <motion.img
            initial={{ y: -80, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            src="/images/business.jpg"
            className="object-cover w-full h-full overflow-hidden rounded-2xl shadow-sm shadow-black"
          />
          <motion.img
            initial={{ y: 80, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            src="/images/Benefits.jpg"
            className="object-cover w-full h-full overflow-hidden rounded-2xl shadow-sm shadow-black"
          />
        </div>
      </div>

      {/* Right Text */}
      <div className="flex flex-col md:items-start xs:items-center justify-center md:w-1/2 md:pl-10 xs:px-5">
        <motion.p
          initial={{ x: 100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-10 md:text-3xl xs:text-xl 3xl:text-6xl font-bold text-center dark:text-white text-black"
        >
          {t("home.benefit.mainTitle")}
        </motion.p>
        {data.map((item, index) => (
          <div
            key={item.id}
            className="mb-10"
          >
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center justify-start xs:gap-0 mb-2 xs:text-lg md:text-md 3xl:text-3xl font-bold text-center transition-all duration-300 cursor-pointer"
              type="button"
            >
              <TiArrowSortedDown
                className={`dark:text-white text-black transition-all duration-300 ${
                  hovered === index
                    ? "text-green-600 border-1 border-black rounded-2xl"
                    : ""
                }`}
              />
              <span className="dark:text-white text-black font-semibold text-3xl">
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
                >
                  <ul className="pl-15 mt-5">
                    {item.description?.[activeLang]?.map(
                      (contentItem, subIndex) => (
                        <li
                          key={subIndex}
                          className="py-1 pl-1 list-disc 3xl:text-xl dark:text-white text-black"
                        >
                          {contentItem}
                        </li>
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
