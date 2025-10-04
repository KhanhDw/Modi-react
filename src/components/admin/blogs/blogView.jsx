
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
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
                <p className="text-base sm:text-lg font-semibold text-gray-700 admin-dark:text-gray-300">
                    Đang tải dữ liệu...
                </p>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen admin-dark:bg-gray-900 px-4">
                <p className="text-base sm:text-lg text-red-600 admin-dark:text-red-400 mb-4">
                    {error}
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                >
                    <span className="text-sm sm:text-base font-semibold">Quay lại</span>
                </button>
            </div>
        );

    if (!blog)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 admin-dark:bg-gray-900">
                <p className="text-base sm:text-lg text-gray-600 admin-dark:text-gray-400">
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
        <div className="relative transition-all admin-dark:bg-gray-800 px-4 py-2 rounded-lg duration-300 min-h-screen">

            {/* Top bar: Back button và chọn ngôn ngữ */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => window.history.back()}
                    className="px-3 py-2 bg-gray-200/20 hover:bg-gray-200/70 admin-dark:bg-gray-700 text-gray-800 admin-dark:text-gray-200 rounded-lg shadow admin-dark:hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                >
                    <ChevronLeft />
                </button>

                {/* Language Switch */}
                <div className="flex space-x-2">
                    {["vi", "en"].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-4 py-2 rounded-md cursor-pointer font-bold transition-colors duration-200 ${lang === l
                                ? "bg-blue-600 text-white cursor-pointer"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
                                }`}
                        >
                            <span className="font-semibold">{l === "vi" ? "Việt" : "Anh"}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main content container */}
            <div className="mx-auto max-w-7xl rounded-lg overflow-hidden mt-4">
                <article className="mt-4">

                    {/* Header bài viết */}
                    <header className="mb-4 text-center">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 admin-dark:text-white leading-tight mb-4">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap gap-2 justify-center items-center text-gray-600 admin-dark:text-gray-400 text-xs sm:text-sm md:text-base">
                            <span className="font-medium">By: {blog.author_name || "Unknown"}</span>
                            <span className="mx-2">•</span>
                            <span>{formattedDate}</span>
                            {/* Nếu bạn muốn thêm platform tương tự đoạn đầu, có thể thêm ở đây */}
                        </div>
                    </header>

                    {/* Hình ảnh nổi bật */}
                    <div className="mb-8">
                        <img
                            src={blog.image ? `${import.meta.env.VITE_MAIN_BE_URL}${blog.image}` : "/no-image.png"}
                            alt={blog.title || "No Image"}
                            className="w-full max-h-96 object-cover rounded-lg shadow-md mx-auto"
                            onError={(e) => {
                                e.currentTarget.src = "/no-image.png";
                                e.currentTarget.onerror = null;
                            }}
                        />
                    </div>

                    {/* Nội dung bài viết */}
                    <section className="prose admin-dark:prose-invert max-w-none text-gray-800 admin-dark:text-gray-200 leading-relaxed mb-8 text-xs sm:text-sm md:text-base">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </section>

                </article>
            </div>
        </div>
    );

}

export default BlogViewPage;
