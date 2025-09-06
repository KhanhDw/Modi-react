import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams } from "react-router-dom";

function BlogViewPage() {
    const { id } = useParams(); // lấy id từ URL: /blogs/:id
    const [blogs, setBlogs] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState("vi"); // ✅ mặc định tiếng Việt

    const fetchBlogs = async (id, lang) => {
        setLoading(true);
        try {
            const prefix = lang === "en" ? "/en" : "";
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}${prefix}/api/blogs/${id}`
            );

            if (!res.ok) throw new Error("Không thể tải dữ liệu");
            let result = await res.json();

            setBlogs(result); // dữ liệu từ API
            setError(null);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu:", err);
            setError("Không thể tải bài viết. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchBlogs(id, lang);
    }, [id, lang]); // ✅ gọi lại khi đổi ngôn ngữ

    // Loading state
    if (loading) {
        return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
    }

    // Error state
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (!blogs) {
        return <div className="p-8 text-center">Không tìm thấy bài viết</div>;
    }

    // Format date
    const formattedDate = blogs.updated_at
        ? new Date(blogs.updated_at).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    return (
        <div className="relative">
            <div>
                <div className="mx-auto px-4 py-8">
                    {/* Blog Image */}
                    <div className="mb-8">
                        <img
                            src={`${import.meta.env.VITE_MAIN_BE_URL}${blogs.image}`}
                            alt={blogs.title}
                            className="w-full h-96 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                                e.currentTarget.src = "/fallback.png";
                                e.currentTarget.onerror = null;
                            }}
                        />
                    </div>

                    {/* Blog Content */}
                    <div className="bg-white admin-dark:bg-gray-800 rounded-lg shadow-md p-8">
                        {/* Title */}
                        <h1 className="text-4xl font-bold text-gray-900 admin-dark:text-gray-200 mb-4">
                            {blogs.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between mb-6 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium admin-dark:text-gray-200">
                                    By {blogs.author_name || "Unknown"}
                                </span>
                            </div>
                            <span>{formattedDate}</span>
                        </div>

                        {/* Content */}
                        <div
                            className="prose max-w-none text-gray-800 leading-relaxed admin-dark:text-gray-200"
                            dangerouslySetInnerHTML={{ __html: blogs.content }}
                        />
                    </div>
                </div>

                {/* Back Button */}
                <div className="absolute top-0 left-0">
                    <button
                        onClick={() => window.history.back()}
                        className="admin-dark:text-gray-200 inline-flex items-center p-4 bg-gray-600/40 text-white rounded-full hover:bg-gray-700 transition-colors"
                    >
                        <ChevronLeft />
                    </button>
                </div>

                {/* Language Switch */}
                <div className="absolute top-0 right-0 flex space-x-2 p-4">
                    <button
                        onClick={() => setLang("en")}
                        className={`px-4 py-2 rounded-md font-bold transition-colors ${lang === "en"
                            ? "bg-purple-800 text-white border-2 admin-dark:border-white"
                            : "bg-gray-600/80 text-white hover:bg-gray-700"
                            }`}
                    >
                        <span className="font-semibold">Anh</span>
                    </button>
                    <button
                        onClick={() => setLang("vi")}
                        className={`px-4 py-2 rounded-md font-bold transition-colors ${lang === "vi"
                            ? "bg-purple-800 text-white border-2 admin-dark:border-white"
                            : "bg-gray-600/80 text-white hover:bg-gray-700"
                            }`}
                    >
                        <span className="font-semibold">Việt</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BlogViewPage;
