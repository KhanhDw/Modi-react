// src/pages/marketing/articles-list.jsx
import React from "react"
import { useNavigate } from "react-router-dom"

export default function ArticlesList({ articles }) {
    const navigate = useNavigate()

    const handleArticleClick = (slug) => {
        navigate(`/marketing/${slug}`)
    }

    if (!articles.length) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground dark:text-gray-400 text-lg">
                    Không có bài viết nào được tìm thấy.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                <div
                    key={article.id}
                    className="relative flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 
                 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full cursor-pointer"
                    onClick={() => handleArticleClick(article.slug)}
                >
                    {/* Image */}
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        {article.image ? (
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                                <div className="text-gray-400 dark:text-gray-500 text-4xl">📄</div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-3 flex flex-col flex-1">
                        {/* Platform badge */}
                        {article.platform_name && (
                            <div className="mb-2 absolute top-0 left-0 right-0 flex items-center justify-end p-2">
                                <span
                                    className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full"
                                    style={{ backgroundColor: article.platform_color || "#6B7280" }}
                                >
                                    {article.platform_name}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 leading-tight">
                            {article.title}
                        </h3>

                        {/* Content preview */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 leading-relaxed flex-1">
                            {article.content.replace(/<[^>]*>/g, "")} ...
                        </p>

                        {/* Tags */}
                        {article.tags && (
                            <div className="mb-3">
                                <div className="flex flex-wrap gap-1">
                                    {article.tags
                                        .split(",")
                                        .slice(0, 5)
                                        .map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                                            >
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <span className="font-medium">{article.author_name}</span>
                            <span>{new Date(article.created_at).toLocaleDateString("vi-VN")}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    )
}
