import { motion } from "framer-motion";

export default function VisionMissionPreview({ visionMission, lang }) {
  return (
    <motion.div
      className="p-1 sm:p-2 h-full bg-white admin-dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-lg space-y-4 sm:space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-base sm:text-xl font-bold text-indigo-600 text-center admin-dark:text-white">
        {lang === "vi" ? "Tầm nhìn & Sứ mệnh" : "Vision & Mission"}
      </h2>
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {(visionMission || []).map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center p-1 sm:p-2 bg-gray-50 admin-dark:bg-gray-900 rounded-lg sm:rounded-xl shadow hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            {item.img && (
              <img
                src={item.img}
                alt={item.title?.[lang]}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full mb-3 sm:mb-4 shadow-lg"
              />
            )}
            <h3 className="text-sm sm:text-base font-semibold text-indigo-600 admin-dark:text-white">
              {item.title?.[lang]}
            </h3>
            <p className="mt-1 sm:mt-2 text-gray-600 admin-dark:text-gray-300 text-sm sm:text-base">
              {item.description?.[lang]}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
