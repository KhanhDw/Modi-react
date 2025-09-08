import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RenderHomeConfig from "./renderSectionHomeConfig";
import NotificationToast from "@/components/feature/notification-toast.jsx";

// ===================== PARSERS =====================
const sectionParsers = {
    banner: (data) =>
        data.map((item) => ({
            id: item.id,
            title: { vi: item.title?.vi || "", en: item.title?.en || "" },
            description: { vi: item.description?.vi || "", en: item.description?.en || "" },
            banner: item.image_url ? `${item.image_url}` : "",
        })),
    nenTang: (data) => Array.isArray(data) ? data : [],
    cards: (data) =>
        data.map((item) => ({
            id: item.id,
            title: { vi: item.title?.vi || "", en: item.title?.en || "" },
            description: { vi: item.description?.vi || "", en: item.description?.en || "" },
            image_url: item.image_url ? `${item.image_url}` : "",
        })),
    dichVu: (data) =>
        data.map((item) => ({
            id: item.id,
            title: { vi: item.title?.vi || "", en: item.title?.en || "" },
            description: { vi: item.description?.vi || "", en: item.description?.en || "" },
            image_url: item.image_url ? `${item.image_url}` : "",
        })),
    loiIch: (data) => Array.isArray(data) ? data : [],
    khauHieu: (data) => Array.isArray(data) ? data : [],
    khachHang: (data) => Array.isArray(data) ? data : [],
};

