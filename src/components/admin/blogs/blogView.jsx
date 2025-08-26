import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
// Hàm chuyển Slate JSON sang HTML
export const renderSlateToHTML = (nodes) => {
    if (!Array.isArray(nodes)) return "";

    const renderNode = (node) => {
        if (node.text !== undefined) {
            let text = node.text;

            if (node.bold) text = `<strong>${text}</strong>`;
            if (node.italic) text = `<em>${text}</em>`;
            if (node.underline) text = `<u>${text}</u>`;
            if (node.code) text = `<code>${text}</code>`;

            return text;
        }

        const children = (node.children || []).map(renderNode).join("");

        switch (node.type) {
            case "paragraph":
                return `<p>${children}</p>`;
            case "block-quote":
                return `<blockquote style="margin:0;padding-left:8px;border-left:2px solid #ccc;">${children}</blockquote>`;
            case "numbered-list":
                return `<ol>${children}</ol>`;
            case "bulleted-list":
                return `<ul>${children}</ul>`;
            case "list-item":
                return `<li>${children}</li>`;
            default:
                return children;
        }
    };

    return nodes.map(renderNode).join("");
};

// Component hiển thị Blog Content
export const ShowContextBlog = ({ parsedContent }) => {
    let parsedValue = [];
    try {
        parsedValue =
            typeof parsedContent === "string"
                ? JSON.parse(parsedContent)
                : parsedContent;
    } catch (e) {
        console.error("JSON parse error:", e);
    }

    const htmlContent = renderSlateToHTML(parsedValue);

    return (
        <div
            className="prose max-w-none text-gray-800 leading-relaxed admin-dark:text-gray-200
        prose-p:text-inherit prose-strong:text-inherit prose-li:text-inherit prose-blockquote:text-inherit"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};


function BlogViewPage() {
    const { id } = useParams(); // lấy id từ URL: /blogs/:id
    const [blogs, setBlogs] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchBlogs = async (id) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_MAIN_BE_URL}/api/blogs/${id}`
            );

            if (!res.ok) throw new Error("Không thể tải dữ liệu");
            let result = await res.json();

            setBlogs(result); // dữ liệu từ API
            setError(null);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu:", err);
            setError("Không thể tải bài viết. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchBlogs(id);
    }, [id]);

    // Loading state
    if (loading) {
        return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
    }

    // Error state
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (!blogs) {
        return <div className="p-8 text-center">Không tìm thấy bài viết</div>;
    }

    // Format date
    const formattedDate = blogs.updated_at
        ? new Date(blogs.updated_at).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    return (
        <div className="relative">
            <div>
                <div className="mx-auto px-4 py-8">
                    {/* Blog Image */}
                    <div className="mb-8">
                        <img
                            src={`${import.meta.env.VITE_MAIN_BE_URL}${blogs.image}`}
                            alt={blogs.title}
                            className="w-full h-96 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Blog Content */}
                    <div className="bg-white admin-dark:bg-gray-800 rounded-lg shadow-md p-8">
                        {/* Title */}
                        <h1 className="text-4xl font-bold text-gray-900 admin-dark:text-gray-200 mb-4">
                            {blogs.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between mb-6 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium admin-dark:text-gray-200">
                                    By {blogs.author_name || "Unknown"}
                                </span>
                            </div>
                            <span>{formattedDate}</span>
                        </div>

                        {/* Content */}
                        {/* <div
                            className="prose max-w-none text-gray-800 leading-relaxed admin-dark:text-gray-200"
                            dangerouslySetInnerHTML={{ __html: blogs.content }}
                        /> */}

                        <ShowContextBlog parsedContent={blogs.content} />
                    </div>
                </div>

                <div className="absolute top-0 right-0 left-0">
                    <button
                        onClick={() => window.history.back()}
                        className="admin-dark:text-gray-200 inline-flex items-center p-4 bg-gray-600/40 text-white rounded-full hover:bg-gray-700 transition-colors"
                    >
                        <ChevronLeft />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BlogViewPage;
