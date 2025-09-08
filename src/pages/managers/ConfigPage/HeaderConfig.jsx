import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NotificationToast from "@/components/feature/notification-toast.jsx";

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
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState("/logoModi.png");
    const [logoItem, setLogoItem] = useState(null); // lưu section_item hiện tại
    const [toast, setToast] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    // 🔹 Load logo từ section_items (slug=header, type=logo)
    const fetchLogo = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/section-items/type/logo?slug=header`);
            if (!res.ok) throw new Error("Không thể tải logo");
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                const item = data[0];
                setLogoItem(item);
                setLogo(item.image_url ? `${API_BASE_URL}${item.image_url}` : "/logoModi.png");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi tải logo: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogo();
    }, []);

    // 🔹 Chọn file mới
    const handleLogoChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setLogo(URL.createObjectURL(selectedFile));
    };

    // 🔹 Upload ảnh
    const uploadImage = async (file, id, section = "logo", field = "image_url") => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", id);
        formData.append("field", field);
        formData.append("section", section);

        const res = await fetch(`${API_BASE_URL}/api/upload?field=${field}`, {
            method: "POST",
            body: formData,
        });
        const result = await res.json();
        return result?.data?.url || result?.url || null;
    };

    function normalizeImageUrl(url) {
        if (!url) return "";
        try {
            // Nếu là full URL => cắt domain, chỉ lấy pathname
            const u = new URL(url, import.meta.env.VITE_MAIN_BE_URL);
            return u.pathname;
        } catch {
            // Nếu đã là path rồi thì giữ nguyên
            return url;
        }
    }

    // 🔹 Lưu logo (update section_item)
    const handleSave = async () => {
        if (!logoItem) return alert("Chưa có logo trong database");
        try {
            setLoading(true);

            let updatedItem = { ...logoItem };

            // Nếu có file mới thì upload
            if (file) {
                const url = await uploadImage(file, logoItem.id, "logo");
                if (url) {
                    updatedItem.image_url = url;
                }
            }

            // 🔹 Chuẩn hóa ảnh trước khi lưu
            if (updatedItem.image_url) {
                updatedItem.image_url = normalizeImageUrl(updatedItem.image_url);
            }

            await fetch(`${API_BASE_URL}/api/section-items/${logoItem.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItem),
            });


            setToast({ message: "Lưu thành công!", type: "success" });
            setFile(null);
            setLogo(`${API_BASE_URL}${updatedItem.image_url}`);
            setLogoItem(updatedItem);
        } catch (err) {
            console.error(err);
            setToast({ message: "Lỗi khi lưu: " + err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center text-gray-700 admin-dark:text-gray-300">⏳ Đang tải...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-12">

            {/* ===== Header Preview ===== */}
            <motion.div
                className="flex items-center justify-center bg-indigo-50 admin-dark:bg-gray-800 rounded-3xl shadow-2xl p-8  md:flex-row  gap-8 "
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <motion.img
                    src={logo}
                    alt="Logo"
                    className="w-60  shadow-lg rounded-xl object-cover cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 1 }}
                    onError={(e) => (e.currentTarget.src = "/logoModi.png")}
                />
                
            </motion.div>

            {/* ===== Config Form ===== */}
            <motion.div
                className="bg-white admin-dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-200 admin-dark:border-gray-700 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <FileInput label="Upload New Logo" onChange={handleLogoChange} />

                <motion.button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg
                     transition-all flex justify-center items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {loading ? "Đang lưu..." : "Save Logo"}
                </motion.button>
            </motion.div>

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
