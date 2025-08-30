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

export default function FooterConfigMultiLang() {
    const [activeLang, setActiveLang] = useState("vi");
    const [footerData, setFooterData] = useState({ vi: {}, en: {} });
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL || "http://localhost:5000";

    // 🔹 Load dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = `${API_BASE_URL}/api/footer/${activeLang}`;
                console.log("Fetching data from:", url);  // Debugging log
                const res = await fetch(url);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Không thể tải dữ liệu footer.");
                }
                const data = await res.json();
                console.log("Fetched footer data:", data);  // Debugging
                setFooterData((prev) => ({
                    ...prev,
                    [activeLang]: {
                        logo: data.logo || "/logoModi.png",
                        name_company: data.name_company,
                        content_about_us: data.content_about_us,
                        address_company: data.address_company,
                        phone: data.phone,
                        email: data.email,
                    },
                }));
            } catch (err) {
                console.error("Lỗi load footer config:", err);
                alert("Lỗi tải dữ liệu footer: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeLang]);

    // 🔹 Update field khi edit
    const handleChangeField = (field, value) => {
        setFooterData((prev) => ({
            ...prev,
            [activeLang]: { ...prev[activeLang], [field]: value },
        }));
    };

    // 🔹 Upload logo (local preview)
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);  // Thêm file vào formData
            setFooterData((prev) => ({
                ...prev,
                [activeLang]: { ...prev[activeLang], logo: file },  // Lưu đối tượng file thay vì base64
            }));
        }
    };


    // 🔹 Save API
    const handleSave = async () => {
        try {
            setLoading(true);
            const payload = footerData[activeLang];

            const res = await fetch(`${API_BASE_URL}/api/footer/${activeLang}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("API Error:", errorData);  // Xem lỗi API nếu có
                throw new Error(errorData.message || "Lỗi khi lưu dữ liệu.");
            }

            alert("Lưu thành công!");
        } catch (err) {
            console.error("Lỗi khi lưu:", err);
            alert("Lưu thất bại! " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center">⏳ Đang tải...</p>;

    const currentData = footerData[activeLang] || {};

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-12">
            {/* --- Live Preview --- */}
            <motion.footer
                className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col md:flex-row md:justify-between items-center gap-6">
                    <motion.img
                        src={currentData.logo || "/logoModi.png"}
                        alt="Logo"
                        className="h-20 w-auto rounded-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    />
                    <motion.div
                        className="text-center md:text-left space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <h3 className="text-xl font-bold">{currentData.name_company}</h3>
                        <p className="text-gray-300">{currentData.address_company}</p>
                        <p className="text-gray-300">{currentData.phone}</p>
                        <p className="text-gray-300">{currentData.email}</p>
                        <p className="mt-2 text-gray-400">{currentData.content_about_us}</p>
                    </motion.div>
                </div>
            </motion.footer>

            {/* --- Config Form --- */}
            <div className="space-y-6">
                {/* Language Tabs */}
                <div className="flex gap-4 mb-6">
                    {["vi", "en"].map((lang) => (
                        <motion.button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${activeLang === lang
                                ? "bg-indigo-600 text-white shadow-md cursor-pointer"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                                }`}
                        >
                            {lang === "vi" ? "Tiếng Việt" : "English"}
                        </motion.button>
                    ))}
                </div>

                {/* Logo Upload */}
                <div>
                    <label className="block font-semibold mb-2">Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
                    />
                </div>

                {/* Form Fields */}
                <InputField
                    label="Tên Công Ty / Company Name"
                    value={currentData.name_company || ""}
                    onChange={(e) => handleChangeField("name_company", e.target.value)}
                />

                <TextareaField
                    label="Về Chúng Tôi / About Us"
                    value={currentData.content_about_us || ""}
                    onChange={(e) => handleChangeField("content_about_us", e.target.value)}
                />

                <InputField
                    label="Địa Chỉ / Address_company"
                    value={currentData.address_company || ""}
                    onChange={(e) => handleChangeField("address_company", e.target.value)}
                />

                <InputField
                    label="Số Điện Thoại / Phone"
                    value={currentData.phone || ""}
                    onChange={(e) => handleChangeField("phone", e.target.value)}
                />

                <InputField
                    label="Email"
                    value={currentData.email || ""}
                    onChange={(e) => handleChangeField("email", e.target.value)}
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 
                     shadow-md transition block mx-auto font-semibold cursor-pointer"
                >
                    {loading ? "Đang lưu..." : "Save"}
                </motion.button>
            </div>
        </div>
    );
}
