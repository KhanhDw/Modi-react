import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Share2 } from "lucide-react"
import { useParams } from 'react-router-dom';

export default function ArticleDetail() {
    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/slug/${slug}`
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
    }, [slug]);

    if (loading) return <p className="text-foreground dark:text-gray-300">Đang tải dữ liệu...</p>;
    if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;
    if (!post) return <p className="text-muted-foreground dark:text-gray-400">Không có dữ liệu.</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-foreground dark:text-white">
                    {post.title}
                </h1>

                <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
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
                                    className="px-2 py-1 rounded text-xs font-medium"
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

                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Chia sẻ
                    </Button>
                </div>
            </div>

            {/* Featured Image */}
            {post.image && (
                <div className="mb-8">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-sm"
                    />
                </div>
            )}

            {/* Content */}
            <Card className="mb-8 bg-white dark:bg-gray-900 border border-border dark:border-gray-700">
                <CardContent className="p-8">
                    <div
                        className="prose prose-lg max-w-none leading-relaxed 
                                   text-foreground dark:text-gray-300
                                   prose-headings:text-foreground prose-headings:dark:text-white
                                   prose-a:text-blue-600 prose-a:dark:text-blue-400"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
