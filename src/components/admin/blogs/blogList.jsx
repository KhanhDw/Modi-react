import PageHeader from "@/components/admin/common/PageHeader";
import { useNavigate, useLocation } from "react-router-dom";
import { isAfter, parseISO } from "date-fns";
import useBlogs from "@/hook/useBlogsAdmin";
import React, { useState, useEffect, useMemo } from "react";
import { Clock } from "lucide-react";

export const isFuture = (dt) => {
    try {
        const date = typeof dt === "string" ? parseISO(dt) : new Date(dt);
        return isAfter(date, new Date());
    } catch {
        return false;
    }
};

export const renderSlateToHTML = (nodes) => {
    if (!Array.isArray(nodes)) return "";

    const renderNode = (node) => {
        if (node.text !== undefined) {
            let text = node.text;
            if (!text) return "";
            if (node.bold) text = `<strong>${text}</strong>`;
            if (node.italic) text = `<em>${text}</em>`;
            if (node.underline) text = `<u>${text}</u>`;
            if (node.code) text = `<code>${text}</code>`;
            return text;
        }

        const children = (node.children || []).map(renderNode).join("");
        const alignStyle = node.align ? ` style="text-align:${node.align};"` : "";

        switch (node.type) {
            case "paragraph":
                return `<p${alignStyle}>${children}</p>`;
            case "block-quote":
                return `<blockquote${alignStyle} style="margin:0;padding-left:8px;border-left:2px solid #ccc;">${children}</blockquote>`;
            case "numbered-list":
                return `<ol${alignStyle}>${children}</ol>`;
            case "bulleted-list":
                return `<ul${alignStyle}>${children}</ul>`;
            case "list-item":
                return `<li${alignStyle}>${children}</li>`;
            default:
                return children;
        }
    };

    return nodes.map(renderNode).join("");
};

