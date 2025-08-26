import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Transforms, Editor, Element as SlateElement, Text, Range, Node } from "slate";
import { ReactEditor, Slate, Editable, withReact, useSlate } from "slate-react";
import {
    Bold,
    Italic,
    Underline,
    Code,
    List,
    ListOrdered,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Type,
    Minus
} from "lucide-react";

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right']

const CustomEditor = {
    // Mark functions
    isMarkActive(editor, format) {
        // Bọc trong try...catch để xử lý lỗi tạm thời
        try {
            const marks = Editor.marks(editor);
            return marks ? marks[format] === true : false;
        } catch (e) {
            // Lỗi này có thể xảy ra khi selection không đồng bộ tạm thời.
            // Trả về false là an toàn nhất.
            return false;
        }
    },

    toggleMark(editor, format) {
        const isActive = CustomEditor.isMarkActive(editor, format);
        if (isActive) {
            Editor.removeMark(editor, format);
        } else {
            Editor.addMark(editor, format, true);
        }
    },

    // Block functions
    isBlockActive(editor, format, blockType = 'type') {
        const { selection } = editor;
        if (!selection) return false;

        // Bọc trong try...catch để xử lý lỗi tạm thời
        try {
            const [match] = Array.from(
                Editor.nodes(editor, {
                    at: Editor.unhangRange(editor, selection),
                    match: n =>
                        !Editor.isEditor(n) &&
                        SlateElement.isElement(n) &&
                        n[blockType] === format,
                })
            );

            return !!match;
        } catch (e) {
            // Lỗi này có thể xảy ra khi selection không đồng bộ tạm thời.
            // Trả về false là an toàn nhất.
            return false;
        }
    },

    toggleBlock(editor, format) {
        // ... hàm này không thay đổi
        const isActive = CustomEditor.isBlockActive(
            editor,
            format,
            TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
        )
        const isList = LIST_TYPES.includes(format)

        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes(n.type) &&
                !TEXT_ALIGN_TYPES.includes(format),
            split: true,
        })

        let newProperties
        if (TEXT_ALIGN_TYPES.includes(format)) {
            newProperties = {
                align: isActive ? undefined : format,
            }
        } else {
            newProperties = {
                type: isActive ? 'paragraph' : isList ? 'list-item' : format,
            }
        }

        Transforms.setNodes(editor, newProperties)

        if (!isActive && isList) {
            const block = { type: format, children: [] }
            Transforms.wrapNodes(editor, block)
        }
    },
};

const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: 'Chào mừng đến với Text Editor! Hãy thử các chức năng định dạng văn bản.' }],
    },
    {
        type: 'paragraph',
        children: [
            { text: 'Bạn có thể làm cho văn bản ' },
            { text: 'đậm', bold: true },
            { text: ', ' },
            { text: 'nghiêng', italic: true },
            { text: ', ' },
            { text: 'gạch chân', underline: true },
            { text: ', hoặc ' },
            { text: 'code', code: true },
            { text: '.' },
        ],
    },
]

