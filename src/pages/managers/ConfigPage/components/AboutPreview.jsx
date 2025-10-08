import { motion } from "framer-motion";

export default function AboutPreview({ about, lang }) {
  return (
    <motion.div
      className="p-1 sm:p-2 bg-white h-full admin-dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-lg space-y-3 sm:space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-center text-base sm:text-xl font-bold text-indigo-600 admin-dark:text-white">
        {about?.title?.[lang] || "Chưa có tiêu đề"}
      </h2>
      <p className="text-gray-600 admin-dark:text-gray-300 text-sm sm:text-base">
        {about?.description?.[lang] || "Chưa có mô tả"}
      </p>
    </motion.div>
  );
}
