import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ExternalLink, Share2, BookOpen } from "lucide-react"
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function ArticleDetail() {

    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_MAIN_BE_URL}/api/marketing/${slug}`
                );
                if (!res.ok) throw new Error("Không thể tải dữ liệu11111");
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

    // const tags = post.tags
    //     ? post.tags.split(",").map((tag) => tag.trim())
    //     : [];

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!post) return <p>Không có dữ liệu.</p>;



    return (
        <div className="max-w-4xl mx-auto mt-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    {post.title}
                </h1>

                <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
            <Card className="mb-8">
                <CardContent className="p-8">
                    <div
                        className="prose prose-lg max-w-none leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </CardContent>
            </Card>

            {/* Tags
            {tags.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Thẻ bài viết</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="bg-muted hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    );
}
