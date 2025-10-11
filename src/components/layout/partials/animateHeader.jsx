import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import Header from "./header/header";
import { useTheme } from "@/contexts/ThemeContext";

function AnimationHeader({ ActiveSideBarHeader }) {
  const { isDark } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const motionBg = useMotionValue("rgba(0,0,0,0)");

  // Nền trang chủ (scroll)
  const backgroundColorHome = useTransform(
    scrollY,
    [0, 50],
    isDark
      ? ["rgba(0,0,0,0)", "rgba(25, 27, 31, 0.95)"]
      : ["rgba(255,255,255,0)", "rgba(255,255,255,0.95)"]
  );

  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    isDark
      ? ["0 0 0 rgba(0,0,0,0)", "0 2px 12px rgba(255,255,255,0.2)"]
      : ["0 0 0 rgba(0,0,0,0)", "0 2px 12px rgba(0,0,0,0.1)"]
  );

  // Theo dõi cuộn
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cập nhật màu nền theo theme và trang
  useEffect(() => {
    if (location.pathname === "/") {
      // Trang chủ — hiệu ứng scroll mượt
      motionBg.set(backgroundColorHome.get());
      const unsub = backgroundColorHome.on("change", motionBg.set);
      return () => unsub();
    } else {
      // Trang khác
      const updateBg = () => {
        if (window.scrollY === 0) {
          // Nền khi chưa scroll
          motionBg.set(isDark ? "#0F0F0F" : "#222831"); // Đỏ trong light, xám đậm trong dark
        } else {
          // Khi scroll xuống
          motionBg.set(
            isDark ? "rgba(25,27,31,0.95)" : "rgba(255,255,255,0.95)"
          );
        }
      };
      updateBg();
      window.addEventListener("scroll", updateBg);
      return () => window.removeEventListener("scroll", updateBg);
    }
  }, [location.pathname, isDark, backgroundColorHome, motionBg]);

  const headerHeight = useMemo(() => {
    if (location.pathname === "/") {
      return scrolled ? 80 : 100;
    }
    return 80;
  }, [location.pathname, scrolled]);

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ${
        isDark ? "text-white" : "text-black"
      }`}
      style={{
        backgroundColor: motionBg,
        boxShadow,
        height: headerHeight,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Header
          setActiveScoll_open_HeaderSideBar={ActiveSideBarHeader}
          scrolled={scrolled}
          isDark={isDark}
        />
      </div>
    </motion.div>
  );
}

export default AnimationHeader;
