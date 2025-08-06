import React, { Fragment, useMemo } from 'react';

// Component này nhận vào một prop là chuỗi JSON từ CSDL
const SlateContentRenderer = ({ jsonContent }) => {

    // Phân tích chuỗi JSON thành một mảng các đối tượng Slate.
    // Dùng useMemo để tránh parse lại mỗi lần re-render không cần thiết.
    const nodes = useMemo(() => {
        try {
            if (!jsonContent) return [];
            const parsed = JSON.parse(jsonContent);
            // Đảm bảo dữ liệu là một mảng
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Error parsing Slate JSON content:", error);
            // Nếu lỗi, hiển thị nội dung như văn bản thường để không mất dữ liệu
            return [{ type: 'paragraph', children: [{ text: jsonContent }] }];
        }
    }, [jsonContent]);

    // Hàm để render từng "lá" (phần văn bản có định dạng)
    const renderLeaf = (leaf, key) => {
        let children = <>{leaf.text}</>;

        if (leaf.bold) {
            children = <strong>{children}</strong>;
        }
        if (leaf.italic) {
            children = <em>{children}</em>;
        }
        if (leaf.underline) {
            children = <u>{children}</u>;
        }
        if (leaf.code) {
            children = <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>;
        }

        return <Fragment key={key}>{children}</Fragment>;
    };

    // Hàm để render từng "phần tử" (khối như paragraph, heading...)
    const renderElement = (element, key) => {
        const children = element.children?.map((leaf, i) => renderLeaf(leaf, `${key}-${i}`)) || null;
        const style = { textAlign: element.align };

        switch (element.type) {
            case 'heading-one':
                return <h1 key={key} style={style} className="text-3xl font-bold my-4">{children}</h1>;
            case 'heading-two':
                return <h2 key={key} style={style} className="text-2xl font-semibold my-3">{children}</h2>;
            case 'block-quote':
                return <blockquote key={key} style={style} className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">{children}</blockquote>;
            case 'numbered-list':
                return <ol key={key} style={style} className="list-decimal list-inside my-4">{children}</ol>;
            case 'bulleted-list':
                return <ul key={key} style={style} className="list-disc list-inside my-4">{children}</ul>;
            case 'list-item':
                return <li key={key} style={style} className="my-1">{children}</li>;
            default: // Mặc định là 'paragraph'
                return <p key={key} style={style} className="my-2">{children}</p>;
        }
    };

    return (
        <div>
            {nodes.map((node, i) => renderElement(node, i))}
        </div>
    );
};

export default SlateContentRenderer;