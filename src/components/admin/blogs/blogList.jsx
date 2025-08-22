import PageHeader from "@/components/admin/common/PageHeader";
import BlogForm from "@/components/admin/blogForm/BlogForm";
import useBlogs from "@/hook/useBlogsAdmin";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BlogsListPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");

    const {
        blogs,
        columns,
        showForm,
        editingBlog,
        loading,
        error,
        currentPage,
        totalPages,
        paginatedBlogs,
        itemsPerPage,
        sortOrder,
        setBlogs,
        handleAdd,
        handleEdit,
        handleDelete,
        handleSubmit,
        handleCancel,
        toggleSortOrder,
        handlePageChange,
        setLoading,
        setEditingBlog,
        fetchBlogs,
    } = useBlogs();


    // Search API
    const handleSearch = async (keyword) => {
        setLoading(true);
        try {
            if (!keyword) {
                await fetchBlogs(); // nếu rỗng load tất cả
                return;
            } else if (keyword.trim() === "") {
                await fetchBlogs(); // nếu rỗng load tất cả
                return;
            } else if (keyword.trim().toLowerCase() === "nháp") {
                keyword = "draft";
            } else if (keyword.trim().toLowerCase() === "công khai") {
                keyword = "published";
            }

            const response = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/search?term=${encodeURIComponent(keyword)}`
            );
            if (!response.ok) throw new Error("API error");
            const data = await response.json();
            setBlogs(data);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };



    if (!blogs) {
        return <div>Đang tải...</div>;  // ✅ return sau hook
    }


    if (loading) return <div className="p-4 text-center text-green-800">Đang tải...</div>;
    if (error) return <div className="p-4 text-center text-red-600">{error}</div>;



    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title={showForm ? "Sửa tin tức" : "Quản lý tin tức"}
                    buttonText="Thêm tin tức"
                    onButtonClick={handleAdd}
                    toggleSortOrder={toggleSortOrder}
                    sortOrder={sortOrder}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    APISearch={handleSearch}
                    className="mb-4 sm:mb-6 w-full "
                />

            </div>


            <div className="flex flex-col">



                <div className=" rounded-xl shadow-lg overflow-x-auto border-2 border-green-200 admin-dark:border-gray-700">
                    <table className="min-w-full divide-y divide-green-200 admin-dark:divide-slate-600">
                        <thead className="bg-green-100 admin-dark:bg-slate-700 text-green-800 uppercase text-xs sm:text-sm">
                            <tr>
                                {columns.map(col => (
                                    <th key={col.name} className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-800 admin-dark:text-gray-200">{col.label}</th>
                                ))}
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold rounded-tr-xl text-gray-800 admin-dark:text-gray-200">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-green-200 admin-dark:divide-slate-600 admin-dark:bg-slate-800">
                            {paginatedBlogs.map((blog, index) => (
                                <tr
                                    key={blog.id || index}
                                    className="hover:bg-green-50 admin-dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 text-gray-800 admin-dark:text-gray-200"

                                >
                                    {/* để hiển thị được nội dung vui lòng: (BE) src\config\columns.config.js phải có name chính xác */}
                                    {columns.map((col) => {
                                        let value = blog[col.name];

                                        if (col.name === "id") {
                                            return (
                                                <td key={index} className="px-2 sm:px-4 py-2 text-xs sm:text-sm max-w-60 truncate whitespace-nowrap overflow-hidden">
                                                    {/* công thức số thứ tự nối tiếp */}
                                                    {(currentPage - 1) * itemsPerPage + (index + 1)}
                                                </td>
                                            );
                                        }

                                        // xử lý theo type
                                        if (col.type === "image") {
                                            return (
                                                <td key={col.name} className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                                                    {value ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_MAIN_BE_URL}${value}`}
                                                            alt="blog"
                                                            className="h-12 w-12 object-cover rounded"
                                                        />
                                                    ) : (
                                                        "Không có ảnh"
                                                    )}
                                                </td>
                                            );
                                        }

                                        if (col.name === "title") {
                                            return (
                                                <td onClick={() => navigate(`${location.pathname}/${blog.id}/view`)} key={col.name} className="hover:bg-gray-600 px-2 sm:px-4 py-2 text-xs sm:text-sm max-w-60 truncate whitespace-nowrap overflow-hidden">
                                                    {value}
                                                </td>
                                            );
                                        }


                                        if (col.name === "content") {
                                            return (
                                                <td key={col.name} className="px-2 sm:px-4 py-2 text-xs sm:text-sm max-w-60 truncate whitespace-nowrap overflow-hidden">
                                                    {value}
                                                </td>
                                            );
                                        }

                                        if (col.type === "date") {
                                            return (
                                                <td key={col.name} className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                                                    {value ? new Date(value).toLocaleDateString("vi-VN") : "—"}
                                                </td>
                                            );
                                        }

                                        if (col.type === "enum") {
                                            return (
                                                <td key={col.name} className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                                                    {value === "draft" ? "Nháp" : value === "published" ? "Công khai" : value}
                                                </td>
                                            );
                                        }

                                        return (
                                            <td key={col.name} className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                                                {value}
                                            </td>
                                        );
                                    })}

                                    {/* Cột hành động */}
                                    <td className="px-2 sm:px-4 py-2 text-center">
                                        <div className="flex justify-center space-x-1 sm:space-x-2">
                                            <button
                                                onClick={() => handleEdit(blog)}

                                                className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-xs sm:text-sm"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-xs sm:text-sm"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedBlogs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length + 1}
                                        className="px-2 w-full sm:px-4 py-2 sm:py-3 text-center text-green-600 italic text-xs sm:text-sm"
                                    >
                                        Không có bài viết nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-full sm:w-auto px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50 text-xs sm:text-sm"
                    >
                        Trước
                    </button>
                    <span className="text-green-800 text-xs sm:text-sm">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-full sm:w-auto px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50 text-xs sm:text-sm"
                    >
                        Sau
                    </button>
                </div>
            </div>

        </div>
    );
}