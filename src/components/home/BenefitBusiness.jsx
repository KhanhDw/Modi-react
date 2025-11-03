import React, { useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TiArrowSortedDown } from "react-icons/ti";
import { useLanguage } from "@/contexts/LanguageContext";
import LazyImage from "@/utils/LazyImage";

function BenefitBusiness({ data, activeLang, sectionType }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.8 });
  const [hovered, setHovered] = useState(null);
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = useCallback((index) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  return (
    <div
      ref={ref}
      className="flex flex-col md:flex-row items-center justify-center w-full mx-auto gap-6 xs:pb-4 md:pb-10 xs:px-2"
    >
      {/* Left Images */}
      <div className="flex flex-col md:flex-row items-center justify-center md:w-1/2 gap-3 xs:w-full">
        {/* Hình ảnh chỉ hiển thị trên md+ */}
        <div className="hidden md:flex w-full gap-3">
          <div
            className={`overflow-hidden rounded-2xl shadow-sm shadow-black h-40 md:h-140 3xl:h-180 w-1/2 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100px]'
            }`}
          >
            <LazyImage
              src="/images/company.jpg"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-3 w-1/2">
            <div
              className={`w-full h-1/2 rounded-2xl shadow-sm shadow-black overflow-hidden transition-all duration-700 delay-300 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-80px]'
              }`}
            >
              <LazyImage
                src="/images/business.jpg"
                className="object-cover w-full h-full"
              />
            </div>
            <div
              className={`w-full h-1/2 rounded-2xl shadow-sm shadow-black overflow-hidden transition-all duration-700 delay-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[80px]'
              }`}
            >
              <LazyImage
                src="/images/Benefits.jpg"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Text */}
      <div className="flex flex-col items-center md:items-start justify-center md:w-1/2 gap-4 xs:w-full xs:px-2">
        <p
          className={`font-bold text-center md:text-left text-3xl lg:text-4xl xl:text-5xl dark:text-white text-black transition-all duration-800 ${
            isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'
          }`}
        >
          {t("home.benefit.mainTitle")}
        </p>

        {memoizedData.map((item, index) => (
          <div
            key={item.id}
            className="w-full"
          >
            <button
              className={`flex items-center justify-start gap-2 w-full text-left px-2 py-2 rounded-lg font-semibold xs:text-sm text-base md:text-lg lg:text-xl xl:text-2xl transition-all duration-300 cursor-pointer dark:text-white text-black bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
              }`}
              style={{ transition: 'all 1s ease', transform: hovered === index ? 'scale(1.03)' : 'scale(1)' }}
              onClick={() => handleToggle(index)}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
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
            </button>

            {openIndex === index && (
              <div
                className="pl-6 mt-2 overflow-hidden transition-all duration-400 ease-in-out"
                style={{
                  maxHeight: openIndex === index ? '500px' : '0',
                  opacity: openIndex === index ? '1' : '0'
                }}
              >
                <ul className="list-disc space-y-1 dark:text-white text-black xs:text-sm md:text-base lg:text-lg xl:text-xl">
                  {item.description?.[activeLang]?.map(
                    (contentItem, subIndex) => (
                      <li key={subIndex}>{contentItem}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BenefitBusiness;
