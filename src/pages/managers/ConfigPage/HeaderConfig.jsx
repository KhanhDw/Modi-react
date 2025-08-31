import React, { useState } from "react";
import { motion } from "framer-motion";

// --- Custom File Input ---
function FileInput({ label, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 admin-dark:text-gray-300">{label}</label>
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                    className="w-full p-3 rounded-xl bg-gray-50 admin-dark:bg-gray-800 border border-gray-300 admin-dark:border-gray-600 shadow-sm
                     cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 admin-dark:text-gray-400 font-semibold">
                    📁
                </span>
            </div>
        </div>
    );
}

export default function HeaderConfigLogo() {
    const [logo, setLogo] = useState("/logoModi.png");

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setLogo(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-12">

            {/* ===== Header Preview Card ===== */}
            <motion.div
                className="bg-indigo-50 admin-dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <motion.img
                    src={logo}
                    alt="Logo"
                    className="h-30 w-80 shadow-lg rounded-xl object-cover cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 1 }}
                />
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                >
                    <h1 className="text-4xl font-extrabold text-indigo-600 admin-dark:text-indigo-400">
                        Modi
                    </h1>
                    <p className="text-gray-600 admin-dark:text-gray-300 mt-1">
                        Modern Header Preview with Live Logo
                    </p>
                </motion.div>
            </motion.div>

            {/* ===== Config Form Card ===== */}
            <motion.div
                className="bg-white admin-dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-200 admin-dark:border-gray-700 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <FileInput label="Upload New Logo" onChange={handleLogoChange} />

                <motion.button
                    onClick={() => alert("Save to API")}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg
                     transition-all flex justify-center items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Save Logo
                </motion.button>
            </motion.div>
        </div>
    );
}
