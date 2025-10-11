// AnimationHeader.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import Header from "./header/header";
import { useTheme } from "@/contexts/ThemeContext";

function AnimationHeader({ ActiveSideBarHeader }) {
  const { isDark } = useTheme();
  const location = useLocation();
  const { scrollY } = useScroll();

  // Smooth transform values for background and height
  const backgroundColorRoot = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0)", "rgba(17, 24, 39, 0.95)"]
  );
  const backgroundColorOtherRoot = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,1)", "rgba(17, 24, 39, 0.95)"]
  );

  const backdropFilter = useTransform(
    scrollY,
    [0, 80],
    ["blur(0px)", "blur(12px)"]
  );

  const headerHeight = useTransform(
    scrollY,
    [0, 80],
    [location.pathname === "/" ? 100 : 80, 80]
  );

  const boxShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 0 0 rgba(0,0,0,0)", "0 4px 20px rgba(0,0,0,0.1)"]
  );

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        backgroundColor:
          location.pathname === "/"
            ? backgroundColorRoot
            : backgroundColorOtherRoot,
        backdropFilter,
        height: headerHeight,
        boxShadow,
      }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Header
          setActiveScoll_open_HeaderSideBar={ActiveSideBarHeader}
          scrolled={false} // We handle scroll state in transform now
        />
      </div>
    </motion.div>
  );
}

export default AnimationHeader;
