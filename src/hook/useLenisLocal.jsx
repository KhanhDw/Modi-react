// contexts/LenisContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import useLenisWithToggle from "@/hook/useLenisWithToggle";

const LenisContext = createContext(null);

export default function LenisProvider({ children } = {}) {
  const lenis = useLenisWithToggle();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (
      lenis &&
      typeof lenis.enable === "function" &&
      typeof lenis.disable === "function"
    ) {
      enabled ? lenis.enable() : lenis.disable();
    }
  }, [enabled, lenis]);

  return (
    <LenisContext.Provider
      value={{
        instance: lenis?.instance || null,
        enable: lenis?.enable,
        disable: lenis?.disable,
        enabled,
        setEnabled,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisToggle() {
  return useContext(LenisContext);
}
