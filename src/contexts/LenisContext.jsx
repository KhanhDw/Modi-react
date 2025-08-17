import { createContext, useContext, useState, useEffect } from "react";
import useLenisWithToggle from "@/hook/useLenisWithToggle";

// Tạo context
const LenisContext = createContext(null);

// Provider
export default function LenisProvider({ children } = {}) {
  const lenis = useLenisWithToggle();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (lenis && typeof lenis.enable === "function" && typeof lenis.disable === "function") {
      enabled ? lenis.enable() : lenis.disable();
    }
  }, [enabled, lenis]);

  return (
    <LenisContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </LenisContext.Provider>
  );
}

// Hook custom để lấy context
export function useLenisToggle() {
  return useContext(LenisContext);
}