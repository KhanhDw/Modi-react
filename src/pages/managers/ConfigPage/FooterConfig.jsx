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

    const [file, setFile] = useState(null);       // file ảnh
    const [preview, setPreview] = useState("");   // ảnh preview

    const API_BASE_URL =
        import.meta.env.VITE_MAIN_BE_URL || "http://localhost:5000";

    // 🔹 Load dữ liệu từ API
    const fetchData = async (lang = activeLang) => {
        try {
            setLoading(true);
            const url = `${API_BASE_URL}/api/footer/${lang}`;
            const res = await fetch(url);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Không thể tải dữ liệu footer.");
            }
            const data = await res.json();

            setFooterData((prev) => ({
                ...prev,
                [lang]: {
                    logo: data.logo || "/logoModi.png",
                    name_company: data.name_company || "",
                    content_about_us: data.content_about_us || "",
                    address_company: data.address_company || "",
                    phone: data.phone || "",
                    email: data.email || "",
                },
            }));

            setPreview(data.logo ? `${API_BASE_URL}${data.logo}` : "");
            setFile(null);
        } catch (err) {
            console.error("Lỗi load footer config:", err);
            alert("Lỗi tải dữ liệu footer: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load khi đổi ngôn ngữ
    useEffect(() => {
        fetchData(activeLang);
    }, [activeLang]);

    // 🔹 Update field khi edit
    const handleChangeField = (field, value) => {
        setFooterData((prev) => ({
            ...prev,
            [activeLang]: { ...prev[activeLang], [field]: value },
        }));
    };

    // 🔹 Chọn logo
    const handleLogoChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(
                footerData[activeLang].logo
                    ? `${API_BASE_URL}${footerData[activeLang].logo}`
                    : ""
            );
        }
    };

    // 🔹 Save
    const handleSave = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            // nếu có file ảnh
            if (file) {
                formData.append("image", file);
            }
            // append các field khác
            formData.append("name_company", footerData[activeLang].name_company || "");
            formData.append("content_about_us", footerData[activeLang].content_about_us || "");
            formData.append("address_company", footerData[activeLang].address_company || "");
            formData.append("phone", footerData[activeLang].phone || "");
            formData.append("email", footerData[activeLang].email || "");

            const res = await fetch(`${API_BASE_URL}/api/footer/${activeLang}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Lỗi khi lưu dữ liệu.");
            }

            alert("💾 Lưu thành công!");
            setFile(null);
            fetchData(activeLang); // reload lại từ server
        } catch (err) {
            console.error("Lỗi khi lưu:", err);
            alert("❌ Lưu thất bại! " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const defaultLogo = "/logoModi.png";


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
                    {preview ? (
                        <motion.img
                            src={preview}
                            alt="Logo"
                            className="h-40 w-40 rounded-lg object-fill"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onError={(e) => (e.currentTarget.src = defaultLogo)}
                        />
                    ) : (
                        <motion.img
                            src={defaultLogo}
                            alt="Default Logo"
                            className="h-40 w-40 rounded-lg object-fill"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        />
                    )}



                    <motion.div
                        className="text-center md:text-left space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <h3 className="text-xl font-bold">{currentData.name_company}</h3>
                        <p className="text-gray-300">{currentData.address_company}</p>
                        <p className="text-gray-300">{currentData.phone}</p>
                        <p className="text-gray-300">{currentData.email}</p>
                        <p className="mt-2 text-gray-400">
                            {currentData.content_about_us}
                        </p>
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
                    onChange={(e) =>
                        handleChangeField("name_company", e.target.value)
                    }
                />

                <TextareaField
                    label="Về Chúng Tôi / About Us"
                    value={currentData.content_about_us || ""}
                    onChange={(e) =>
                        handleChangeField("content_about_us", e.target.value)
                    }
                />

                <InputField
                    label="Địa Chỉ / Address"
                    value={currentData.address_company || ""}
                    onChange={(e) =>
                        handleChangeField("address_company", e.target.value)
                    }
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

                {/* Buttons */}
                <div className="flex gap-4 justify-center">

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 
              shadow-md transition font-semibold cursor-pointer"
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
