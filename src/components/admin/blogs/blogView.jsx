
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
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 admin-dark:bg-gray-900">
                <p className="text-xl font-semibold text-gray-700 admin-dark:text-gray-300">
                    Đang tải dữ liệu...
                </p>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 admin-dark:bg-gray-900 px-4">
                <p className="text-xl text-red-600 admin-dark:text-red-400 mb-4">
                    {error}
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                >
                    Quay lại
                </button>
            </div>
        );

    if (!blog)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 admin-dark:bg-gray-900">
                <p className="text-lg text-gray-600 admin-dark:text-gray-400">
                    Không tìm thấy bài viết
                </p>
            </div>
        );

    const formattedDate = blog.updated_at
        ? new Date(blog.updated_at).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    return (
        <div className="relative bg-gray-50 admin-dark:bg-gray-900 min-h-screen transition-all duration-300">
            <div className="mx-auto max-w-7xl bg-white admin-dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <article className="p-6 sm:p-10">
                    {/* Header */}
                    <header className="mb-8 mt-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 admin-dark:text-white leading-tight mb-4">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap justify-center items-center text-gray-600 admin-dark:text-gray-400 text-sm sm:text-base">
                            <span className="mr-2">
                                By {blog.author_name || "Unknown"}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{formattedDate}</span>
                        </div>
                    </header>

                    {/* Blog Image */}
                    <div className="mb-8">
                        <img
                            src={
                                blog.image
                                    ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.image}`
                                    : "/no-image.png"
                            }
                            alt={blog.title || "No Image"}
                            className="w-full max-h-96 object-cover rounded-lg shadow-md mx-auto"
                            onError={(e) => {
                                e.currentTarget.src = "/no-image.png";
                                e.currentTarget.onerror = null;
                            }}
                        />
                    </div>

                    {/* Content */}
                    <section className="prose admin-dark:prose-invert max-w-none text-gray-800 admin-dark:text-gray-200 leading-relaxed mb-8">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </section>
                </article>
            </div>

            {/* Back Button */}
            <div className="absolute top-2 left-4">
                <button
                    onClick={() => window.history.back()}
                    className="p-3 bg-gray-200/20 hover:bg-gray-200/70 admin-dark:bg-gray-700 admin-dark:hover:bg-gray-600 text-gray-800 admin-dark:text-gray-200 rounded-lg shadow transition-colors duration-300 cursor-pointer"
                >
                    <ChevronLeft />
                </button>
            </div>

            {/* Language Switch */}
            <div className="absolute top-2 right-4 flex space-x-2">
                {["vi", "en"].map((l) => (
                    <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-4 py-2 rounded-md font-bold transition-colors ${lang === l
                            ? "bg-purple-800 text-white border-2 admin-dark:border-white cursor-pointer"
                            : "bg-gray-600/80 text-white hover:bg-gray-700 cursor-pointer"
                            }`}
                    >
                        {l === "vi" ? "Việt" : "Anh"}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default BlogViewPage;
