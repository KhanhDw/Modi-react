// src\components\feature\pagination.jsx
import React, { useState, useEffect } from "react";

export default function PageList({ data, pageSize = 6, onPageChange, onPageNumberChange }) {
    const [page, setPage] = useState(1);

    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / pageSize);

    // mỗi lần page đổi thì gọi callback để PostsTable nhận dữ liệu đã cắt
    useEffect(() => {
        if (totalPages > 0 && page > totalPages) {
            setPage(totalPages); // Chuyển về trang cuối hợp lệ
        } else if (totalPages === 0) {
            setPage(1); // Reset về 1 khi data rỗng
        }
    }, [data, totalPages]);

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRows);
    const paginatedData = data.slice(startIndex, endIndex);

    // useEffect gốc: Gọi onPageChange khi page hoặc data thay đổi
    useEffect(() => {
        if (onPageChange) {
            onPageChange(paginatedData);
        }
        if (onPageNumberChange) {
            onPageNumberChange(page); // 👉 báo cho PostsTable biết trang hiện tại
        }
    }, [page, data, onPageChange, onPageNumberChange]);

    const renderPageNumbers = () => {
        let pages = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages = [1, "...", totalPages];
        }

        return pages.map((num, idx) =>
            num === "..." ? (
                <span key={idx} className="px-2">...</span>
            ) : (
                <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 rounded-lg border cursor-pointer ${page === num ? "bg-blue-500 text-white border-blue-500" : "hover:bg-gray-100"
                        }`}
                >
                    {num}
                </button>
            )
        );
    };

    return (
        <div className="w-full p-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
                Hiển thị <span className="font-medium">{startIndex + 1}</span> –{" "}
                <span className="font-medium">{endIndex}</span> trong{" "}
                <span className="font-semibold">{totalRows}</span> dòng
            </div>

            <div className="flex items-center justify-center space-x-2 mt-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50 cursor-pointer"
                >
                    ←
                </button>

                {renderPageNumbers()}

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50 cursor-pointer"
                >
                    →
                </button>
            </div>
        </div>
    );
}
