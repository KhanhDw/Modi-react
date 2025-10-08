import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const [screenSize, setScreenSize] = useState("desktop");

  // Detect kích thước màn hình (mobile / tablet / desktop)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 640) setScreenSize("mobile");
      else if (width <= 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (totalPages <= 1) return null;

  //Mobile
  if (screenSize === "mobile") {
    return (
      <div className="flex items-center justify-center space-x-3 py-2">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="transition-all duration-200 disabled:opacity-50 admin-dark:border-gray-700 admin-dark:hover:bg-gray-700 border bg-white border-gray-300 admin-dark:bg-gray-700 cursor-pointer"
        >
          <span className="text-lg font-medium text-gray-600 admin-dark:text-gray-300">
            ←
          </span>
        </Button>

        <div className="flex items-center justify-center min-w-[64px] px-3 py-1.5 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm admin-dark:bg-gray-700 admin-dark:border-gray-700 admin-dark:text-gray-200">
          {currentPage}
          <span className="text-gray-400 mx-1">/</span>
          {totalPages}
        </div>

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="transition-all duration-200 disabled:opacity-50 admin-dark:border-gray-700 admin-dark:hover:bg-gray-700 border bg-white admin-dark:bg-gray-700 border-gray-300 cursor-pointer"
        >
          <span className="text-lg font-medium text-gray-600 admin-dark:text-gray-300">
            →
          </span>
        </Button>
      </div>
    );
  }

  // Tablet
  if (screenSize === "tablet") {
    const visiblePages = 3;

    // Tính toán phạm vi trang hiển thị
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // Nếu ở cuối danh sách, đẩy lùi vùng hiển thị về trước
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    const showLeftDots = startPage > 1;
    const showRightDots = endPage < totalPages;

    return (
      <div className="flex items-center justify-center space-x-2 py-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="transition-all duration-200 disabled:opacity-50 border bg-white border-gray-300 cursor-pointer admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800"
        >
          <span className="text-base font-medium text-gray-600 admin-dark:text-gray-300">
            ←
          </span>
        </Button>

        {/* Dấu ... bên trái */}
        {showLeftDots && (
          <div className="flex items-center justify-center text-sm font-medium text-gray-500
           admin-dark:text-gray-300">
            ...
          </div>
        )}

        {/* Các nút trang động */}
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
            className={`transition-all duration-200 cursor-pointer hover:scale-105 border rounded-md bg-white border-gray-300
                      admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800
                      ${currentPage === page
                ? "bg-blue-600 text-white admin-dark:bg-blue-600"
                : "text-gray-700 admin-dark:text-gray-200"
              }`}
          >
            {page}
          </Button>
        ))}

        {/* Dấu ... bên phải */}
        {showRightDots && (
          <div className="flex items-center justify-center text-sm font-medium text-gray-500
           admin-dark:text-gray-300">
            ...
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="transition-all cursor-pointer duration-200 disabled:opacity-50 border bg-white border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800"
        >
          <span className="text-base font-medium text-gray-600 admin-dark:text-gray-300">
            →
          </span>
        </Button>
      </div>
    );
  }

  // Desktop
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-2">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="transition-all duration-200 disabled:opacity-50 border bg-white border-gray-300 hover:bg-gray-200 admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800 cursor-pointer"
      >
        <span className="font-medium text-gray-600 admin-dark:text-gray-300">
          ← Trước
        </span>
      </Button>

      {/* Trang đầu + dấu ... */}
      {currentPage > 3 && totalPages > 5 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            className="transition-all duration-200 hover:scale-105 border bg-white border-gray-300 hover:bg-gray-200 hover:text-gray-600 admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800 text-gray-700 admin-dark:text-gray-200 cursor-pointer"
          >
            1
          </Button>
          <div className="px-2 text-gray-500 admin-dark:text-gray-400 select-none">...</div>
        </>
      )}

      {/* Các nút trang động */}
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          size="sm"
          onClick={() => setCurrentPage(page)}
          className={`transition-all duration-200 hover:scale-105 border border-gray-300 cursor-pointer
                    admin-dark:border-gray-600
                    ${currentPage === page
              ? "bg-blue-600 text-white hover:bg-blue-700 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-700"
              : "bg-white hover:bg-gray-200 text-gray-700 admin-dark:bg-gray-700 admin-dark:text-gray-200 admin-dark:hover:bg-gray-800"
            }`}
        >
          {page}
        </Button>
      ))}

      {/* Dấu ... + trang cuối */}
      {currentPage < totalPages - 2 && totalPages > 5 && (
        <>
          <div className="px-2 text-gray-500 admin-dark:text-gray-400 select-none">...</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            className="transition-all duration-200 hover:scale-105 border bg-white border-gray-300 hover:bg-gray-200 hover:text-gray-600 text-gray-700 admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800 admin-dark:text-gray-200 cursor-pointer"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="transition-all duration-200 disabled:opacity-50 border bg-white hover:bg-gray-200 border-gray-300 admin-dark:border-gray-600 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-800 cursor-pointer"
      >
        <span className="font-medium text-gray-600 admin-dark:text-gray-300">
          Sau →
        </span>
      </Button>
    </div>
  );

}
