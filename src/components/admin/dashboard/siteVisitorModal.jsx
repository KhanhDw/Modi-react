import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import useLenisLocal from '@/hook/useLenisLocal';

function SiteVisitsModal({ open, onClose }) {
    const [visits, setVisits] = useState([]);
    useLenisLocal(".lenis-local");

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const res = await fetch(
                        `${import.meta.env.VITE_MAIN_BE_URL}/api/site/visits/all`
                    );
                    const data = await res.json();
                    setVisits(data);
                } catch (error) {
                    console.error("Lỗi load dữ liệu:", error);
                }
            };
            fetchData();
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-lg w-full max-w-2xl p-6 transition-colors">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold">Danh sách lượt truy cập</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Bảng */}
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table data-lenis-prevent className="lenis-local min-w-full border border-gray-200 dark:border-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 border dark:border-gray-700">STT</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Khách hàng</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Thời gian truy cập</th>
                            </tr>
                        </thead>
                        <tbody data-lenis-prevent className="lenis-local overflow-y-auto">
                            {visits.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center py-4 text-gray-500 dark:text-gray-400 border dark:border-gray-700"
                                    >
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                visits.map((visit, index) => (
                                    <tr
                                        key={visit.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-2 border dark:border-gray-700 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2 border dark:border-gray-700 text-center">
                                            <div className="flex items-center justify-center">
                                                <User className="w-5 h-5" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 border dark:border-gray-700">
                                            <div className="flex items-center justify-center">
                                                {new Date(visit.visit_time).toLocaleString("vi-VN")}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SiteVisitsModal;
