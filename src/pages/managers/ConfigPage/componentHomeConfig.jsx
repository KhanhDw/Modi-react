import { motion } from "framer-motion";
import { useEffect, useState, } from "react";

// =============== INPUT FIELD ===============
export function InputField({ label, value, onChange, type = "text", accept = "image/*" }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label className="block font-semibold mb-2 text-sm md:text-base">{label}</label>
            <input
                type={type}
                {...(type === "file" ? { accept } : { value })}
                className="w-full p-3 border border-gray-200 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-indigo-400 transition focus:border-none admin-dark:border-gray-600"
                value={type === "file" ? undefined : value} // file input không nên có value
                onChange={onChange}
            />
        </motion.div>
    );
}

export function TextareaField({ label, value, onChange, rows = 6 }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label className="block font-semibold mb-2 text-sm md:text-base">{label}</label>
            <textarea
                rows={rows}
                className="w-full p-3 border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-indigo-400 transition focus:border-none admin-dark:border-gray-600"
                value={value}
                onChange={onChange}
            />
        </motion.div>
    );
}

// =============== SAFE IMAGE ===============
export function SafeImage({
    src,
    alt,
    className = "",
    fallback = "/error.png",
}) {
    const [isError, setIsError] = useState(false);

    // reset lại khi src thay đổi
    useEffect(() => {
        setIsError(false);
    }, [src]);

    return (
        <div className={`${className} overflow-hidden`}>
            {isError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 admin-dark:bg-gray-400 rounded-xl">
                    <img
                        src={fallback}
                        alt="fallback"
                        className="w-20 h-20 object-contain"
                    />
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover rounded-xl"
                    onError={() => setIsError(true)}
                />
            )}
        </div>
    );
}
