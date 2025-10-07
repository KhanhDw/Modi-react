import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "./header/header";

function AnimationHeader({ ActiveSideBarHeader }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Sử dụng Framer Motion's scroll hook cho animation mượt mà hơn
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(0,0,0,0)", "rgba(25, 27, 31, 0.95)"]
  );

  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ["0 0 0 rgba(0, 0, 0, 0)", "0 2px 12px rgba(255, 255, 255, 0.2)"]
  );

  // Debounce scroll và resize events
  useEffect(() => {
    let ticking = false;

    const updateScrolled = () => {
      setScrolled(window.scrollY > 50);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrolled);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Debounce resize
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Memoize header height calculation
  const headerHeight = useMemo(() => {
    if (location.pathname === "/") {
      return scrolled ? 80 : 100;
    }
    return 80;
  }, [location.pathname, scrolled]);

  // Memoize background color logic
  const getInitialBackground = useCallback(() => {
    return location.pathname === "/" ? "rgba(0,0,0,0)" : "rgba(0,0,0,1)";
  }, [location.pathname]);

  return (
    <motion.div
      key={`${location.pathname}-${scrolled}`}
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        backgroundColor,
        boxShadow,
        height: headerHeight,
      }}
      initial={{
        backgroundColor: getInitialBackground(),
        height: headerHeight,
      }}
      animate={{
        height: headerHeight,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing curve
      }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Header
          setActiveScoll_open_HeaderSideBar={ActiveSideBarHeader}
          scrolled={scrolled}
        />
      </div>
    </motion.div>
  );
}

export default AnimationHeader;
