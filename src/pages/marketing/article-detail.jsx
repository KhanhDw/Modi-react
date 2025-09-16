import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Share2 } from "lucide-react"
import { useParams } from 'react-router-dom';
import useCurrentLanguage from "@/hook/currentLang";

export default function ArticleDetail() {
    const { slug } = useParams();
    const { prefix } = useCurrentLanguage();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_MAIN_BE_URL}${prefix}/api/marketing/slug/${slug}`
                );
                if (!res.ok) throw new Error("Không thể tải dữ liệu");
                const data = await res.json();
                setPost(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchArticle();
    }, [slug, prefix]); // nhớ thêm prefix vào dependency


    if (loading) return <p className="min-h-screen flex justify-center items-center text-foreground dark:text-gray-300 font-semibold">Đang tải dữ liệu...</p>;
    if (error) return <p className="min-h-screen flex justify-center items-center text-red-500 dark:text-red-400 font-semibold">{error}</p>;
    if (!post) return <p className="min-h-screen flex justify-center items-center text-muted-foreground dark:text-gray-400 font-semibold">Không có dữ liệu.</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground dark:text-white leading-snug">
                    {post.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border dark:border-gray-700">
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{post.author_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                        </div>
                        {post.platform_name && (
                            <div className="flex items-center gap-2">
                                <span
                                    className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium"
                                    style={{
                                        backgroundColor: post.platform_color || "#0891b2",
                                        color: "white",
                                    }}
                                >
                                    {post.platform_name}
                                </span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 cursor-pointer self-start sm:self-auto"
                    >
                        <Share2 className="w-4 h-4" />
                        Chia sẻ
                    </Button>
                </div>
            </div>

            {/* Featured Image */}
            {post.image && (
                <div className="mb-6 sm:mb-8">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-sm"
                    />
                </div>
            )}

            {/* Content */}
            <Card className="mb-8 bg-white dark:bg-gray-900 border border-border dark:border-gray-700">
                <CardContent className="px-3">
                    <div
                        className="prose max-w-none text-gray-800 leading-relaxed dark:text-gray-200"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </CardContent>
            </Card>

        </div>
    );
}
