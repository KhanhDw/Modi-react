// hooks/useLenisLocal.js
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function useLenisLocal(selector = ".lenis-local") {
  const localLenis = useRef([]);

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const instances = [];

    elements.forEach((el) => {
      // Khởi tạo Lenis cục bộ
      const lenisInstance = new Lenis({
        wrapper: el,
        content: el.children[0],
        duration: 0.6,
        smooth: true,
        smoothTouch: true,
        gestureOrientation: "vertical",
        lerp: 0.1,
        touchMultiplier: 2,
      });

      instances.push(lenisInstance);

      const animate = (time) => {
        lenisInstance.raf(time);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);

      // Tạm dừng/khôi phục Lenis toàn cục
      const pauseGlobal = () => {
        window.__lenis?.stop();
      };
      const resumeGlobal = () => {
        window.__lenis?.start();
        window.__lenis?.resize(); // Cập nhật kích thước Lenis toàn cục
      };

      // Sự kiện desktop
      el.addEventListener("mouseenter", pauseGlobal, { passive: true });
      el.addEventListener("mouseleave", resumeGlobal, { passive: true });

      // Sự kiện touch
      el.addEventListener("touchstart", pauseGlobal, { passive: true });
      el.addEventListener("touchend", resumeGlobal, { passive: true });

      // Ngăn Lenis toàn cục can thiệp
      el.setAttribute("data-lenis-prevent", "true");

      // Cleanup cho từng element
      return () => {
        el.removeEventListener("mouseenter", pauseGlobal);
        el.removeEventListener("mouseleave", resumeGlobal);
        el.removeEventListener("touchstart", pauseGlobal);
        el.removeEventListener("touchend", resumeGlobal);
        lenisInstance.destroy();
        el.removeAttribute("data-lenis-prevent");
      };
    });

    localLenis.current = instances;

    // Cleanup tất cả instances
    return () => {
      instances.forEach((instance) => instance.destroy());
      localLenis.current = [];
    };
  }, [selector]);
}