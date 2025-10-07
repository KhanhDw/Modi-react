import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeleteDialog({
  name,
  id,
  handleDelete,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Nút Xóa (chỉ icon) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Xóa mẫu ${name}`}
        className={`flex items-center justify-center
          p-1 h-8 w-8
          rounded-sm bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700
          cursor-pointer border-none transition-colors duration-200
          ${className}`}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </button>

      {/* Dialog xác nhận xoá */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white admin-dark:bg-gray-800 border border-gray-200 admin-dark:border-gray-700 rounded-md max-w-sm w-full p-4 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <h2
                id="dialog-title"
                className="text-gray-900 font-semibold admin-dark:text-gray-100 text-base sm:text-lg text-center mb-2 break-words"
              >
                Xác nhận xóa
              </h2>

              <p
                id="dialog-description"
                className="text-sm text-start sm:text-base text-gray-600 admin-dark:text-gray-400 mb-6 break-words whitespace-pre-line"
              >
                Bạn có chắc chắn muốn xóa bài viết Blog &quot;{name}&quot; này?
              </p>
            </header>

            <footer className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs sm:text-sm border border-gray-200 admin-dark:border-gray-700 text-gray-900 admin-dark:text-gray-100 bg-gray-300 hover:bg-gray-200 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800 px-4 py-1 rounded cursor-pointer"
              >
                <span className="text-xs sm:text-base font-semibold text-gray-700 admin-dark:text-gray-300">
                  Hủy
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDelete(id);
                  setIsOpen(false);
                }}
                className="text-xs sm:text-sm bg-red-600 text-white hover:bg-red-700 px-4 py-1 rounded cursor-pointer"
              >
                <span className="text-xs sm:text-base font-semibold">Xóa</span>
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
