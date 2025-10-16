import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";

const BannerSlider = memo(function BannerSlider({ data, activeLang }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [showNext, setShowNext] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.8 });

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNext(true);

      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % data.length);
        setNextIndex((prev) => (prev + 1) % data.length);
        setShowNext(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }, 10000);

    return () => clearInterval(interval);
  }, [data]);

  // Nếu chưa có data thì return loading
  if (!data || data.length === 0) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative h-[80vh] w-full md:rounded-[40px] overflow-hidden mb-10"
      >
        <AnimatePresence>
          {/* Ảnh hiện tại */}
          <motion.img
            key={`current-image-${currentIndex}`}
            src={data[currentIndex].banner}
            initial={{ opacity: 1, filter: "brightness(100%)" }}
            animate={
              isInView
                ? {
                    opacity: showNext ? 0 : 1,
                    filter: showNext ? "brightness(100%)" : "brightness(50%)",
                  }
                : {}
            }
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-full h-full object-cover md:rounded-[40px] z-20"
            alt="banner"
          loading="eager"
        />

          {/* Nội dung */}
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: showNext ? 0 : 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 flex flex-col items-start justify-center text-white bg-transparent px-4 mt-10 sm:px-12 md:px-10 lg:pl-20 xl:pl-30 2xl:w-2/3"
          >
            {/* Title */}
            <h2
              className="font-bold text-start mb-2 md:mb-4 lg:mb-6
      text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl
      xs:ml-2 sm:ml-4 md:ml-0"
            >
              {data[currentIndex].title[activeLang]}
            </h2>

            {/* Paragraph */}
            <p
              className="mb-3 md:mb-5 lg:mb-6 text-justify
      text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
      max-w-[95%] sm:max-w-[90%] md:max-w-[95%] lg:max-w-[80%]
      xs:ml-2 sm:ml-4 md:ml-0"
            >
              {data[currentIndex].description[activeLang]}
            </p>

            {/* Button */}
            {data[currentIndex].buttonText && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="
        px-2 py-1 sm:py-2 text-white bg-green-600 rounded-lg shadow-lg
        hover:bg-blue-700 transition-colors duration-300
        xs:ml-2 sm:ml-4 md:ml-0
      "
              >
                <Link
                  className="text-sm sm:text-sm md:text-lg lg:text-xl 2xl:text-2xl
        font-semibold"
                  to="/about"
                >
                  {t(data[currentIndex].buttonText)}
                </Link>
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Ảnh kế tiếp */}
        <AnimatePresence mode="wait">
          <motion.img
            key={`next-image-${nextIndex}`}
            src={data[nextIndex].banner}
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={
              isInView
                ? {
                    opacity: showNext ? 1 : 0,
                    filter: "blur(0px)",
                  }
                : {}
            }
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-full h-full object-cover md:rounded-[40px] z-10"
            alt="next banner"
          loading="lazy"
        />
        </AnimatePresence>

        {/* Nút dot chọn banner */}
        <div className="absolute right-0 flex md:flex-col items-center justify-center h-[80vh] md:mx-4 md:transform xs:-translate-y-1/2 z-51 xs:bottom md:top-1/2 xs:gap-1 md:gap-2">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`${
                currentIndex === index ? "bg-gray-100" : "bg-gray-600"
              } xs:h-2 md:w-4 xs:w-2 md:h-4 mb-3 rounded-full cursor-pointer`}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
});

export default BannerSlider;
