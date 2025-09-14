import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import ServiceDropdownHeaderMenu from "@/pages/managers/ConfigPage/headerConfig/ServiceDropdownHeaderMenu.jsx";


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
    const lang = "vi";
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    // 🔹 Chuẩn hóa image_url (tránh lưu cả domain)
    function normalizeImageUrl(url) {
        if (!url) return "";
        try {
            const u = new URL(url, import.meta.env.VITE_MAIN_BE_URL);
            return u.pathname; // chỉ lấy path
        } catch {
            return url;
        }
    }

    // 🔹 Load logo từ API
    const fetchLogo = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/section-items/type/logo?slug=header`);
            if (!res.ok) throw new Error("Không thể tải logo");
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                const item = data[0];
                const fullUrl = item.image_url ? `${API_BASE_URL}${item.image_url}` : "/logoModi.png";

                setLogoItem(item);
                setLogo(fullUrl);

                // ✅ cập nhật localStorage
                localStorage.setItem("app_logo", fullUrl);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi tải logo: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Lấy logo ban đầu từ localStorage (nếu có) → rồi fetch từ API để làm mới
    useEffect(() => {
        const cachedLogo = localStorage.getItem("app_logo");
        if (cachedLogo) {
            setLogo(cachedLogo);
        }
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
                    updatedItem.image_url = normalizeImageUrl(url);
                }
            }

            await fetch(`${API_BASE_URL}/api/section-items/${logoItem.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItem),
            });

            const fullUrl = `${API_BASE_URL}${updatedItem.image_url}`;
            setLogo(fullUrl);
            setLogoItem(updatedItem);

            // ✅ cập nhật localStorage sau khi save
            localStorage.setItem("app_logo", fullUrl);

            setToast({ message: "Lưu thành công!", type: "success" });
            setFile(null);
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
                    className="w-60 shadow-lg rounded-xl object-cover cursor-pointer"
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
                <div className="space-y-4 flex items-center justify-between gap-3">
                    <div className="w-full">

                        <FileInput label="Cập nhật Logo Website" onChange={handleLogoChange} />
                    </div>
                    <div className="flex items-end gap-2">
                        <motion.button
                            onClick={handleSave}
                            disabled={loading}
                            className="py-3 px-4  bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg
                         transition-all flex justify-center items-center gap-2 cursor-pointer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {loading ? "Đang lưu..." : "Lưu Logo"}
                        </motion.button>
                    </div>
                </div>

                <div className="w-full flex flex-col space-y-3">
                    <label className="font-semibold text-gray-700 admin-dark:text-gray-300"> Cấu hình danh sách dịch vụ</label>
                    <ServiceDropdownHeaderMenu
                        lang={lang}
                    />
                </div>


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
