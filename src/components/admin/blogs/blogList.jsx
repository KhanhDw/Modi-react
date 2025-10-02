import PageHeader from "@/components/admin/common/PageHeader";
import PageList from "@/components/feature/pagination.jsx"; // giả sử bạn có sẵn
import useBlogs from "@/hook/useBlogsAdmin";
import { isAfter, parseISO } from "date-fns";
import { Clock, Edit, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ========================== Helpers ==========================
export const isFuture = (dt) => {
    try {
        const date = typeof dt === "string" ? parseISO(dt) : new Date(dt);
        return isAfter(date, new Date());
    } catch {
        return false;
    }
};

export const removeAccents = (str) => {
    if (!str) return "";
    return str
        .normalize("NFD") // tách chữ và dấu
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .toLowerCase();
};

export const parseContentSafe = (value) => {
    try {
        return typeof value === "string" && value.trim().startsWith("[")
            ? JSON.parse(value)
            : value;
    } catch {
        return value;
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

// ========================== Component ==========================
export default function BlogsListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const PAGE_SIZE = 6;
    const [paginatedBlogs, setPaginatedBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const {
        blogs,
        columns,
        showForm,
        loading,
        error,
        handleAdd,
        handleEdit,
        handleDelete,
        toggleSortOrder,
        sortOrder,
        fetchBlogs,
    } = useBlogs();

    // Search logic
    const filteredBlogs = useMemo(() => {
        if (!blogs) return [];
        if (!searchTerm.trim()) return blogs;

        const term = removeAccents(searchTerm.trim());

        return blogs.filter((b) => {
            const title = removeAccents(b.title);
            let content = "";

            const parsed = parseContentSafe(b.content);
            if (Array.isArray(parsed)) {
                content = parsed
                    .map((n) => (n.text ? removeAccents(n.text) : ""))
                    .join(" ");
            } else {
                content = removeAccents(parsed);
            }

            return title.includes(term) || content.includes(term);
        });
    }, [searchTerm, blogs]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Loading / Error UI
    if (loading) return <div className="p-6 text-center text-green-700">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
    if (!blogs) return null;

    // Helper render status
    const renderStatus = (value, publishedAt) => {
        if (value === "draft") return <span className="text-yellow-600">Nháp</span>;
        if (value === "published")
            return (
                <div className="flex items-center gap-1">
                    <span className="text-green-600">Công khai</span>
                    {publishedAt && isFuture(publishedAt) && <Clock size={14} />}
                </div>
            );
        return value;
    };

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
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 admin-dark:border-gray-700 bg-white admin-dark:bg-gray-900 shadow-md transition-all duration-300">
                <table className="min-w-full border-collapse table-auto text-sm sm:text-base leading-6">
                    <thead className="sticky top-0 z-1">
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

                                        switch (col.type) {
                                            case "image":
                                                return (
                                                    <td key={col.name} className="px-3 sm:px-4 py-3">
                                                        <img
                                                            src={
                                                                value
                                                                    ? `${import.meta.env.VITE_MAIN_BE_URL}${value}`
                                                                    : "/no-image.png"
                                                            }
                                                            alt="blog"
                                                            className="max-w-[70px] h-auto object-cover rounded-lg border border-gray-200 admin-dark:border-gray-600"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/no-image.png";
                                                            }}
                                                        />
                                                    </td>
                                                );
                                            case "date":
                                                return (
                                                    <td key={col.name} className="px-3 sm:px-4 py-3">
                                                        {value ? new Date(value).toLocaleDateString("vi-VN") : "—"}
                                                    </td>
                                                );
                                            case "enum":
                                                return (
                                                    <td key={col.name} className="px-3 sm:px-4 py-3">
                                                        {renderStatus(value, blog.published_at)}
                                                    </td>
                                                );
                                            default:
                                                if (col.name === "id") {
                                                    return (
                                                        <td
                                                            key={col.name}
                                                            className="px-3 sm:px-4 py-3 whitespace-nowrap"
                                                        >
                                                            {(currentPage - 1) * PAGE_SIZE + (index + 1)}
                                                        </td>
                                                    );
                                                }
                                                if (col.name === "title") {
                                                    return (
                                                        <td
                                                            key={col.name}
                                                            onClick={() =>
                                                                navigate(`${location.pathname}/${blog.id}/view`)
                                                            }
                                                            className="px-3 sm:px-4 py-3 hover:text-blue-600 truncate max-w-[200px] cursor-pointer"
                                                        >
                                                            {value}
                                                        </td>
                                                    );
                                                }
                                                if (col.name === "content") {
                                                    const parsedValue = parseContentSafe(value);
                                                    const htmlContent = Array.isArray(parsedValue)
                                                        ? renderSlateToHTML(parsedValue)
                                                        : parsedValue;

                                                    return (
                                                        <td
                                                            key={col.name}
                                                            className="px-3 sm:px-4 py-3 text-gray-500 max-w-[300px]"
                                                        >
                                                            <div
                                                                className="preview-html prose prose-sm max-w-none line-clamp-2 break-words admin-dark:text-gray-500 text-[15px]"
                                                                style={{
                                                                    display: "-webkit-box",
                                                                    WebkitBoxOrient: "vertical",
                                                                    WebkitLineClamp: 2,
                                                                }}
                                                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                                                            />
                                                        </td>
                                                    );
                                                }
                                                return (
                                                    <td key={col.name} className="px-3 sm:px-4 py-3">
                                                        {value}
                                                    </td>
                                                );
                                        }
                                    })}

                                    {/* Actions */}
                                    <td className="px-3 sm:px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="flex items-center justify-center gap-1 px-3 py-2 border-2 border-gray-600
                          text-gray-700 hover:bg-blue-600 hover:text-white
                          admin-dark:text-gray-200 admin-dark:hover:bg-blue-700/80
                          rounded-lg text-xs transition cursor-pointer"
                                            >
                                                <Edit size={14} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className="flex items-center justify-center gap-1 px-3 py-2 border-2 border-gray-600
                          text-gray-700 hover:bg-red-600 hover:text-white
                          admin-dark:text-gray-200 admin-dark:hover:bg-red-700/80
                          rounded-lg text-xs transition cursor-pointer"
                                            >
                                                <Trash2 size={14} />
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
            <PageList
                data={filteredBlogs}
                pageSize={PAGE_SIZE}
                onPageChange={setPaginatedBlogs}
                onPageNumberChange={setCurrentPage}
            />
        </div>
    );
}
