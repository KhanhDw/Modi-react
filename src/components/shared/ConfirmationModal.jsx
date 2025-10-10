import React from "react";
import { X } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 sm:px-5 md:px-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl bg-white admin-dark:bg-gray-900 border border-gray-200 admin-dark:border-gray-700 p-6 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white/80 text-gray-600 hover:bg-gray-100 hover:text-gray-900 admin-dark:border-gray-600 admin-dark:bg-gray-800 admin-dark:text-gray-300 admin-dark:hover:bg-gray-700 admin-dark:hover:text-white transition-all duration-200 cursor-pointer backdrop-blur-sm"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <h3 className="text-base sm:text-lg font-semibold text-gray-900 admin-dark:text-white mb-4">
          {title}
        </h3>
        <p className="text-sm text-gray-600 admin-dark:text-gray-300 mb-6">
          {message}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
