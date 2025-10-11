import { motion } from "framer-motion";
import { TextEditor } from "./common";

function BannerPreview({ banner, lang }) {
  return (
    <motion.div
      className="relative p-1 sm:p-2 flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-base sm:text-xl font-bold drop-shadow-lg text-center">
        {banner?.title?.[lang] || "Chưa có tiêu đề"}
      </h1>
      <p className="text-sm sm:text-base italic opacity-90 text-center">
        {banner?.slogan?.[lang] || "Chưa có slogan"}
      </p>
    </motion.div>
  );
}

export default function BannerConfig({ data, onChange, lang }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <TextEditor
        label="Banner"
        fields={[
          { name: "title", placeholder: "Tiêu đề banner..." },
          { name: "slogan", placeholder: "Slogan..." },
        ]}
        data={data}
        onChange={onChange}
        lang={lang}
      />
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Xem trước</h3>
        <BannerPreview
          banner={data}
          lang={lang}
        />
      </div>
    </div>
  );
}
