// src/components/BlogViewPage.js
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function BlogViewPage() {
  const { slug } = useParams(); // Lấy slug từ URL để kiểm tra hoặc hiển thị
  const { state } = useLocation(); // Lấy đối tượng state
  const blogId = state?.blogId; // Lấy blogId từ state

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBlog = async (id) => {
    setLoading(true);
    try {
      // Sử dụng id từ state để fetch dữ liệu
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/${id}`
      );

      if (!res.ok) throw new Error("Không thể tải dữ liệu");
      let result = await res.json();

      setBlog(result);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setError("Không thể tải bài viết. Vui lòng thử lại.");
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chỉ fetch nếu có id trong state
    if (blogId) {
      fetchBlog(blogId);
    } else {
      // Xử lý khi không có id (ví dụ: truy cập trực tiếp URL)
      setError("Không tìm thấy ID bài viết. Vui lòng trở lại trang chủ.");
    }
  }, [blogId]);

  // ... (phần còn lại của JSX không thay đổi)
  if (loading) {
    return <div className="p-8 text-center dark:text-white">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="p-8 text-center dark:text-white">Không tìm thấy bài viết</div>;
  }

  // Format date
  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  return (
    <div className="relative">
      <div>
        <div className="mx-auto px-4 py-4">
          {/* Blog Image */}
          {/* <div className="mb-8">
            <img
              src={
                blog.image
                  ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.image}`
                  : "/no-image.png"
              }
              alt={blog.title}
              className="w-full h-100 object-cover rounded-lg shadow-md"
            />
          </div> */}

          {/* Blog Content */}
          <div className="bg-white admin-dark:bg-gray-800 rounded-lg shadow-md 
                p-4 xs:p-3 sm:p-4 md:p-6 lg:p-8">

            {/* Breadcrumb Header */}
            <div className="flex items-center space-x-2 mb-4">
              <div
                onClick={() => navigate(-1)}
                className="text-xs sm:text-sm md:text-base 
                 font-semibold text-black admin-dark:text-gray-300 
                 hover:underline flex items-center cursor-pointer"
              >
                Tin tức
              </div>
              <span className="text-gray-600">/</span>
              <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-[400px] 
                     text-xs sm:text-sm md:text-base font-medium 
                     text-gray-600 admin-dark:text-gray-200">
                {blog.title}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold 
                 text-gray-900 admin-dark:text-gray-200 mb-4">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                  mb-6 text-gray-600 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium admin-dark:text-gray-200">
                  By {blog.author_name || "Unknown"}
                </span>
              </div>
              <span className="text-sm sm:text-base">{formattedDate}</span>
            </div>

            {/* Content */}
            <div
              className="prose max-w-none text-gray-800 leading-relaxed 
               admin-dark:text-gray-200 text-justify 
               text-sm sm:text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default BlogViewPage;