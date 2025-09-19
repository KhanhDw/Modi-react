
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Để hiển thị ngày tháng tiếng Việt
import { ChevronLeft } from 'lucide-react';


// Hàm render Slate JSON thành HTML (dùng Tailwind + admin-dark:)
export const renderSlateToHTML = (nodes) => {
    if (!Array.isArray(nodes)) return "";

    const renderNode = (node) => {
        if (node.text !== undefined) {
            let text = node.text;

            // Escape HTML characters để tránh XSS
            text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            if (node.bold) text = `<strong>${text}</strong>`;
            if (node.italic) text = `<em>${text}</em>`;
            if (node.underline) text = `<u>${text}</u>`;
            if (node.code) {
                text = `<code class="bg-slate-100 text-slate-800 px-1 rounded font-mono text-sm
                        admin-dark:bg-slate-800 admin-dark:text-slate-100">${text}</code>`;
            }

            return text;
        }

        const children = (node.children || []).map(renderNode).join("");

        // alignment => map ra class Tailwind
        const alignClass = node.align ? `text-${node.align}` : "";

        switch (node.type) {
            case "paragraph":
                return `<p class="my-2 leading-relaxed ${alignClass}">${children}</p>`;

            case "heading-one":
                return `<h1 class="text-2xl font-bold my-4 border-b border-slate-200 pb-2
                        admin-dark:border-slate-700 admin-dark:text-slate-200 ${alignClass}">${children}</h1>`;

            case "heading-two":
                return `<h2 class="text-xl font-semibold admin-dark:text-slate-200 my-3 ${alignClass}">${children}</h2>`;

            case "block-quote":
                return `<blockquote class="my-4 px-4 py-3 border-l-4 border-slate-400 bg-slate-50 italic text-slate-700 rounded-r
                        admin-dark:border-slate-500 admin-dark:bg-slate-800 admin-dark:text-slate-200 ${alignClass}">
                            ${children}
                        </blockquote>`;

            case "numbered-list":
                return `<ol class="my-4 pl-6 admin-dark:text-slate-200  list-decimal ${alignClass}">${children}</ol>`;

            case "bulleted-list":
                return `<ul class="my-4 pl-6 admin-dark:text-slate-200 list-disc ${alignClass}">${children}</ul>`;

            case "list-item":
                return `<li class="my-1 admin-dark:text-slate-200 ${alignClass}">${children}</li>`;

            default:
                return children;
        }
    };

    return nodes.map(renderNode).join("");
};


// Component hiển thị Blog Content
export const ShowContextBlog = ({ parsedContent }) => {
    let parsedValue = [];

    if (typeof parsedContent === "string") {
        try {
            parsedValue = JSON.parse(parsedContent);

            // Nếu JSON.parse thành công => SlateJS
            const htmlContent = renderSlateToHTML(parsedValue);
            return (
                <div
                    className="prose max-w-none text-gray-800 leading-relaxed admin-dark:text-gray-200
                    prose-p:text-inherit prose-strong:text-inherit prose-li:text-inherit prose-blockquote:text-inherit"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            );
        } catch (e) {
            // Nếu parse thất bại => chỉ là plain text
            return <p className="text-gray-800 admin-dark:text-gray-200">{parsedContent}</p>;
        }
    }

    // Nếu đã là object (Slate JSON)
    const htmlContent = renderSlateToHTML(parsedContent);
    return (
        <div
            className="prose max-w-none text-gray-800 leading-relaxed admin-dark:text-gray-200
            prose-p:text-inherit prose-strong:text-inherit prose-li:text-inherit prose-blockquote:text-inherit"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default function ViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageError, setImageError] = useState(false);
    const [lang, setLang] = useState("vi"); // ✅ mặc định tiếng Việt

    const fetchPostData = async () => {
        try {

            if (!id) {
                setError("Không tìm thấy ID bài viết.");
                setLoading(false);
                return;
            }


            setLoading(true);
            setImageError(false);
            const langPath = lang === 'en' ? `/${lang}` : "";
            const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}${langPath}/api/marketing/id/${id}`);
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


    useEffect(() => {
        if (id) fetchPostData(id, lang);
    }, [id, lang]); // ✅ gọi lại khi đổi ngôn ngữ


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
        <div className="relative bg-gray-50 admin-dark:bg-gray-900  transition-all duration-300">
            <div className="mx-auto  bg-white admin-dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <article className="p-8">
                    {/* Header bài viết */}
                    <header className="mb-4 mt-8 text-center">
                        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 admin-dark:text-white leading-tight mb-4">
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
                        {/* <div dangerouslySetInnerHTML={{ __html: post.content }} /> */}
                        {/* <ShowContextBlog parsedContent={post.content} /> */}
                        <div
                            className="prose max-w-none text-gray-800 leading-relaxed admin-dark:text-gray-200"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
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
            <div className="absolute top-0 left-0 border-gray-200 admin-dark:border-gray-700  ">
                <button
                    onClick={() => navigate(-1)}
                    className="px-3 py-2 bg-gray-200/20 hover:bg-gray-200/70 admin-dark:bg-gray-700 text-gray-800 admin-dark:text-gray-200 rounded-lg shadow  admin-dark:hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                >
                    <ChevronLeft />
                </button>
            </div>
            {/* Language Switch */}
            <div className="absolute top-0 right-0 flex space-x-2 p-4">
                <button
                    onClick={() => setLang("en")}
                    className={`px-4 py-2 rounded-md font-bold transition-colors ${lang === "en"
                        ? "bg-purple-800 text-white border-2 admin-dark:border-white cursor-pointer"
                        : "bg-gray-600/80 text-white hover:bg-gray-700 cursor-pointer"
                        }`}
                >
                    <span className="font-semibold">Anh</span>
                </button>
                <button
                    onClick={() => setLang("vi")}
                    className={`px-4 py-2 rounded-md font-bold transition-colors ${lang === "vi"
                        ? "bg-purple-800 text-white border-2 admin-dark:border-white cursor-pointer"
                        : "bg-gray-600/80 text-white hover:bg-gray-700 cursor-pointer"
                        }`}
                >
                    <span className="font-semibold">Việt</span>
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