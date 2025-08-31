import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";

// =================== COMPONENT: BANNER SLIDER ===================
function BannerSlider({ banners }) {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    if (banners.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] bg-gray-200 admin-dark:bg-gray-700 rounded-2xl">
                <span className="text-gray-500 admin-dark:text-gray-300">Chưa có banner</span>
            </div>
        );
    }

    return (
        <motion.div
            className="relative w-full h-[300px] overflow-hidden rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <img
                src={banners[current].img}
                alt={banners[current].title}
                className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-6 text-white bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                <motion.h2
                    className="text-3xl font-bold drop-shadow-lg"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {banners[current].title}
                </motion.h2>
                <motion.p
                    className="mt-2 text-lg"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {banners[current].description}
                </motion.p>
            </div>

            {/* Nút điều hướng */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70"
            >
                ‹
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70"
            >
                ›
            </button>
        </motion.div>
    );
}

// =================== COMPONENT: CARD LIST ===================
function CardList({ cards }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    className="p-3 bg-white admin-dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                >
                    <img
                        src={card.img}
                        alt={card.title}
                        className="w-full h-32 object-contain rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-indigo-600">{card.title}</h3>
                    <p className="mt-2 text-gray-600 admin-dark:text-gray-300">{card.description}</p>
                </motion.div>
            ))}
        </div>
    );
}

// =================== COMPONENT: SERVICE LIST ===================
function ServiceList({ services }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {services.map((service, index) => (
                <motion.div
                    key={index}
                    className="p-6 bg-white admin-dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <img
                        src={service.img}
                        alt={service.title}
                        className="w-full h-28 object-contain rounded-lg mb-4"
                    />
                    <h4 className="text-lg font-semibold text-indigo-600">{service.title}</h4>
                    <p className="mt-1 text-gray-600 admin-dark:text-gray-300">{service.description}</p>
                </motion.div>
            ))}
        </div>
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
                        <img src={item.img} alt="Preview" className="w-full h-54 object-contain rounded-lg mt-2" />
                    )}
                </div>
            ))}
        </div>
    );
}

// =================== MAIN CONFIG HOME PAGE ===================
export default function ConfigHomePage() {
    const [config, setConfig] = useState({
        banners: [
            { title: "Banner 1", description: "Mô tả banner 1", img: "/logoModi.png" },
            { title: "Banner 2", description: "Mô tả banner 2", img: "/logoModi.png" },
        ],
        cards: [
            { title: "Card 1", description: "Mô tả card 1", img: "/logoModi.png" },
            { title: "Card 2", description: "Mô tả card 2", img: "/logoModi.png" },
            { title: "Card 3", description: "Mô tả card 3", img: "/logoModi.png" },
        ],
        services: [
            { title: "Dịch vụ A", description: "Mô tả dịch vụ A", img: "/logoModi.png" },
            { title: "Dịch vụ B", description: "Mô tả dịch vụ B", img: "/logoModi.png" },
            { title: "Dịch vụ C", description: "Mô tả dịch vụ C", img: "/logoModi.png" },
            { title: "Dịch vụ C", description: "Mô tả dịch vụ C", img: "/logoModi.png" },
            { title: "Dịch vụ C", description: "Mô tả dịch vụ C", img: "/logoModi.png" },
        ],
    });

    const handleChange = (section, updated) => {
        setConfig({ ...config, [section]: updated });
    };

    const handleSave = () => {
        console.log("Lưu config:", config);
        alert("Đã lưu cấu hình!");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 items-start">
            {/* Form chỉnh sửa (cao bằng bên phải, có cuộn khi dài hơn) */}
            <div className="flex flex-col max-h-[1100px] overflow-auto">
                {/* Nút lưu nằm trên đầu */}
                <div className="mb-4">
                    <button
                        onClick={handleSave}
                        className="w-30 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
                    >
                        Lưu cấu hình
                    </button>
                </div>
                {/* Nội dung có scroll riêng */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    <SectionEditor
                        section="banners"
                        data={config.banners}
                        onChange={(updated) => handleChange("banners", updated)}
                    />
                    <SectionEditor
                        section="cards"
                        data={config.cards}
                        onChange={(updated) => handleChange("cards", updated)}
                    />
                    <SectionEditor
                        section="services"
                        data={config.services}
                        onChange={(updated) => handleChange("services", updated)}
                    />
                </div>
            </div>

            {/* Preview (làm chuẩn chiều cao) */}
            <div className="space-y-8">
                <BannerSlider banners={config.banners} />
                <CardList cards={config.cards} />
                <ServiceList services={config.services} />
            </div>
        </div>

    );
}
