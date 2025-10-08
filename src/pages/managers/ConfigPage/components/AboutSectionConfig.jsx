import { forwardRef } from "react";
import { motion } from "framer-motion";
import { TextEditor } from "./common";

function AboutPreview({ about, lang }) {
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

const AboutSectionConfig = forwardRef(({ data, onChange, lang }, ref) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextEditor
        ref={ref}
        label="Giới thiệu"
        fields={[
          { name: "title", placeholder: "Tiêu đề..." },
          { name: "description", placeholder: "Mô tả..." },
          { name: "image_url", placeholder: "Link ảnh..." },
        ]}
        data={data}
        onChange={onChange}
        lang={lang}
        haveImage={true}
      />
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Xem trước</h3>
        <AboutPreview about={data} lang={lang} />
      </div>
    </div>
  );
});

export default AboutSectionConfig;