import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConfirmDeleteDialog({ name, id, handleDelete, className = "", isDetail = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Xóa mẫu ${name}`}
        className={`
    flex items-center justify-center
    rounded-sm bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700
    cursor-pointer border-none transition-colors duration-200
    ${isDetail ? "px-3 h-8 w-auto" : "p-1 h-8 w-8"}
    ${className}
  `}
      >
        <Trash2 className={`h-4 w-4 ${isDetail ? "mr-2" : ""} text-red-600`} />
        {isDetail && (
          <span className="text-sm font-semibold select-none">
            Xóa mẫu website này
          </span>
        )}
      </button>

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
                className="text-gray-900 font-semibold admin-dark:text-gray-100 text-base sm:text-lg text-center mb-2"
              >
                Xác nhận xóa
              </h2>
              <p
                id="dialog-description"
                className="text-sm sm:text-base text-start text-gray-600 admin-dark:text-gray-400 mb-6"
              >
                Bạn có chắc chắn muốn xóa mẫu &quot;{name}&quot;? Hành động này không thể hoàn tác.
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
                  if (isDetail) {
                    navigate(-1);
                  }
                }}
                className="text-xs sm:text-sm bg-red-600 text-white hover:bg-red-700 px-4 py-1 rounded cursor-pointer"
              >
                <span className="text-xs sm:text-base font-semibold">
                  Xóa
                </span>
              </button>

            </footer>
          </div>
        </div>
      )}
    </>
  );
}
