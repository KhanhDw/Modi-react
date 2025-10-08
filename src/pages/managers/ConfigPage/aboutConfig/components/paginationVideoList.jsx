// Pagination.jsx
import React, { useState, useEffect } from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  currentItemsCount,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(
        2,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);

      if (endPage - startPage < maxVisiblePages - 2) {
        startPage = Math.max(2, endPage - (maxVisiblePages - 2));
      }

      if (startPage > 2) {
        pages.push("ellipsis-start");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Mobile Pagination
  if (isMobile) {
    return (
      <div className="flex items-center justify-between bg-white admin-dark:bg-gray-800 p-4 rounded-xl border border-gray-200 admin-dark:border-gray-700 shadow-sm">
        {/* Page Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 admin-dark:bg-blue-900/30 text-blue-600 admin-dark:text-blue-400 px-2 py-1 rounded-lg text-sm font-medium">
              <span className="font-semibold">{currentPage}</span>
              <span className="text-blue-500 admin-dark:text-blue-300">
                /{totalPages}
              </span>
            </div>
            <div className="text-gray-500 admin-dark:text-gray-400 text-xs">
              {currentItemsCount} video
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-50 admin-dark:bg-gray-700 text-gray-600 admin-dark:text-gray-300 p-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:admin-dark:bg-gray-600 active:bg-gray-200 active:admin-dark:bg-gray-500 transition-all duration-200 border border-gray-200 admin-dark:border-gray-600"
            aria-label="Trang trước"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-50 admin-dark:bg-gray-700 text-gray-600 admin-dark:text-gray-300 p-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 hover:admin-dark:bg-gray-600 active:bg-gray-200 active:admin-dark:bg-gray-500 transition-all duration-200 border border-gray-200 admin-dark:border-gray-600"
            aria-label="Trang sau"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Desktop Pagination
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-6 border-t border-gray-200 admin-dark:border-gray-700">
      {/* Items Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 admin-dark:bg-blue-900/20 text-blue-700 admin-dark:text-blue-300 px-3 py-2 rounded-lg border border-blue-100 admin-dark:border-blue-800">
            <span className="font-semibold">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>
            <span className="text-blue-600 admin-dark:text-blue-400">
              {" "}
              của {totalItems}
            </span>
          </div>
          <span className="text-gray-500 admin-dark:text-gray-400 text-sm font-medium">
            video
          </span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-3">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-white admin-dark:bg-gray-700 border border-gray-300 admin-dark:border-gray-600 text-gray-700 admin-dark:text-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:admin-dark:bg-gray-600 active:bg-gray-100 active:admin-dark:bg-gray-500 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Trước</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <span
                  key={index}
                  className="text-gray-400 admin-dark:text-gray-500 px-2 py-1 text-sm font-medium"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`
                  min-w-[2.75rem] h-10 rounded-xl text-sm font-medium transition-all duration-200 border
                  ${
                    page === currentPage
                      ? "bg-blue-500 admin-dark:bg-blue-600 border-blue-500 admin-dark:border-blue-600 text-white shadow-md"
                      : "bg-white admin-dark:bg-gray-700 border-gray-300 admin-dark:border-gray-600 text-gray-700 admin-dark:text-gray-200 hover:bg-gray-50 hover:admin-dark:bg-gray-600"
                  }
                  hover:shadow-md active:scale-95
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-white admin-dark:bg-gray-700 border border-gray-300 admin-dark:border-gray-600 text-gray-700 admin-dark:text-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:admin-dark:bg-gray-600 active:bg-gray-100 active:admin-dark:bg-gray-500 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <span>Tiếp</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Quick Navigation */}
      <div className="flex items-center gap-3">
        <span className="text-gray-600 admin-dark:text-gray-300 text-sm font-medium whitespace-nowrap">
          Đến trang
        </span>
        <div className="relative">
          <select
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className="bg-white admin-dark:bg-gray-700 border border-gray-300 admin-dark:border-gray-600 text-gray-800 admin-dark:text-gray-200 pl-3 pr-8 py-2 rounded-lg text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:admin-dark:ring-blue-400 focus:border-blue-500 transition-all duration-200 cursor-pointer"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option
                key={page}
                value={page}
              >
                {page}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 admin-dark:text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