function TextEditor({ valueContextNews = '', onChange }) {
    const [editor] = useState(() => withReact(createEditor()))

    const initialValue = useMemo(() => {
        if (!valueContextNews) {
            // Nếu không có dữ liệu
            return [{ type: 'paragraph', children: [{ text: '' }] }];
        }

        // Nếu là chuỗi JSON hợp lệ
        try {
            const parsed = JSON.parse(valueContextNews);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            // Nếu không parse được => coi như plain text
            return [{ type: 'paragraph', children: [{ text: valueContextNews }] }];
        }

        // fallback
        return [{ type: 'paragraph', children: [{ text: '' }] }];
    }, [valueContextNews]);


    // CẢNH BÁO: Dòng này vẫn còn tiềm ẩn lỗi logic như đã giải thích ở câu trả lời trước.
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);



    const handleChange = (newValue) => {
        setValue(newValue);

        // Dòng này rất hữu ích để ngăn việc gọi `onChange` liên tục
        // mỗi khi bạn chỉ di chuyển con trỏ mà không thay đổi nội dung.
        const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
        );

        // Chỉ kích hoạt việc lưu khi có thay đổi thực sự về nội dung
        if (isAstChange) {
            // 1. Chuyển đổi cấu trúc Slate thành một chuỗi JSON
            const jsonValue = JSON.stringify(newValue);

            // 2. Gửi chuỗi JSON này lên component cha.
            //    LƯU Ý: chúng ta đang sử dụng `jsonValue`, không phải `plainText`.
            onChange?.({ target: { value: jsonValue } });
        }
    };


    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    return (
        <div className="border rounded-lg p-4 shadow bg-white w-full mx-auto admin-dark:bg-slate-800 admin-dark:text-gray-300">
            <Slate
                // key={editorKey}
                editor={editor}
                initialValue={initialValue}
                value={value}
                onChange={handleChange}
            >
                <Toolbar />
                <Editable
                    className="mt-4 p-4 border rounded min-h-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 admin-dark:bg-slate-800 admin-dark:text-gray-300"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Nhập nội dung tại đây..."
                    spellCheck
                    onKeyDown={event => {
                        if (!event.ctrlKey) return

                        switch (event.key) {
                            case 'b': {
                                event.preventDefault()
                                CustomEditor.toggleMark(editor, 'bold')
                                break
                            }
                            case 'i': {
                                event.preventDefault()
                                CustomEditor.toggleMark(editor, 'italic')
                                break
                            }
                            case 'u': {
                                event.preventDefault()
                                CustomEditor.toggleMark(editor, 'underline')
                                break
                            }
                            case '`': {
                                event.preventDefault()
                                CustomEditor.toggleMark(editor, 'code')
                                break
                            }
                        }
                    }}
                />
            </Slate>
        </div>
    )
}

const Toolbar = () => {
    const editor = useSlate()

    const MarkButton = ({ format, icon: Icon }) => (
        <button
            className={`p-2 rounded admin-dark:text-gray-300 hover:bg-gray-200 ${CustomEditor.isMarkActive(editor, format)
                ? 'bg-gray-300 text-gray-800'
                : 'text-gray-600'
                }`}
            onMouseDown={event => {
                event.preventDefault()
                CustomEditor.toggleMark(editor, format)
            }}
        >
            <Icon size={18} />
        </button>
    )

    const BlockButton = ({ format, icon: Icon }) => (
        <button
            className={`p-2 rounded admin-dark:text-gray-300 hover:bg-gray-200 ${CustomEditor.isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
            )
                ? 'bg-gray-300 text-gray-800'
                : 'text-gray-600'
                }`}
            onMouseDown={event => {
                event.preventDefault()
                CustomEditor.toggleBlock(editor, format)
            }}
        >
            <Icon size={18} />
        </button>
    )

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b admin-dark:bg-slate-800 admin-dark:text-gray-400">
            {/* Text formatting */}
            <div className="flex gap-1 mr-4">
                <MarkButton format="bold" icon={Bold} />
                <MarkButton format="italic" icon={Italic} />
                <MarkButton format="underline" icon={Underline} />
                <MarkButton format="code" icon={Code} />
            </div>

            {/* Block types */}
            <div className="flex gap-1 mr-4">
                <BlockButton format="heading-one" icon={Type} />
                <BlockButton format="heading-two" icon={Type} />
                <BlockButton format="block-quote" icon={Quote} />
            </div>

            {/* Lists */}
            <div className="flex gap-1 mr-4">
                <BlockButton format="numbered-list" icon={ListOrdered} />
                <BlockButton format="bulleted-list" icon={List} />
            </div>

            {/* Alignment */}
            <div className="flex gap-1">
                <BlockButton format="left" icon={AlignLeft} />
                <BlockButton format="center" icon={AlignCenter} />
                <BlockButton format="right" icon={AlignRight} />
            </div>
        </div>
    )
}

const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align }

    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote
                    {...attributes}
                    style={style}
                    className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4"
                >
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul {...attributes} style={style} className="list-disc list-inside my-4">
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h1 {...attributes} style={style} className="text-3xl font-bold my-4">
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 {...attributes} style={style} className="text-2xl font-semibold my-3">
                    {children}
                </h2>
            )
        case 'list-item':
            return (
                <li {...attributes} style={style} className="my-1">
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol {...attributes} style={style} className="list-decimal list-inside my-4">
                    {children}
                </ol>
            )
        default:
            return (
                <p {...attributes} style={style} className="my-2">
                    {children}
                </p>
            )
    }
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                {children}
            </code>
        )
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

export default TextEditor