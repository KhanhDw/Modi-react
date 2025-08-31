import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";

// =================== COMPONENT: ABOUT PREVIEW ===================
function AboutPreview({ sections }) {
    return (
        <motion.div
            className="p-6 bg-white admin-dark:bg-gray-800 rounded-2xl shadow-lg space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-3xl font-bold text-indigo-600">Giới thiệu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center text-center p-4 bg-gray-50 admin-dark:bg-gray-900 rounded-xl shadow hover:shadow-xl transition"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                    >
                        {item.img && (
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-32 h-32 object-cover rounded-full mb-4 shadow-lg"
                            />
                        )}
                        <h3 className="text-xl font-semibold text-indigo-600">{item.title}</h3>
                        <p className="mt-2 text-gray-600 admin-dark:text-gray-300">{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// =================== COMPONENT: SECTION EDITOR ===================
function SectionEditor({ section, data, onChange }) {
    const handleChange = (index, field, value) => {
        const updated = [...data];
        updated[index][field] = value;
        onChange(updated);
    };

    const removeItem = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleImageUpload = (index, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            handleChange(index, "img", reader.result);
        };
        if (file) reader.readAsDataURL(file);
    };

    return (
        <div className="p-4 bg-gray-50 admin-dark:bg-gray-900 space-y-4">
            <h3 className="font-bold text-lg capitalize">{section}</h3>
            {data.map((item, index) => (
                <div key={index} className="p-3 bg-white admin-dark:bg-gray-800 rounded-xl shadow space-y-2">
                    <input
                        type="text"
                        placeholder="Tiêu đề..."
                        value={item.title}
                        onChange={(e) => handleChange(index, "title", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <textarea
                        placeholder="Mô tả..."
                        value={item.description}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e.target.files[0])}
                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                            onClick={() => removeItem(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <FaTrash />
                        </button>
                    </div>
                    {item.img && (
                        <img src={item.img} alt="Preview" className="w-full h-40 object-cover rounded-lg mt-2" />
                    )}
                </div>
            ))}
        </div>
    );
}

// =================== MAIN CONFIG ABOUT PAGE ===================
export default function AboutConfig() {
    const [config, setConfig] = useState({
        sections: [
            { title: "Tầm nhìn", description: "Mô tả tầm nhìn công ty...", img: "" },
            { title: "Sứ mệnh", description: "Mô tả sứ mệnh công ty...", img: "" },
            { title: "Giá trị cốt lõi", description: "Mô tả giá trị cốt lõi...", img: "" },
        ],
    });

    const handleChange = (section, updated) => {
        setConfig({ ...config, [section]: updated });
    };

    const handleSave = () => {
        console.log("Lưu config About:", config);
        alert("Đã lưu cấu hình About!");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 items-start">
            {/* Form chỉnh sửa */}
            <div className="flex flex-col max-h-[1000px] overflow-auto">
                <div className="mb-4">
                    <button
                        onClick={handleSave}
                        className="w-30 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
                    >
                        Lưu cấu hình
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    <SectionEditor
                        section="Giới thiệu"
                        data={config.sections}
                        onChange={(updated) => handleChange("sections", updated)}
                    />
                </div>
            </div>

            {/* Preview */}
            <div className="space-y-8">
                <AboutPreview sections={config.sections} />
            </div>
        </div>
    );
}
