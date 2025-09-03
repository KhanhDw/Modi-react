import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Input Component
function InputField({ label, value, onChange, type = "text", ...props }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label className="block font-semibold mb-2">{label}</label>
            <input
                type={type}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={value}
                onChange={onChange}
                {...props}
            />
        </motion.div>
    );
}

// Textarea Component
function TextareaField({ label, value, onChange, rows = 4, ...props }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label className="block font-semibold mb-2">{label}</label>
            <textarea
                rows={rows}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={value}
                onChange={onChange}
                {...props}
            />
        </motion.div>
    );
}

export default function HomeConfigMultiLang() {
    const [activeLang, setActiveLang] = useState("vi");
    const [homeData, setHomeData] = useState(
        {
            vi: { banners: [], cards: [], services: [] },
            en: { banners: [], cards: [], services: [] }
        }
    );
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL || "http://localhost:5000";

    // Load dữ liệu
    const fetchData = async (lang = activeLang) => {
        try {
            setLoading(true);

            const [bannersRes, cardsRes, servicesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/home-config/${lang}/banners`),
                fetch(`${API_BASE_URL}/api/home-config/${lang}/cards`),
                fetch(`${API_BASE_URL}/api/home-config/${lang}/services`),
            ]);

            if (!bannersRes.ok || !cardsRes.ok || !servicesRes.ok) throw new Error("Không thể tải dữ liệu HomeConfig.");

            const [banners, cards, services] = await Promise.all([bannersRes.json(), cardsRes.json(), servicesRes.json()]);

            setHomeData((prev) => ({
                ...prev,
                [lang]: { banners, cards, services },
            }));
        } catch (err) {
            console.error("Lỗi load HomeConfig:", err);
            alert("❌ Lỗi tải dữ liệu: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeLang);
    }, [activeLang]);

    // Cập nhật state khi sửa field
    const handleChangeField = (type, id, field, value) => {
        setHomeData((prev) => ({
            ...prev,
            [activeLang]: {
                ...prev[activeLang],
                [type]: prev[activeLang][type].map((item) =>
                    item.id === id ? { ...item, [field]: value } : item
                ),
            },
        }));
    };

    // Chọn file ảnh
    const handleImageChange = (type, id, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setHomeData((prev) => ({
            ...prev,
            [activeLang]: {
                ...prev[activeLang],
                [type]: prev[activeLang][type].map((item) =>
                    item.id === id ? { ...item, file, imgPreview: URL.createObjectURL(file) } : item
                ),
            },
        }));
    };

    // Save (PUT API)
    const handleSave = async (type, id) => {
        try {
            setLoading(true);
            const item = homeData[activeLang][type].find((i) => i.id === id);

            const formData = new FormData();
            formData.append("title", item.title || "");
            formData.append("description", item.description || "");
            if (item.file) {
                formData.append("image", item.file);
            } else {
                formData.append("img", item.img || "");
            }

            const res = await fetch(`${API_BASE_URL}/api/home-config/${type.slice(0, -1)}/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Lỗi khi lưu dữ liệu.");
            }

            alert("💾 Lưu thành công!");
            fetchData(activeLang);
        } catch (err) {
            console.error("Lỗi khi lưu:", err);
            alert("❌ Lưu thất bại: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center">⏳ Đang tải...</p>;

    const currentData = homeData[activeLang] || { banners: [], cards: [], services: [] };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-12">
            {/* Language Tabs */}
            <div className="flex gap-4 mb-6">
                {["vi", "en"].map((lang) => (
                    <motion.button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${activeLang === lang
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {lang === "vi" ? "Tiếng Việt" : "English"}
                    </motion.button>
                ))}
            </div>

            {/* --- Banners --- */}
            <section>
                <h2 className="text-xl font-bold mb-4">🏞 Banners</h2>
                {currentData.banners.map((banner) => (
                    <div key={banner.id} className="p-4 border rounded-lg mb-6 shadow-sm bg-white space-y-4">
                        <InputField label="Tiêu đề" value={banner.title || ""} onChange={(e) => handleChangeField("banners", banner.id, "title", e.target.value)} />
                        <TextareaField label="Mô tả" value={banner.description || ""} onChange={(e) => handleChangeField("banners", banner.id, "description", e.target.value)} />
                        <div>
                            <label className="block font-semibold mb-2">Hình ảnh</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange("banners", banner.id, e)} />
                            <img src={banner.imgPreview || (banner.img ? `${API_BASE_URL}${banner.img}` : "/no-image.png")} alt="Preview" className="mt-2 h-40 rounded-lg object-cover" />
                        </div>
                        <button onClick={() => handleSave("banners", banner.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700">
                            Lưu Banner
                        </button>
                    </div>
                ))}
            </section>

            {/* --- Cards --- */}
            <section>
                <h2 className="text-xl font-bold mb-4">📇 Cards</h2>
                {currentData.cards.map((card) => (
                    <div key={card.id} className="p-4 border rounded-lg mb-6 shadow-sm bg-white space-y-4">
                        <InputField label="Tiêu đề" value={card.title || ""} onChange={(e) => handleChangeField("cards", card.id, "title", e.target.value)} />
                        <TextareaField label="Mô tả" value={card.description || ""} onChange={(e) => handleChangeField("cards", card.id, "description", e.target.value)} />
                        <div>
                            <label className="block font-semibold mb-2">Hình ảnh</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange("cards", card.id, e)} />
                            <img src={card.imgPreview || (card.img ? `${API_BASE_URL}${card.img}` : "/no-image.png")} alt="Preview" className="mt-2 h-40 rounded-lg object-cover" />
                        </div>
                        <button onClick={() => handleSave("cards", card.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700">
                            Lưu Card
                        </button>
                    </div>
                ))}
            </section>

            {/* --- Services --- */}
            <section>
                <h2 className="text-xl font-bold mb-4">🛠 Services</h2>
                {currentData.services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg mb-6 shadow-sm bg-white space-y-4">
                        <InputField label="Tiêu đề" value={service.title || ""} onChange={(e) => handleChangeField("services", service.id, "title", e.target.value)} />
                        <TextareaField label="Mô tả" value={service.description || ""} onChange={(e) => handleChangeField("services", service.id, "description", e.target.value)} />
                        <div>
                            <label className="block font-semibold mb-2">Hình ảnh</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange("services", service.id, e)} />
                            <img src={service.imgPreview || (service.img ? `${API_BASE_URL}${service.img}` : "/no-image.png")} alt="Preview" className="mt-2 h-40 rounded-lg object-cover" />
                        </div>
                        <button onClick={() => handleSave("services", service.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700">
                            Lưu Service
                        </button>
                    </div>
                ))}
            </section>
        </div>
    );
}