export default function BlogsListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 6;

    const {
        blogs,
        columns,
        showForm,
        loading,
        error,
        setBlogs,
        handleAdd,
        handleEdit,
        handleDelete,
        toggleSortOrder,
        sortOrder,
        fetchBlogs,
    } = useBlogs();

    const removeAccents = (str) => {
        if (!str) return "";
        return str
            .normalize("NFD") // tách chữ và dấu
            .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
            .toLowerCase();
    };

    // Search logic không phân biệt hoa thường, dấu
    const filteredBlogs = useMemo(() => {
        if (!blogs) return [];
        if (!searchTerm.trim()) return blogs;

        const term = removeAccents(searchTerm.trim());

        return blogs.filter((b) => {
            const title = removeAccents(b.title);
            let content = "";
            try {
                content =
                    typeof b.content === "string" && b.content.trim().startsWith("[")
                        ? JSON.parse(b.content)
                            .map((n) => (n.text ? removeAccents(n.text) : ""))
                            .join(" ")
                        : removeAccents(b.content);
            } catch {
                content = removeAccents(b.content);
            }

            return title.includes(term) || content.includes(term);
        });
    }, [searchTerm, blogs]);

    const totalPages = Math.ceil(filteredBlogs.length / PAGE_SIZE);
    const paginatedBlogs = filteredBlogs.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleSearch = async (keyword) => {
        setSearchTerm(keyword);
        setCurrentPage(1);
    };

    if (!blogs || loading) return <div className="p-6 text-center text-green-700">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <div>
            <div className="w-full mb-4 sm:mb-6">
                <PageHeader
                    title={showForm ? "Sửa tin tức" : "Quản lý tin tức"}
                    buttonText="Thêm tin tức"
                    onButtonClick={handleAdd}
                    toggleSortOrder={toggleSortOrder}
                    sortOrder={sortOrder}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    APISearch={handleSearch}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-900 shadow-md transition-all duration-300">
                <table className="min-w-full border-collapse table-auto text-sm sm:text-base leading-6">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-50 admin-dark:bg-gray-800 text-gray-700 admin-dark:text-gray-300 tracking-wider text-xs sm:text-sm border-b border-gray-200 admin-dark:border-gray-700">
                            {columns.map((col) => (
                                <th
                                    key={col.name}
                                    className="px-3 sm:px-4 py-3 text-left font-semibold whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-3 sm:px-4 py-3 text-center font-semibold whitespace-nowrap">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 admin-dark:divide-gray-700">
                        {paginatedBlogs.length > 0 ? (
                            paginatedBlogs.map((blog, index) => (
                                <tr
                                    key={blog.id || index}
                                    className="last:border-none hover:bg-gray-50 admin-dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                >
                                    {columns.map((col) => {
                                        const value = blog[col.name];

                                        // STT
                                        if (col.name === "id") {
                                            return (
                                                <td key={col.name} className="px-3 sm:px-4 py-3 whitespace-nowrap">
                                                    {(currentPage - 1) * PAGE_SIZE + (index + 1)}
                                                </td>
                                            );
                                        }

                                        // Image column
                                        if (col.type === "image") {
                                            return (
                                                <td key={col.name} className="px-3 sm:px-4 py-3">
                                                    {value ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_MAIN_BE_URL}${value}`}
                                                            alt="blog"
                                                            className="max-w-[70px] h-auto object-cover rounded-lg border border-gray-200 admin-dark:border-gray-600"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/no-image.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src="/no-image.png"
                                                            alt="no-image"
                                                            className="max-w-[70px] h-auto object-cover rounded-lg border border-gray-200 admin-dark:border-gray-600"
                                                        />
                                                    )}
                                                </td>
                                            );
                                        }

                                        // Title column
                                        if (col.name === "title") {
                                            return (
                                                <td
                                                    key={col.name}
                                                    onClick={() => navigate(`${location.pathname}/${blog.id}/view`)}
                                                    className="px-3 sm:px-4 py-3 hover:text-blue-600 truncate max-w-[200px] cursor-pointer"
                                                >
                                                    {value}
                                                </td>
                                            );
                                        }

                                        // Content column
                                        if (col.name === "content") {
                                            let parsedValue = [];
                                            try {
                                                parsedValue =
                                                    typeof value === "string" && value.trim().startsWith("[")
                                                        ? JSON.parse(value)
                                                        : value;
                                            } catch {
                                                parsedValue = value;
                                            }

                                            const htmlContent = Array.isArray(parsedValue)
                                                ? renderSlateToHTML(parsedValue)
                                                : parsedValue;

                                            return (
                                                <td key={col.name} className="px-3 sm:px-4 py-3 text-gray-500 max-w-[300px]">
                                                    <div
                                                        className="prose prose-sm max-w-none line-clamp-2 break-words admin-dark:text-white text-[15px]"
                                                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                                                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                                                    />
                                                </td>
                                            );
                                        }

                                        // Date column
                                        if (col.type === "date") {
                                            return (
                                                <td key={col.name} className="px-3 sm:px-4 py-3">
                                                    {value ? new Date(value).toLocaleDateString("vi-VN") : "—"}
                                                </td>
                                            );
                                        }

                                        // Enum column
                                        if (col.type === "enum") {
                                            return (
                                                <td key={col.name} className="px-3 sm:px-4 py-3">
                                                    {value === "draft" ? (
                                                        <span className="text-yellow-600">Nháp</span>
                                                    ) : value === "published" ? (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-green-600">Công khai</span>
                                                            {blog.published_at && isFuture(blog.published_at) && <Clock size={14} />}
                                                        </div>
                                                    ) : (
                                                        value
                                                    )}
                                                </td>
                                            );
                                        }

                                        // Default column
                                        return (
                                            <td key={col.name} className="px-3 sm:px-4 py-3">
                                                {value}
                                            </td>
                                        );
                                    })}

                                    {/* Actions */}
                                    <td className="px-3 sm:px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition cursor-pointer"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition cursor-pointer"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="h-20">
                                <td
                                    colSpan={columns.length + 1}
                                    className="text-center text-gray-500 admin-dark:text-gray-400 text-sm"
                                >
                                    Không có bài viết nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination giống AdminZone */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-gray-500 admin-dark:text-gray-400 text-sm mt-6 gap-4 sm:gap-0">
                <div>
                    Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
                    {Math.min(currentPage * PAGE_SIZE, filteredBlogs.length)} trong tổng số {filteredBlogs.length}
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-300 admin-dark:border-gray-600 text-gray-700 admin-dark:text-gray-300 hover:bg-purple-100 admin-dark:hover:bg-gray-800 disabled:text-gray-300 admin-dark:disabled:text-gray-500 transition cursor-pointer"
                    >
                        &lt;
                    </button>
                    {[...Array(totalPages).keys()].map((num) => {
                        const isActive = currentPage === num + 1;
                        return (
                            <button
                                key={num + 1}
                                onClick={() => handlePageChange(num + 1)}
                                className={`w-7 h-7 rounded-full flex items-center justify-center border ${isActive
                                    ? "bg-blue-600 border-blue-600 text-white font-semibold shadow-lg admin-dark:bg-gray-400 admin-dark:border-gray-400 admin-dark:text-white"
                                    : "border-gray-300 admin-dark:border-gray-600 text-gray-700 admin-dark:text-gray-300 hover:bg-blue-100 admin-dark:hover:bg-gray-800"
                                    } transition cursor-pointer`}
                            >
                                {num + 1}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-300 admin-dark:border-gray-600 text-gray-700 admin-dark:text-gray-300 hover:bg-purple-100 admin-dark:hover:bg-gray-800 disabled:text-gray-300 admin-dark:disabled:text-gray-500 transition cursor-pointer"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
