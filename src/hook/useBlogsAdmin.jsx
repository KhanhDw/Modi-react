// src/hooks/useBlogs.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [columns, setColumns] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");
    const itemsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        if (!showForm) return;

        // Chặn reload / đóng tab khi đang mở form
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [showForm]);

    // Hàm navigate có confirm
    const safeNavigate = (path) => {
        if (!showForm || window.confirm("Bạn có chắc chắn muốn rời khỏi trang này?")) {
            navigate(path);
        }
    };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/blogs`);
            if (!res.ok) throw new Error("Không thể tải dữ liệu");
            let result = await res.json();

            // lấy riêng ra
            const cols = result.colums;
            let blogsData = Array.isArray(result.data)
                ? result.data.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
                })
                : [];

            // set state
            setBlogs(blogsData);
            setColumns(cols);
            setError(null);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu:", err);
            setError("Không thể tải danh sách bài viết. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [sortOrder]);

    const handleAdd = () => {
        // setEditingBlog(null); // Reset editingBlog để form trống
        // setShowForm(true);
        navigate(`${location.pathname}/new`)
    };

    const handleEdit = (blog) => {
        // setEditingBlog(blog); // Đặt blog cần sửa
        // setShowForm(true);
        navigate(`${location.pathname}/${blog.id}/edit`)
    };

    const handleDelete = (id) => {
        if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
            fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/${id}`, {
                method: "DELETE",
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Xóa không thành công");
                    return res.json();
                })
                .then(() => fetchBlogs())
                .catch((err) => {
                    console.error("Lỗi khi xóa:", err);
                    setError("Xóa bài viết thất bại. Vui lòng thử lại.");
                });
        }
    };

    const handleSubmit = async (formData, file) => {
        try {
            let imageUrl = formData.img || editingBlog?.img || "";
            if (file) {
                const formDataUpload = new FormData();
                formDataUpload.append("image", file);
                const uploadRes = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/upload`, {
                    method: "POST",
                    body: formDataUpload,
                });
                if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }

            const blogData = { ...formData, img: imageUrl };
            const method = editingBlog ? "PUT" : "POST";
            const url = editingBlog
                ? `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/${editingBlog.id}`
                : `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blogData),
            });

            if (!res.ok) throw new Error("Thao tác không thành công");
            await res.json();
            fetchBlogs();
            setShowForm(false);
            setEditingBlog(null); // Reset sau khi submit
            setError(null);
        } catch (err) {
            console.error("Lỗi khi submit:", err);
            setError("Thao tác thất bại. Vui lòng kiểm tra dữ liệu.");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingBlog(null); // Reset khi hủy
    };

    const totalPages = Math.ceil(blogs.length / itemsPerPage);
    const paginatedBlogs = blogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return {
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
        handleAdd,
        handleEdit,
        handleDelete,
        handleSubmit,
        handleCancel,
        toggleSortOrder,
        setCurrentPage,
        handlePageChange,
        safeNavigate,
        setEditingBlog,
    };
}
