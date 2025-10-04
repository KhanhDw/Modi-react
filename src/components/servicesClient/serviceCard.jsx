import useLenisLocal from "@/hook/useLenisLocal";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HoverButtonsServiceCard from "./buttonServiceCard";
import { motion } from "framer-motion";

export default function ServiceCard({ service, onFetchService }) {
  if (!service) return null;
  useLenisLocal(".lenis-local");
  const navigate = useNavigate();

  const translation = service?.translation || {};

  // Luôn bắt đầu với Features view (false)
  const [showDetails, setShowDetails] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleToUp = () => {
    setShowDetails(false);
  };

  const handleToDown = () => {
    setShowDetails(true);
  };

  const handleMouseLeave = () => {
    if (isLargeScreen) {
      setShowDetails(false);
    }
  };

  const features = translation.features
    ? translation.features
        .split("#")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  const details = translation.details
    ? translation.details
        .split("#")
        .map((d) => d.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      className="h-full relative w-full mx-auto rounded-md md:rounded-xl shadow-lg hover:shadow-black/40
                 dark:hover:shadow-green-400/40 border border-gray-200
                 dark:border-gray-700 overflow-hidden transform
                 transition duration-500 hover:-translate-y-2 group flex flex-col"
      onMouseLeave={handleMouseLeave}
    >
      {/* background overlay */}
      <div
        className="absolute inset-0 bg-[url('https://i.pinimg.com/originals/63/45/08/6345088e1d1a622a2c0996122a187ee0.jpg')]
                   bg-cover bg-center opacity-0 group-hover:opacity-60 blur-4xl
                   transition duration-500"
      />

      <div className="relative h-full bg-gray-200/60 dark:bg-gray-900/60 backdrop-blur-lg flex flex-col">
        {/* Title & desc */}
        <div className="p-3 md:p-4 border-b dark:border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white cursor-default line-clamp-2">
            {translation.ten_dich_vu || "Chưa có tên dịch vụ"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 cursor-default text-sm md:text-base line-clamp-2 mt-1">
            {translation.mo_ta || ""}
          </p>
        </div>

        {/* Layout */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Left: Image */}
          <div className="md:order-1">
            <div
              className="border-2 border-gray-400 dark:border-gray-200 dark:group-hover:shadow-gray-600
                         transition-all duration-200 shadow-lg w-full
                         aspect-video md:aspect-square md:h-72 lg:h-64 xl:h-72
                         bg-gray-50 dark:bg-gray-800 rounded-md md:rounded-xl overflow-hidden grid place-items-center"
            >
              <img
                src={`${import.meta.env.VITE_MAIN_BE_URL}${service.image_url}`}
                alt={translation.ten_dich_vu || "Ảnh dịch vụ"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: features + detail + buttons */}
          <div className="flex flex-col items-center md:order-2 h-full">
            <div className="h-full flex w-full items-center gap-2 flex-grow mb-4 min-h-[200px] ">
              {/* MOBILE/TABLET: Only Features (xs -> md) */}
              <div className="lg:hidden w-full flex-1">
                <div className="h-full overflow-y-auto pr-2">
                  {features.length > 0 ? (
                    <ul className="space-y-2">
                      {features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="p-2 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-sm p-2">
                      Không có tính năng
                    </div>
                  )}
                </div>
              </div>

              {/* DESKTOP: Animated slide layout (lg+) */}
              <div className="hidden lg:flex flex-row w-full items-center gap-2 flex-1 ">
                {/* Animation container */}
                <div className="flex-1 overflow-hidden relative min-h-[240px] ">
                  <div className="relative w-full h-full min-h-[240px]">
                    {/* Features panel */}
                    <motion.div
                      initial={false}
                      animate={{
                        x: showDetails ? "-100%" : "0%",
                        opacity: showDetails ? 0 : 1,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute top-0 left-0 w-full h-full overflow-y-auto pr-2"
                      style={{
                        pointerEvents: showDetails ? "none" : "auto",
                      }}
                    >
                      {features.length > 0 ? (
                        <ul className="space-y-2">
                          {features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="p-2 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                            >
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500 text-sm p-2">
                          Không có tính năng
                        </div>
                      )}
                    </motion.div>

                    {/* Details panel */}
                    <motion.div
                      initial={false}
                      animate={{
                        x: showDetails ? "0%" : "100%",
                        opacity: showDetails ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute top-0 left-0 w-full h-full overflow-y-auto pr-2"
                      style={{
                        pointerEvents: showDetails ? "auto" : "none",
                      }}
                    >
                      {details.length > 0 ? (
                        <div
                          data-lenis-prevent
                          className="lenis-local grid grid-cols-1 gap-2"
                        >
                          {details.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2 border rounded-md bg-gray-50/80 dark:bg-gray-800/80 text-sm"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm p-2">
                          Không có chi tiết
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Desktop toggle buttons */}
                <div className="flex-shrink-0 flex items-start justify-center">
                  <HoverButtonsServiceCard
                    onClickUp={handleToUp}
                    onClickDown={handleToDown}
                    valuePosition={showDetails}
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-auto grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => {
                  if (translation.slug) {
                    onFetchService(translation.slug);
                    navigate(`/services/detail/${translation.slug}`);
                  }
                }}
                className="text-center bg-blue-600 hover:bg-blue-700 text-white
                           font-semibold rounded-sm md:rounded-xl transition-colors duration-300 cursor-pointer p-2"
              >
                <span className="text-sm md:text-base font-semibold">
                  Xem chi tiết
                </span>
              </button>

              <Link
                to="/contact"
                className="text-center border-2 border-blue-600 text-blue-600
                           dark:border-yellow-300 dark:text-yellow-300
                           dark:hover:bg-amber-200 dark:hover:text-gray-700
                           hover:bg-blue-50 font-semibold rounded-sm md:rounded-xl
                           transition-colors duration-300 p-2"
              >
                <span className="text-sm md:text-base font-semibold">
                  Liên hệ ngay
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
