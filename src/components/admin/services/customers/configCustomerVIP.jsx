import useVipConfig from "@/components/admin/services/hooks/useVipConfig.js";
import NotificationToast from "@/components/feature/notification-toast.jsx";
import { useEffect, useState } from "react";

// Hàm tiện ích: định dạng tiền
const formatCurrency = (value) => {
    const numericValue = String(value).replace(/\D/g, "");
    if (!numericValue) return "";
    return Number(numericValue).toLocaleString("vi-VN");
};

function ConfigCustomerVIP({ setOpenConfigCustomerVIP }) {
    const { minSpent, setMinSpent, loading, updateVipConfig } = useVipConfig();
    const [displayAmount, setDisplayAmount] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // Sync displayAmount khi minSpent thay đổi
    useEffect(() => {
        setDisplayAmount(formatCurrency(minSpent));
    }, [minSpent]);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const inputString = e.target.value;
        setDisplayAmount(inputString);

        const numericValue = inputString.replace(/\./g, "");
        setMinSpent(numericValue !== "" && !isNaN(Number(numericValue)) ? Number(numericValue) : 0);
    };

    // Lưu cấu hình
    const handleSave = async () => {
        try {
            setIsSaving(true);
            await updateVipConfig(minSpent);
            setToast({ message: "✅ Lưu thành công!", type: "success" });
            setOpenConfigCustomerVIP(false);
        } catch (err) {
            setToast({ message: "❌ Lỗi khi lưu: " + err.message, type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <p className="text-center p-4">⏳ Đang tải cấu hình VIP...</p>;

    return (
        <div
            onClick={() => setOpenConfigCustomerVIP(false)}
            className="fixed inset-0 bg-gray-300 bg-opacity-70 admin-dark:bg-gray-900 admin-dark:bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md admin-dark:bg-gray-800 admin-dark:text-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center p-3 sm:p-5 border-b border-gray-200 bg-blue-50 rounded-t-xl admin-dark:border-gray-700 admin-dark:bg-gray-800">
                    <h2 className="text-lg sm:text-xl font-extrabold text-blue-800 flex items-center admin-dark:text-blue-400">
                        👑 Cấu Hình Hạn Mức VIP
                    </h2>
                    <button
                        onClick={() => setOpenConfigCustomerVIP(false)}
                        className="text-gray-500 cursor-pointer hover:text-gray-800 transition p-1 rounded-full hover:bg-gray-100 admin-dark:text-gray-400 admin-dark:hover:text-white admin-dark:hover:bg-gray-700"
                    >
                        ✖
                    </button>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-5 space-y-6">
                    <div className="text-gray-600 border-l-4 border-yellow-500 pl-3 py-1 bg-yellow-50 rounded-r-lg admin-dark:text-yellow-200 admin-dark:bg-gray-700 admin-dark:border-yellow-400">
                        <p className="font-semibold">
                            Áp dụng cho loại khách hàng:{" "}
                            <span className="text-blue-600 admin-dark:text-blue-400">VIP</span>
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 admin-dark:text-gray-300">
                            Số Tiền Chi Tiêu Tối Thiểu (VND)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={displayAmount}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 5.000.000"
                                className="w-full pl-3 pr-12 py-3 focus:outline-none focus:border-none border border-gray-300 rounded-lg text-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 admin-dark:bg-gray-700 admin-dark:border-gray-600 admin-dark:text-white"
                            />
                            <span className="absolute right-0 top-0 h-full flex items-center pr-3 text-sm font-semibold text-gray-500 admin-dark:text-gray-400">
                                VND
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-5 border-t border-gray-200 flex justify-center sm:justify-end space-x-3 bg-gray-50 rounded-b-xl admin-dark:border-gray-700 admin-dark:bg-gray-800">
                    <button
                        onClick={() => setOpenConfigCustomerVIP(false)}
                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-pointer rounded-lg admin-dark:border-gray-600 hover:bg-gray-100 admin-dark:bg-gray-800 admin-dark:text-gray-200 admin-dark:hover:bg-gray-700"
                        disabled={isSaving}
                    >
                        Hủy Bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        className={`px-5 py-2 cursor-pointer text-sm font-medium text-white rounded-lg shadow-md ${isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        disabled={isSaving}
                    >
                        {isSaving ? "Đang Lưu..." : "Lưu Cấu Hình"}
                    </button>
                </div>
            </div>
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

export default ConfigCustomerVIP;
