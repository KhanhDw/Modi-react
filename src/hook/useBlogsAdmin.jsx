// src/hooks/useBlogs.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function useBlogs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogsAdmin, setBlogsAdmin] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnsAdmin, setColumnsAdmin] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 10;

  // Gọi API lấy dữ liệu user (giữ nguyên logic gốc)
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Chưa có token, cần login trước");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
    } catch (err) {
      console.error("Lỗi lấy user:", err);
    }
  };

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
    if (
      !showForm ||
      window.confirm("Bạn có chắc chắn muốn rời khỏi trang này?")
    ) {
      navigate(path);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/all-admin`
      );
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
    fetchUser();
    fetchBlogs();
  }, [sortOrder]);

  const handleAdd = () => {
    // setEditingBlog(null); // Reset editingBlog để form trống
    // setShowForm(true);
    navigate(`${location.pathname}/new`);
  };

  const handleEdit = (blog) => {
    // setEditingBlog(blog); // Đặt blog cần sửa
    // setShowForm(true);
    navigate(`${location.pathname}/${blog.id}/edit`);
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
      // Chuẩn bị FormData
      const formDataUpload = new FormData();

      // Nếu là thêm mới → gắn author_id
      if (!editingBlog) {
        formDataUpload.append("author_id", user?.id || 1);
      }

      formDataUpload.append("status", formData.status || "draft");
      formDataUpload.append("published_at", formData.published_at || "");

      // Gắn translations (phải stringify)
      formDataUpload.append(
        "translations",
        JSON.stringify([
          {
            lang: formData.lang ?? "vi",
            title: formData.title,
            content: formData.content,
          },
        ])
      );

      const method = editingBlog ? "PUT" : "POST";

      // Gắn file ảnh nếu có
      if (file) {
        formDataUpload.append("image", file);
      } else {
        if (!editingBlog) {
          // 👈 chỉ khi thêm mới thì ép có ảnh
          setError("Ảnh là bắt buộc");
          return;
        }
      }

      const url = editingBlog
        ? `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/${editingBlog.id}`
        : `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs`;

      const res = await fetch(url, {
        method,
        body: formDataUpload, // 👈 Không set Content-Type, browser tự set multipart/form-data
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Error response:", errData);
        throw new Error("Thao tác không thành công");
      }

      await res.json();
      fetchBlogs();
      setShowForm(false);
      setEditingBlog(null);
      setError(null);
      navigate(-1);
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
    fetchBlogs,
    setBlogs,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCancel,
    setLoading,
    toggleSortOrder,
    setCurrentPage,
    handlePageChange,
    safeNavigate,
    setEditingBlog,
  };
}
