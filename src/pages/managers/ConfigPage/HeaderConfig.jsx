import NotificationToast from "@/components/feature/notification-toast.jsx";
import ServiceDropdownHeaderMenu from "@/pages/managers/ConfigPage/headerConfig/ServiceDropdownHeaderMenu.jsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function FileInput({ label, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 admin-dark:text-gray-300 text-xs sm:text-sm">{label}</label>
            <div className="relative">
                <input autoComplete="off"
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                    className="w-full p-2 sm:p-3 rounded-lg bg-gray-50 admin-dark:bg-gray-800 border border-gray-300 admin-dark:border-gray-600 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 admin-dark:text-gray-400 font-semibold text-xs sm:text-base md:text-xl">
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
    const [logoItem, setLogoItem] = useState(null);
    const [toast, setToast] = useState(null);
    const lang = "vi";
    const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

    function normalizeImageUrl(url) {
        if (!url) return "";
        try {
            const u = new URL(url, import.meta.env.VITE_MAIN_BE_URL);
            return u.pathname;
        } catch {
            return url;
        }
    }

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
                localStorage.setItem("app_logo", fullUrl);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi tải logo: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cachedLogo = localStorage.getItem("app_logo");
        if (cachedLogo) {
            setLogo(cachedLogo);
        }
        fetchLogo();
    }, []);

    const handleLogoChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setLogo(URL.createObjectURL(selectedFile));
    };

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

    const handleSave = async () => {
        if (!logoItem) return alert("Chưa có logo trong database");
        try {
            setLoading(true);

            let updatedItem = { ...logoItem };

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

    if (loading) return <p className="text-center text-gray-700 admin-dark:text-gray-300 text-xs sm:text-sm py-6">⏳ Đang tải...</p>;

    return (
        <div className="md:p-2 max-w-8xl mx-auto space-y-6 sm:space-y-8 flex items-center flex-col justify-center">
            {/* Header Preview */}
            <motion.div
                className="max-w-3xl  flex flex-col items-center justify-center bg-indigo-50 admin-dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg p-2 sm:p-6 md:p-8 gap-4 sm:gap-6"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <motion.img
                    src={logo}
                    alt="Logo"
                    className="w-32 sm:w-40 md:w-48 lg:w-60 shadow-md rounded-lg object-cover cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onError={(e) => (e.currentTarget.src = "/logoModi.png")}
                />
            </motion.div>

            {/* Config Form */}
            <motion.div
                className="bg-white admin-dark:bg-gray-900 px-2 py-3 sm:p-4 rounded-xl sm:rounded-xl shadow-md border border-gray-200 admin-dark:border-gray-700 space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
                    <div className="w-full">
                        <FileInput label="Cập nhật Logo Website" onChange={handleLogoChange} />
                    </div>
                    <div className="flex items-end gap-2 w-full sm:w-auto ">
                        <motion.button
                            onClick={handleSave}
                            disabled={loading}
                            className="whitespace-nowrap w-full sm:w-auto py-2 sm:py-3 px-3 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-md transition-all flex justify-center items-center gap-1 sm:gap-2 cursor-pointer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <span className="text-xs sm:text-sm font-semibold">{loading ? "Đang lưu..." : "Lưu Logo"}</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Config Form */}
            <motion.div
                className="w-full bg-white admin-dark:bg-gray-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md border border-gray-200 admin-dark:border-gray-700 space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >


                <div className="w-full flex flex-col space-y-3 sm:space-y-4">
                    <span className="font-semibold text-gray-700 admin-dark:text-gray-300 text-xs sm:text-sm">Cấu hình danh sách dịch vụ</span>
                    <ServiceDropdownHeaderMenu lang={lang} />
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
