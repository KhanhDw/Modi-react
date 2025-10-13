// src/components/BlogViewPage.js
import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useCurrentLanguage from "@/hook/currentLang";

function BlogViewPage() {
  const { slug } = useParams(); // Lấy slug từ URL để kiểm tra hoặc hiển thị
  const { state } = useLocation(); // Lấy đối tượng state
  const blogId = state?.blogId; // Lấy blogId từ state

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { prefix, lang } = useCurrentLanguage();

  const fetchBlog = async (id) => {
    setLoading(true);
    try {
      // Sử dụng id từ state để fetch dữ liệu
      const res = await fetch(
        `${import.meta.env.VITE_MAIN_BE_URL}${prefix}/api/blogs/${id}`
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
  }, [blogId, prefix]);

  if (loading) {
    return (
      <div className="text-center min-h-screen flex items-center justify-center flex-col">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {lang === "vi" ? "Đang load dữ liệu..." : "Loading data..."}
        </h3>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!blog) {
    return (
      <div className="text-center min-h-screen flex items-center justify-center flex-col">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {lang === "vi"
            ? "Hiện chưa tìm thấy tin tức!"
            : "No news articles found!"}
        </h3>
      </div>
    );
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
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <div className="mx-auto px-2 md:px-4 py-8">
          {/* Blog Image */}
          <div className="mb-8">
            {/* <img
              src={blog.image || "/placeholder.svg"}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            /> */}
            <img
              src={
                blog.image
                  ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.image}`
                  : "/no-image.png"
              }
              alt={blog.title}
              className="w-full h-[450px] xs:object-fill rounded-lg shadow-md"
            />
          </div>

          {/* Blog Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-5">
            {/* Title */}
            <div className="flex flex-col border-b-2 dark:border-gray-300 border-gray-700 mb-10">
              <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-200 mb-4">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center justify-between mb-6 text-gray-600 text-sm sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[21px]">
                <div className="flex items-center space-x-2">
                  <span className="font-medium dark:text-gray-200">
                    By {blog.author_name || "Unknown"}
                  </span>
                </div>
                <span className="dark:text-gray-200">{formattedDate}</span>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose max-w-none text-gray-800 leading-relaxed dark:text-gray-200 text-sm sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[21px]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>

        <div className="absolute top-0 right-0 left-0">
          <button
            onClick={() => navigate(-1)}
            className="admin-dark:text-gray-200 inline-flex items-center p-4 bg-gray-600/40 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <ChevronLeft />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogViewPage;
