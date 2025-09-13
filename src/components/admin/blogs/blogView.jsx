import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams } from "react-router-dom";

function BlogViewPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lang, setLang] = useState("vi");

    const fetchBlog = async (id, lang) => {
        setLoading(true);
        try {
            const prefix = lang === "en" ? "/en" : "";
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}${prefix}/api/blogs/${id}`
            );

            if (!res.ok) throw new Error("Không thể tải dữ liệu");
            const data = await res.json();
            setBlog(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Không thể tải bài viết. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchBlog(id, lang);
    }, [id, lang]);

    if (loading)
        return <div className="p-8 text-center text-gray-700">Đang tải dữ liệu...</div>;
    if (error)
        return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!blog)
        return <div className="p-8 text-center text-gray-500">Không tìm thấy bài viết</div>;

    const formattedDate = blog.updated_at
        ? new Date(blog.updated_at).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    return (
        <div className="relative bg-gray-50 admin-dark:bg-gray-900 min-h-screen rounded-xl">
            {/* Back Button */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center p-2 sm:p-3 bg-gray-700/70 hover:bg-gray-800 text-white rounded-full transition cursor-pointer"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            {/* Language Switch */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex space-x-2 z-20">
                {["vi", "en"].map((l) => (
                    <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm md:text-base transition-colors ${lang === l
                            ? "bg-purple-800 text-white border-2 admin-dark:border-white cursor-pointer"
                            : "bg-gray-600/80 text-white hover:bg-gray-700 cursor-pointer"
                            }`}
                    >
                        {l === "vi" ? "Việt" : "Anh"}
                    </button>
                ))}
            </div>

            <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
                {/* Blog Image */}
                <div className="w-full h-64 sm:h-80 md:h-[28rem] mt-4 rounded-lg overflow-hidden shadow-lg bg-gray-100 admin-dark:bg-gray-700 flex items-center justify-center">
                    <img
                        src={
                            blog.image
                                ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.image}`
                                : "/no-image.png"
                        }
                        alt={blog.title || "No Image"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = "/no-image.png"; // fallback nếu load lỗi
                            e.currentTarget.onerror = null;
                        }}
                    />
                </div>

                {/* Blog Content */}
                <div className="bg-white admin-dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 space-y-6">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 admin-dark:text-gray-200 text-center">
                        {blog.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-600 admin-dark:text-gray-400 text-xs sm:text-sm md:text-base space-y-2 sm:space-y-0">
                        <span>By {blog.author_name || "Unknown"}</span>
                        <span>{formattedDate}</span>
                    </div>

                    <div
                        className="w-full text-base sm:text-lg text-gray-800 admin-dark:text-gray-200 leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                </div>
            </div>
        </div>

    );
}

export default BlogViewPage;
