import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function BaseModi({ data, activeLang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.8 });

  if (!data) return null;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center sm:my-2 md:my-6 pb-10"
    >
      <div className="w-3/4">
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`mb-4 text-3xl sm:text-4xl xs:text-xl md:text-5xl 3xl:text-6xl font-bold text-center dark:text-white text-black `}
        >
          {data.title?.[activeLang]}
        </motion.p>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-gray-600 sm:text-xl md:text-2xl 3xl:text-xl dark:text-gray-300"
        >
          {data.description?.[activeLang]}
        </motion.p>
      </div>
    </div>
  );
}

export default BaseModi;
