import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const [isTablet, setIsTablet] = useState(false);

  // Detect kích thước màn hình
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 640); // Tablet: 641px - 1024px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (totalPages <= 1) return null;

  // Hiển thị dạng đơn giản cho tablet
  if (isTablet) {
    return (
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ←
          </Button>

          <div className="flex items-center space-x-2 px-3 py-1 border rounded-md bg-gray-50 dark:bg-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentPage}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            →
          </Button>
        </div>
      </div>
    );
  }

  // Hiển thị đầy đủ cho desktop
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Trước
      </Button>

      {currentPage > 3 && totalPages > 5 && (
        <>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(1)}
          >
            1
          </Button>
          <span className="px-2 text-gray-500">...</span>
        </>
      )}

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => setCurrentPage(page)}
          className={`px-3 ${
            currentPage === page ? "bg-blue-600 text-white" : ""
          }`}
        >
          {page}
        </Button>
      ))}

      {currentPage < totalPages - 2 && totalPages > 5 && (
        <>
          <span className="px-2 text-gray-500">...</span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Sau
      </Button>
    </div>
  );
}
