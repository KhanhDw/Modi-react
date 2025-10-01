import React from "react";

export default function WarningModal({ open, onClose, message }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* modal */}
            <div className="relative bg-white admin-dark:bg-gray-800 rounded-lg shadow-lg w-[400px] p-6 z-10">
                <h2 className="text-lg font-semibold text-gray-900 admin-dark:text-gray-100 mb-4">
                    Cảnh báo
                </h2>
                <p className="text-gray-700 admin-dark:text-gray-300">{message}</p>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
