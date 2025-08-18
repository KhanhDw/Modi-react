import React, { useState } from "react";

export default function PaginatedTable({ columns, data, pageSize = 5 }) {
    const [page, setPage] = useState(1);

    const totalRows = data.length; // 👉 tổng số dòng dữ liệu
    const totalPages = Math.ceil(totalRows / pageSize);

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRows);
    const paginatedData = data.slice(startIndex, endIndex);

    // Hàm render pagination numbers
    const renderPageNumbers = () => {
        let pages = [];

        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages = [1, "...", totalPages];
        }

        return pages.map((num, idx) =>
            num === "..." ? (
                <span key={idx} className="px-2">
                    ...
                </span>
            ) : (
                <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 rounded-lg border ${page === num
                        ? "bg-blue-500 text-white border-blue-500"
                        : "hover:bg-gray-100"
                        }`}
                >
                    {num}
                </button>
            )
        );
    };

    return (
        <div className="w-full p-4 border-t flex items-center justify-between">
            {/* Hiển thị tổng số dòng */}
            <div className="text-sm text-gray-600 ">
                Hiển thị <span className="font-medium">{startIndex + 1}</span> –{" "}
                <span className="font-medium">{endIndex}</span> trong{" "}
                <span className="font-semibold">{totalRows}</span> dòng
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 mt-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                    ←
                </button>

                {renderPageNumbers()}

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                    →
                </button>
            </div>
        </div>
    );
}
