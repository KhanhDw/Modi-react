import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ExternalLink } from "lucide-react"

export default function ArticleCard({ article }) {
    const tags = article.tags ? article.tags.split(",").map((tag) => tag.trim()) : []
    const excerpt = article.content.replace(/<[^>]*>/g, "").substring(0, 200) + "..."

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
            <CardContent className="p-6">
                {article.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                        <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{article.author_name}</span>
                        <Calendar className="w-4 h-4 ml-2" />
                        <span>{new Date(article.created_at).toLocaleDateString("vi-VN")}</span>
                        {article.platform_name && (
                            <>
                                <ExternalLink className="w-4 h-4 ml-2" />
                                <span
                                    className="px-2 py-1 rounded text-xs font-medium"
                                    style={{
                                        backgroundColor: article.platform_color || "#0891b2",
                                        color: "white",
                                    }}
                                >
                                    {article.platform_name}
                                </span>
                            </>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors font-[family-name:var(--font-space-grotesk)]">
                        {article.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed font-[family-name:var(--font-dm-sans)]">{excerpt}</p>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}