export default function HomeConfigMultiLang() {
    const [activeLang, setActiveLang] = useState("vi");
    const [activeSection, setActiveSection] = useState("banner");
    const [previewBanner, setPreviewBanner] = useState({});
    const [toast, setToast] = useState(null);

    const [homeData, setHomeData] = useState({
        vi: { banner: [], nenTang: [], cards: [], dichVu: [], loiIch: [], khauHieu: [], khachHang: [] },
        en: { banner: [], nenTang: [], cards: [], dichVu: [], loiIch: [], khauHieu: [], khachHang: [] },
    });

    const currentData = homeData[activeLang];

    // ===================== FETCH CHUNG =====================
    const fetchSection = async (type) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/type/${type}?slug=home`
            );
            const data = await res.json();
            const parsed = sectionParsers[type]?.(data) || data;

            setHomeData((prev) => ({
                ...prev,
                [activeLang]: {
                    ...prev[activeLang],
                    [type]: parsed,
                },
            }));
        } catch (err) {
            console.error(`❌ Fetch ${type} failed:`, err);
        }
    };

    useEffect(() => {
        const sections = ["banner", "nenTang", "cards", "dichVu", "loiIch", "khauHieu", "khachHang"];
        Promise.all(sections.map((type) => fetchSection(type)));
    }, [activeLang]);

    // ===================== HANDLE CHANGE =====================
    const handleChange = (section, id, field, value) => {
        setHomeData((prev) => {
            const copy = structuredClone(prev);
            if (Array.isArray(copy[activeLang][section])) {
                copy[activeLang][section] = copy[activeLang][section].map((item) =>
                    item.id === id
                        ? field === "title" || field === "description"
                            ? { ...item, [field]: { ...(item[field] || {}), [activeLang]: value } }
                            : { ...item, [field]: value }
                        : item
                );
            } else {
                copy[activeLang][section] = {
                    ...copy[activeLang][section],
                    [field]:
                        field === "title" || field === "description"
                            ? { ...(copy[activeLang][section][field] || {}), [activeLang]: value }
                            : value,
                };
            }
            return copy;
        });
    };

    // ===================== HANDLE FILE CHANGE =====================
    const handleFileChange = (section, id, file) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewBanner((prev) => ({ ...prev, [id]: previewUrl }));

            setHomeData((prev) => {
                const copy = { ...prev };
                copy[activeLang][section] = copy[activeLang][section].map((item) =>
                    item.id === id ? { ...item, file } : item
                );
                return copy;
            });
        }
    };

    // ===================== UPLOAD IMAGE =====================
    const uploadImage = async (file, id, section, field = "image_url") => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", id);
        formData.append("field", field);
        formData.append("section", section);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/upload?field=${field}`,
                { method: "POST", body: formData }
            );
            const result = await res.json();
            return result?.data?.url || result?.url || null;
        } catch (err) {
            console.error("❌ Upload failed:", err);
            return null;
        }
    };

    function normalizeImageUrl(url) {
        if (!url) return "";
        try {
            const u = new URL(url, import.meta.env.VITE_MAIN_BE_URL);
            return u.pathname;
        } catch {
            return url;
        }
    }

    // ===================== SAVE =====================
    const handleSave = async (section) => {
        const data = homeData[activeLang][section];

        try {
            if (Array.isArray(data)) {
                await Promise.all(
                    data.map(async (item) => {
                        const resOld = await fetch(
                            `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${item.id}`
                        );
                        const oldItem = await resOld.json();

                        const mergedItem = {
                            ...oldItem,
                            ...item,
                            title: { ...(oldItem.title || {}), ...(item.title || {}) },
                            description: { ...(oldItem.description || {}), ...(item.description || {}) },
                        };

                        // Chuẩn hóa ảnh trước khi lưu
                        if (mergedItem.image_url) mergedItem.image_url = normalizeImageUrl(mergedItem.image_url);
                        if (mergedItem.banner) mergedItem.banner = normalizeImageUrl(mergedItem.banner);

                        await fetch(
                            `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${item.id}`,
                            {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(mergedItem),
                            }
                        );

                        if (item.file instanceof File) {
                            const url = await uploadImage(item.file, item.id, section);
                            if (url) {
                                setHomeData((prev) => {
                                    const copy = { ...prev };
                                    copy[activeLang][section] = copy[activeLang][section].map((x) =>
                                        x.id === item.id ? { ...x, banner: url, file: undefined } : x
                                    );
                                    return copy;
                                });
                            }
                        }
                    })
                );
            } else {
                const resOld = await fetch(
                    `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${data.id}`
                );
                const oldItem = await resOld.json();

                const mergedItem = {
                    ...oldItem,
                    ...data,
                    title: { ...(oldItem.title || {}), ...(data.title || {}) },
                    description: { ...(oldItem.description || {}), ...(data.description || {}) },
                };

                await fetch(
                    `${import.meta.env.VITE_MAIN_BE_URL}/api/section-items/${data.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(mergedItem),
                    }
                );
            }

            setToast({ message: `Đã lưu ${section} (${activeLang})`, type: "success" });
        } catch (err) {
            console.error("Save failed:", err);
            setToast({ message: "Lưu thất bại", type: "error" });
        }
    };

    // ===================== RENDER =====================
    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            {/* LANG TABS */}
            <div className="flex gap-4 mb-6">
                {["vi", "en"].map((lang) => (
                    <motion.button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${activeLang === lang
                            ? "bg-indigo-600 text-white shadow-md cursor-pointer"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 admin-dark:bg-gray-800 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700 cursor-pointer"
                            }`}
                    >
                        {lang === "vi" ? "Tiếng Việt" : "English"}
                    </motion.button>
                ))}
            </div>

            {/* SECTION TABS */}
            <div className="flex flex-wrap gap-3 mb-6">
                {[
                    { key: "banner", label: "Banner" },
                    { key: "nenTang", label: "Nền tảng" },
                    { key: "cards", label: "3 Cards" },
                    { key: "dichVu", label: "Dịch vụ" },
                    { key: "loiIch", label: "Lợi ích" },
                    { key: "khauHieu", label: "Khẩu hiệu" },
                    { key: "khachHang", label: "Khách hàng" },
                ].map((sec) => (
                    <motion.button
                        key={sec.key}
                        onClick={() => setActiveSection(sec.key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${activeSection === sec.key
                            ? "bg-indigo-600 text-white shadow-md cursor-pointer"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 admin-dark:bg-gray-800 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700 cursor-pointer"
                            }`}
                    >
                        {sec.label}
                    </motion.button>
                ))}
            </div>

            {/* SECTION CONTENT */}
            <div className="bg-white p-4 admin-dark:bg-gray-800 admin-dark:text-gray-100 rounded-xl shadow-md transition">
                <RenderHomeConfig
                    activeSection={activeSection}
                    currentData={currentData}
                    activeLang={activeLang}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    handleSave={handleSave}
                    previewBanner={previewBanner}
                />
            </div>

            {/* ✅ Hiển thị Toast */}
            {toast && (
                <NotificationToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
