import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

export default function useFetchCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/web-samples`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();

        const parsedData = (result.data || []).map((item) => ({
          ...item,
          tags: typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags,
          tech: typeof item.tech === "string" ? JSON.parse(item.tech) : item.tech,
          top_features: typeof item.top_features === "string" ? JSON.parse(item.top_features) : item.top_features,
          export_state: item.export_state ? 1 : 0,
        }));

        const activeData = parsedData.filter((item) => item.export_state === 1);
        const uniqueCategories = [...new Set(activeData.map((s) => s.category))];

        setCategories(uniqueCategories.map((category) => ({
          title: category,
          slug: category,
        })));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return categories;
}
