import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

const categoriesList = [
  { key: "E-commerce", name: "Thương Mại Điện Tử" },
  { key: "Portfolio", name: "Danh Mục Cá Nhân" },
  { key: "Business", name: "Kinh Doanh/Doanh Nghiệp" },
  { key: "Blog", name: "Blog/Tin Tức" },
  { key: "Landing Page", name: "Trang Đích (Landing Page)" },
  { key: "Corporate", name: "Công Ty/Tập Đoàn" },
  { key: "Creative", name: "Sáng Tạo/Nghệ Thuật" },
];

function ModalDesignWeb() {
  const [categories, setCategories] = useState([]); // State cho danh mục động

  // Gọi API để lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/web-samples`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        try {
          const parsedData = (result.data || []).map((item) => ({
            ...item,
            tags:
              typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags,
            tech:
              typeof item.tech === "string" ? JSON.parse(item.tech) : item.tech,
            top_features:
              typeof item.top_features === "string"
                ? JSON.parse(item.top_features)
                : item.top_features,
            export_state: item.export_state ? 1 : 0,
          }));

          const activeData = parsedData.filter(
            (item) => item.export_state === 1
          );
          const uniqueCategories = [
            ...new Set(activeData.map((s) => s.category)),
          ]; // Không thêm "Tất cả"

          setCategories(
            uniqueCategories.map((category) => {
              let titleCategory = "";
              categoriesList.filter((u) => {
                u.key === category ? (titleCategory = u.name) : null;
              });
              return {
                title: titleCategory,
                slug: category, // Lấy thẳng category làm slug (sẽ encode sau)
              };
            })
          );
        } catch (e) {
          console.log("header fetchCategories:", e);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  if (!categories.length) {
    // Hiển thị skeleton loading trong khi chờ dữ liệu
    return (
      <div className="w-60 rounded-xl bg-gray-800/80 backdrop-blur-lg border border-gray-700/60 shadow-2xl p-2">
        <div className="space-y-2">
          {[...Array(1)].map((_, i) => (
            <div
              key={i}
              className="h-9 bg-gray-700/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="w-60 rounded-xl bg-gray-800/80 backdrop-blur-lg border border-gray-700/60 shadow-2xl overflow-hidden p-2"
    >
      <div className="space-y-1">
        {categories.map((item, index) => (
          <Link
            key={item.slug + index}
            to={`/Products?category=${encodeURIComponent(item.slug)}`}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default ModalDesignWeb;
