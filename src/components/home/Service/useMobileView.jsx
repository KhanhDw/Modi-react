import { useState, useEffect } from "react";

export const useMobileView = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobileView;
};
