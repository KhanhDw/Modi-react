import PageHeader from "../../components/admin/common/PageHeader";
import BlogForm from "../../components/admin/blogs/BlogForm";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/layout/partials/ThemeToggle";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 10;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/blogs`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu");
      let data = await res.json();
      data = Array.isArray(data) ? data.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }) : [];
      setBlogs(data);
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
    setEditingBlog(null); // Reset editingBlog để form trống
    setShowForm(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog); // Đặt blog cần sửa
    setShowForm(true);
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

  if (loading) return <div className="p-4 text-center text-green-800">Đang tải...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="rounded-lg p-2 sm:p-4 md:p-6 min-h-screen bg-gray-100">
      <PageHeader
        title="Quản lý bài viết"
        buttonText="Thêm bài viết"
        onButtonClick={handleAdd}
        className="mb-4 sm:mb-6"
      />

      {showForm && (
        <div className="mb-4 sm:mb-6 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-200">
          <BlogForm
            blog={editingBlog}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={toggleSortOrder}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
          Sắp xếp theo ngày ({sortOrder === "asc" ? "Cũ nhất" : "Mới nhất"})
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-green-200">
        <table className="min-w-full divide-y divide-green-200">
          <thead className="bg-green-100 text-green-800 uppercase text-xs sm:text-sm">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold rounded-tl-xl">ID</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold">Tiêu đề</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold hidden sm:table-cell">Ảnh</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold hidden md:table-cell">Ngày đăng</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold rounded-tr-xl">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-200">
            {paginatedBlogs.map((blog, index) => (
              <tr
                key={blog.id || index}
                className="hover:bg-green-50 transition-colors duration-200"
              >
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-green-900 text-xs sm:text-sm">
                  {blog.id}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-green-900 text-xs sm:text-sm">
                  {blog.title}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-green-800 text-xs sm:text-sm hidden sm:table-cell">
                  {blog.img ? (
                    <img src={`${import.meta.env.VITE_MAIN_BE_URL}${blog.img}`} alt="blog" className="h-12 w-12 object-cover rounded" />
                  ) : (
                    "Không có ảnh"
                  )}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-green-800 text-xs sm:text-sm hidden md:table-cell">
                  {blog.published_at ? new Date(blog.published_at).toLocaleDateString("vi-VN") : "Chưa đăng"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
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
                  colSpan="5"
                  className="px-2 sm:px-4 py-2 sm:py-3 text-center text-green-600 italic text-xs sm:text-sm"
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
  );
}