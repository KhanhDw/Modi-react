// src/pages/marketing/articles-list.jsx
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"; // Thêm hook useNavigate

export default function ArticlesList({ articles }) {
    // Khởi tạo hook điều hướng
    const navigate = useNavigate();

    // Hàm xử lý khi click vào bài viết
    const handleArticleClick = (slug) => {
        console.log(slug);
        navigate(`/marketing/${slug}`);
    };

    if (!articles.length) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Không có bài viết nào được tìm thấy.</p>
            </div>
        )
    }

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {articles.map((article) => (
                <div
                    key={article.id}
                    className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 break-inside-avoid mb-6 cursor-pointer"
                    // Thêm sự kiện onClick để gọi hàm điều hướng
                    onClick={() => handleArticleClick(article.slug)}
                >
                    {/* Article Image */}
                    <div className="bg-gray-100 overflow-hidden">
                        {article.image ? (
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-gray-400 text-4xl">📄</div>
                            </div>
                        )}
                    </div>

                    {/* Article Content */}
                    <div className="p-4 ">
                        {/* Platform Badge */}
                        {article.platform_name && (
                            <div className="mb-2 absolute top-0 left-0 right-0 flex items-center justify-end p-2 ">
                                <span
                                    className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full"
                                    style={{ backgroundColor: article.platform_color || "#6B7280" }}
                                >
                                    {article.platform_name}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">{article.title}</h3>

                        {/* Content Preview */}
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                            {article.content.replace(/<[^>]*>/g, "").substring(0, Math.floor(Math.random() * 100) + 80)}...
                        </p>

                        {/* Tags */}
                        {article.tags && (
                            <div className="mb-3">
                                <div className="flex flex-wrap gap-1">
                                    {article.tags
                                        .split(",")
                                        .slice(0, 3)
                                        .map((tag, index) => (
                                            <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                            <span className="font-medium">{article.author_name}</span>
                            <span>{new Date(article.created_at).toLocaleDateString("vi-VN")}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}