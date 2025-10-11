import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLenisToggle } from "@/contexts/LenisContext";
import debounce from "lodash.debounce";

export default function ScrollHandler() {
  const location = useLocation();
  const prevRef = useRef(location);
  const { lenis } = useLenisToggle() || {};

  const scrollToTop = debounce(() => {
    if (lenis?.instance) {
      lenis.instance.scrollTo(0, { immediate: true });
      lenis.instance.resize();
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, 100);

  useEffect(() => {
    const prev = prevRef.current;
    const prevFull = `${prev.pathname}${prev.search}${prev.hash}`;
    const currFull = `${location.pathname}${location.search}${location.hash}`;
    if (prevFull === currFull) return;

    if (
      prev.pathname !== location.pathname ||
      prev.search !== location.search
    ) {
      scrollToTop();
    }

    prevRef.current = location;
  }, [location]);

  return null;
}
