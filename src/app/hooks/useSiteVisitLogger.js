// app/hooks/useSiteVisitLogger.js
import { useEffect } from "react";

export default function useSiteVisitLogger() {
  useEffect(() => {
    const key = "site_visit";
    const now = Date.now();
    const expireTime = 30 * 60 * 1000; // 30 phút
    const lastVisit = localStorage.getItem(key);

    if (!lastVisit || now - lastVisit > expireTime) {
      fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/site/visit`, {
        method: "POST",
      }).catch(() => {});

      localStorage.setItem(key, now);
    }
  }, []);
}
