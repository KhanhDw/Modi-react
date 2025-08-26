import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Để hiển thị ngày tháng tiếng Việt
import { ChevronLeft } from 'lucide-react';

export default function ViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("Không tìm thấy ID bài viết.");
            setLoading(false);
            return;
        }

        const fetchPostData = async () => {
            try {
                setLoading(true);
                setImageError(false);
                const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/${id}`);
                if (!res.ok) {
                    throw new Error(`Không thể tải dữ liệu: ${res.statusText}`);
                }
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error("Lỗi khi tải bài viết:", err);
                setError("Không thể tải bài viết. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
    }, [id]);

    const handleImageError = () => {
        setImageError(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 admin-dark:bg-gray-900">
                <div className="text-xl font-semibold text-gray-700 admin-dark:text-gray-300">Đang tải bài viết...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
                <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error || "Không tìm thấy bài viết."}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
                >
                    Quay về Trang chủ
                </button>
            </div>
        );
    }

    // Format ngày tháng
    const createdAt = post.created_at ? format(new Date(post.created_at), "PPP", { locale: vi }) : "N/A";

    return (
        <div className="min-h-screen relative bg-gray-50 admin-dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8  transition-all duration-300">
            <div className="max-w-4xl mx-auto bg-white admin-dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                <article className="p-8">
                    {/* Header bài viết */}
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 admin-dark:text-white leading-tight mb-4">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap justify-center items-center text-gray-600 admin-dark:text-gray-400 text-sm">
                            <span className="font-medium mr-2">Bởi: {post.author_name || "Ẩn danh"}</span>
                            <span className="mx-2">•</span>
                            <span>{createdAt}</span>
                            {post.platform_name && (
                                <>
                                    <span className="mx-2">•</span>
                                    <span
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: post.platform_color || "#e0f2fe", // Màu mặc định nếu không có
                                            color: getContrastColor(post.platform_color || "#e0f2fe") // Tự động chọn màu chữ tương phản
                                        }}
                                    >
                                        {post.platform_name}
                                    </span>
                                </>
                            )}
                        </div>
                    </header>

                    {/* Hình ảnh nổi bật hoặc thông báo lỗi */}
                    <div className="mb-8">
                        {post.image && !imageError ? ( // Chỉ hiển thị img nếu có post.image và không có lỗi
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full max-h-96 object-cover rounded-lg shadow-md mx-auto"
                                onError={handleImageError} // Gọi hàm handleImageError khi có lỗi
                            />
                        ) : (
                            <div className="w-full max-h-96 flex items-center justify-center bg-gray-200 admin-dark:bg-gray-700 rounded-lg shadow-md text-gray-600 admin-dark:text-gray-300 text-lg font-medium">
                                Không tìm thấy ảnh hoặc ảnh bị lỗi
                            </div>
                        )}
                    </div>

                    {/* Nội dung bài viết */}
                    <section className="prose admin-dark:prose-invert max-w-none text-gray-800 admin-dark:text-gray-200 leading-relaxed mb-8">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </section>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <footer className="pt-6 border-t border-gray-200 admin-dark:border-gray-700 mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 admin-dark:text-white mb-3">Tags:</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.split(',').map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 admin-dark:bg-blue-800 text-blue-800 admin-dark:text-blue-100 rounded-full text-sm font-medium hover:bg-blue-200 admin-dark:hover:bg-blue-700 transition-colors cursor-pointer"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </footer>
                    )}
                </article>

            </div>
            <div className=" border-gray-200 admin-dark:border-gray-700 absolute top-0 left-0 right-0 bottom-0 ">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-gray-200 admin-dark:bg-gray-700 text-gray-800 admin-dark:text-gray-200 rounded-lg shadow hover:bg-gray-300 admin-dark:hover:bg-gray-600 transition-colors duration-300"
                >
                    <ChevronLeft />
                </button>
            </div>
        </div>
    );
}

// Hàm trợ giúp để lấy màu chữ tương phản (đen hoặc trắng) dựa trên màu nền
function getContrastColor(hexcolor) {
    if (!hexcolor || hexcolor.length < 6) return '#000000'; // Default to black

    const r = parseInt(hexcolor.substr(1, 2), 16);
    const g = parseInt(hexcolor.substr(3, 2), 16);
    const b = parseInt(hexcolor.substr(5, 2), 16);
    const y = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (y >= 128) ? '#000000' : '#FFFFFF';
}