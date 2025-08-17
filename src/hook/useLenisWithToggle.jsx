import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function useLenisWithToggle() {
  const lenis = useRef(null);
  const isActive = useRef(true); // công tắc bật/tắt Lenis

  useEffect(() => {
    // Khởi tạo Lenis
    lenis.current = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smooth: true,
      smoothTouch: true,
      gestureOrientation: "vertical",
      touchMultiplier: 2,
    });

    const animate = (time) => {
      if (isActive.current) {
        lenis.current.raf(time);
      }
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Gán global để dễ gọi
    window.__lenis = {
      instance: lenis.current,
      enable: () => {
        isActive.current = true;
        document.body.style.overflow = "hidden"; // ẩn scrollbar
      },
      disable: () => {
        isActive.current = false;
        document.body.style.overflow = ""; // hiện scrollbar lại
      },
    };

    // Bật mặc định
    window.__lenis.enable();

    return () => {
      lenis.current.destroy();
      window.__lenis = null;
    };
  }, []);

  return window.__lenis;
}
