import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

export default function useFetchLogo(slug = "header") {
  const [logo, setLogo] = useState("/logoModi.png");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/section-items/type/logo?slug=${slug}`);
        if (!res.ok) throw new Error("Không thể tải logo");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          setLogo(item.image_url ? `${API_BASE_URL}${item.image_url}` : "/logoModi.png");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogo();
  }, [slug]);

  return logo;
}
