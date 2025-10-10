// src/hooks/useBlogs.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  extractBase64ImagesFromHTML,
  uploadMultipleImages,
  replaceBase64WithUrls,
  deleteUploadedImages,
} from "@/utils/imageHandler";
import { useImageManager } from "./useImageManager";
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
  const imageManager = useImageManager();
  const [uploading, setUploading] = useState(false);
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
      // ✅ Bước 1: Trích xuất base64 từ content hiện tại
      const currentBase64Images = extractBase64ImagesFromHTML(formData.content);

      // ✅ Bước 2: So sánh với ảnh đã upload để tìm ảnh cần xóa
      const imagesToDelete = imageManager.getUnusedImages();

      // ✅ Bước 3: Tìm ảnh mới cần upload (chưa có trong uploadedImages)
      const newBase64Images = currentBase64Images.filter(
        (img) => !imageManager.uploadedImages.has(img)
      );

      let finalContent = formData.content;
      let uploadedUrls = [];

      // ✅ Bước 4: Upload ảnh mới (nếu có)
      if (newBase64Images.length > 0) {
        setUploading(true);

        const uploadResults = await uploadMultipleImages(newBase64Images, 2); // 2 concurrent

        // Xử lý kết quả upload
        const successfulUploads = uploadResults.filter(
          (result) => result.success
        );
        const failedUploads = uploadResults.filter((result) => !result.success);

        // Cập nhật state với ảnh upload thành công
        successfulUploads.forEach(({ base64, url }) => {
          imageManager.markAsUploaded(base64, url);
          uploadedUrls.push(url);
        });

        // Thông báo ảnh upload thất bại
        if (failedUploads.length > 0) {
          console.warn("Some images failed to upload:", failedUploads);
          // Có thể cho user chọn: tiếp tục với ảnh lỗi hoặc dừng lại
          const shouldContinue = window.confirm(
            `${failedUploads.length} ảnh upload thất bại. Bạn vẫn muốn tiếp tục lưu?`
          );
          if (!shouldContinue) {
            setUploading(false);
            return;
          }
        }

        // ✅ Bước 5: Thay thế base64 bằng URLs trong content
        const replacements = successfulUploads.map(({ base64, url }) => ({
          base64,
          url,
        }));
        finalContent = replaceBase64WithUrls(formData.content, replacements);

        setUploading(false);
      }

      // ✅ Bước 6: Xóa ảnh không dùng nữa (trong background)
      if (imagesToDelete.length > 0) {
        // Không cần await - chạy background
        deleteUploadedImages(imagesToDelete).catch(console.error);
      }

      // ✅ Bước 7: Cập nhật used images
      imageManager.updateUsedImages(finalContent);

      // ✅ Bước 8: Gửi data lên server
      const formDataUpload = new FormData();

      if (!editingBlog) {
        formDataUpload.append("author_id", user?.id || 1);
      }

      formDataUpload.append("status", formData.status || "draft");
      formDataUpload.append("published_at", formData.published_at || "");

      formDataUpload.append(
        "translations",
        JSON.stringify([
          {
            lang: formData.lang ?? "vi",
            title: formData.title,
            content: finalContent,
          },
        ])
      );

      // Xử lý ảnh cover (giữ nguyên)
      if (file) {
        formDataUpload.append("image", file);
      } else if (!editingBlog) {
        setError("Ảnh cover là bắt buộc");
        return;
      }

      const method = editingBlog ? "PUT" : "POST";
      const url = editingBlog
        ? `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/${editingBlog.id}`
        : `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs`;

      const res = await fetch(url, { method, body: formDataUpload });

      if (!res.ok) throw new Error("Thao tác không thành công");

      // ✅ Bước 9: Cleanup sau khi save thành công
      await res.json();
      fetchBlogs();
      setShowForm(false);
      setEditingBlog(null);
      setError(null);
      navigate(-1);
    } catch (err) {
      console.error("Lỗi khi submit:", err);
      setError("Thao tác thất bại. Vui lòng kiểm tra dữ liệu.");
    } finally {
      setUploading(false);
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
