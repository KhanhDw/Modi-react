// src\components\feature\pagination.jsx

import { useEffect, useState } from "react";

export default function PageList({
  data,
  pageSize = 6,
  onPageChange,
  onPageNumberChange,
}) {
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  // Detect kích thước màn hình
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px là breakpoint cho tablet
    };

    // Kiểm tra ngay khi component mount
    checkScreenSize();

    // Thêm event listener để theo dõi thay đổi kích thước
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Reset page khi data thay đổi
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    } else if (totalPages === 0) {
      setPage(1);
    }
  }, [data, totalPages]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const paginatedData = data.slice(startIndex, endIndex);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(paginatedData);
    }
    if (onPageNumberChange) {
      onPageNumberChange(page);
    }
  }, [page, data, onPageChange, onPageNumberChange]);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > maxVisible + 2) {
        pages.push("...");
      }

      const start = Math.max(2, page - maxVisible);
      const end = Math.min(totalPages - 1, page + maxVisible);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - (maxVisible + 1)) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages.map((num, idx) =>
      num === "..." ? (
        <span
          key={idx}
          className="px-2"
        >
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => setPage(num)}
          className={`px-3 py-1 rounded-lg border cursor-pointer ${
            page === num
              ? "bg-blue-500 text-white border-blue-500"
              : "hover:bg-gray-100"
          }`}
        >
          {num}
        </button>
      )
    );
  };

  // Hiển thị dạng đơn giản cho mobile/tablet
  const renderMobilePagination = () => (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700 admin-dark:text-gray-300">
        {page} / {totalPages}
      </span>
      <div className="flex space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                   text-gray-700 admin-dark:text-gray-200 border-gray-300 admin-dark:border-gray-600
                   hover:bg-gray-100 admin-dark:hover:bg-gray-700 transition cursor-pointer"
        >
          ←
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                   text-gray-700 admin-dark:text-gray-200 border-gray-300 admin-dark:border-gray-600
                   hover:bg-gray-100 admin-dark:hover:bg-gray-700 transition cursor-pointer"
        >
          →
        </button>
      </div>
    </div>
  );

  // Hiển thị đầy đủ cho desktop
  const renderDesktopPagination = () => (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                 text-gray-700 admin-dark:text-gray-200 border-gray-300 admin-dark:border-gray-600
                 hover:bg-gray-100 admin-dark:hover:bg-gray-700 transition cursor-pointer"
      >
        <span className="text-gray-900 admin-dark:text-white">←</span>
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                 text-gray-700 admin-dark:text-gray-200 border-gray-300 admin-dark:border-gray-600
                 hover:bg-gray-100 admin-dark:hover:bg-gray-700 transition cursor-pointer"
      >
        <span className="text-gray-900 admin-dark:text-white">→</span>
      </button>
    </div>
  );

  return (
    <div className="w-full p-3 flex flex-col justify-between items-center sm:flex-row md:items-center md:justify-between gap-3">
      {/* Thông tin hiển thị */}
      <div className="text-xs sm:text-sm text-gray-600 admin-dark:text-gray-300">
        Hiển thị <span className="font-medium">{startIndex + 1}</span> –{" "}
        <span className="font-medium">{endIndex}</span> trong{" "}
        <span className="font-semibold">{totalRows}</span> dòng
      </div>

      {/* Pagination - thay đổi theo kích thước màn hình */}
      {isMobile ? renderMobilePagination() : renderDesktopPagination()}
    </div>
  );
}
