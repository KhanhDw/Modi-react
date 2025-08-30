import { func } from 'prop-types';
import React, { useState, useEffect } from 'react';

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
                        admin-dark:border-slate-700 ${alignClass}">${children}</h1>`;

            case "heading-two":
                return `<h2 class="text-xl font-semibold my-3 ${alignClass}">${children}</h2>`;

            case "block-quote":
                return `<blockquote class="my-4 px-4 py-3 border-l-4 border-slate-400 bg-slate-50 italic text-slate-700 rounded-r 
                        admin-dark:border-slate-500 admin-dark:bg-slate-800 admin-dark:text-slate-200 ${alignClass}">
                            ${children}
                        </blockquote>`;

            case "numbered-list":
                return `<ol class="my-4 pl-6 list-decimal ${alignClass}">${children}</ol>`;

            case "bulleted-list":
                return `<ul class="my-4 pl-6 list-disc ${alignClass}">${children}</ul>`;

            case "list-item":
                return `<li class="my-1 ${alignClass}">${children}</li>`;

            default:
                return children;
        }
    };

    return nodes.map(renderNode).join("");
};


// Component hiển thị Blog Content
export default function ShowContextBlog({ parsedContent }) {
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