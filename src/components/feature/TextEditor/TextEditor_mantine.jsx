import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { Image, FileImage } from 'lucide-react';
import { MantineProvider, createTheme, rem, Button } from '@mantine/core';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image_tiptap from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import Placeholder from '@tiptap/extension-placeholder';
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useAdminTheme } from "@/contexts/ThemeLocalContext";
import debounce from "lodash.debounce";
// const content = `
//     <h2 style="text-align: center;">Welcome to Mantine Rich Text Editor</h2>
//     <p><code>RichTextEditor</code> with Tailwind styling:</p>
//     <img src="https://picsum.photos/300/200" alt="Sample image" />
//     <ul>
//         <li>Text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u></li>
//         <li>Headings with refined typography</li>
//         <li>Image support with hover effects</li>
//         <li>Seamless dark/light mode</li>
//     </ul>
// `;

export default function ThemedTextEditor({ valueContextNews = "<p>devvn</p>", onChange }) {
    const { isDark } = useAdminTheme();
    const [colorScheme, setColorScheme] = useState('light');
    const [content, setContent] = useState(valueContextNews);


    // tạo theme động, phụ thuộc vào colorScheme
    const theme = useMemo(
        () =>
            createTheme({
                autoContrast: true,
                focusRing: "auto",
                defaultRadius: "md",
                cursorType: "pointer",
                colors: {
                    adminPrimary: [
                        "#f0f9ff",
                        "#e0f2fe",
                        "#bae6fd",
                        "#7dd3fc",
                        "#38bdf8",
                        "#0ea5e9",
                        "#0284c7",
                        "#0369a1",
                        "#075985",
                        "#0c4a6e",
                    ],
                    adminDark: [
                        "#f8fafc",
                        "#f1f5f9",
                        "#e2e8f0",
                        "#cbd5e1",
                        "#94a3b8",
                        "#64748b",
                        "#475569",
                        "#334155",
                        "#1e293b",
                        "#0f172a",
                    ],
                },
                primaryColor: "adminPrimary",
                primaryShade: { light: 6, dark: 8 },
                fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
                headings: {
                    fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
                    fontWeight: "600",
                    sizes: {
                        h1: { fontSize: rem(32), lineHeight: "1.2" },
                        h2: { fontSize: rem(26), lineHeight: "1.3" },
                        h3: { fontSize: rem(22), lineHeight: "1.3" },
                        h4: { fontSize: rem(18), lineHeight: "1.4" },
                    },
                },
                spacing: {
                    xs: rem(8),
                    sm: rem(12),
                    md: rem(16),
                    lg: rem(20),
                    xl: rem(24),
                },
                components: {
                    RichTextEditor: {
                        styles: () => ({
                            content: {
                                borderRadius: '11px',
                                minHeight: rem(400),
                                color: colorScheme === "light" ? "#000" : "#ffff",
                                backgroundColor:
                                    colorScheme === "light" ? "#ffffff" : "#242424",
                            },
                        }),
                    },
                },
            }),
        [colorScheme] // <--- rebuild theme khi state đổi
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Nhập nội dung tại đây...' }),
            Dropcursor,
            Gapcursor,
            Image_tiptap.configure({
                HTMLAttributes: {
                    class: 'custom-image',
                },
                allowBase64: true,
            }),

        ],
        content: content,
    });


    useEffect(() => {
        setColorScheme(isDark ? 'dark' : 'light');
    }, [isDark]);

    const addImageFromUrl = () => {
        const url = prompt('Nhập URL ảnh:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addImageFromFile = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const src = e.target.result;
                    if (editor && src) {
                        editor.chain().focus().setImage({ src }).run();
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    return (
        <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme={colorScheme}>
            <div className="">
                <div className=" mx-auto">
                    <RichTextEditor
                        editor={editor}
                        className="border rounded-xl shadow-sm admin-dark:border-gray-700 admin-dark:bg-gray-800 bg-white"
                    >
                        <RichTextEditor.Toolbar
                            sticky
                            stickyOffset={60}
                            className="border-b border-gray-200 admin-dark:border-gray-700 bg-gray-50 admin-dark:bg-gray-900 flex flex-wrap gap-1 p-3 rounded-t-xl"
                        >
                            <RichTextEditor.ControlsGroup className="pr-2 border-r border-gray-200 admin-dark:border-gray-700">
                                <RichTextEditor.Bold className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Italic className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Underline className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Strikethrough className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.ClearFormatting className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Highlight className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Code className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup className="pr-2 border-r border-gray-200 admin-dark:border-gray-700">
                                <RichTextEditor.H1 className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.H2 className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.H3 className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.H4 className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup className="pr-2 border-r border-gray-200 admin-dark:border-gray-700">
                                <RichTextEditor.Blockquote className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Hr className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.BulletList className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.OrderedList className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Subscript className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Superscript className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup className="pr-2 border-r border-gray-200 admin-dark:border-gray-700">
                                <RichTextEditor.Link className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.Unlink className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup className="pr-2 border-r border-gray-200 admin-dark:border-gray-700">
                                <RichTextEditor.AlignLeft className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.AlignCenter className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.AlignJustify className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                                <RichTextEditor.AlignRight className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200" />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup className="pr-2 border-r border-gray-200 admin-dark:border-gray-700">
                                <RichTextEditor.Control
                                    onClick={addImageFromUrl}
                                    aria-label="Insert image from URL"
                                    title="Insert image from URL"
                                    className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200"
                                >
                                    <Image size={18} className='admin-dark:text-gray-500' />
                                </RichTextEditor.Control>
                                <RichTextEditor.Control
                                    onClick={addImageFromFile}
                                    aria-label="Upload image from file"
                                    title="Upload image from file"
                                    className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded transition-all duration-200"
                                >
                                    <FileImage size={18} className='admin-dark:text-gray-500' />
                                </RichTextEditor.Control>
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Undo className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded " />
                                <RichTextEditor.Redo className="hover:bg-gray-100 admin-dark:hover:bg-gray-700 text-gray-600 admin-dark:text-gray-200 p-2 rounded " />
                            </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                        <RichTextEditor.Content

                            className="min-h-[400px] bg-white admin-dark:bg-gray-800 text-gray-800 admin-dark:text-gray-100 border border-gray-200 admin-dark:border-gray-700 rounded-b-xl p-4" />
                    </RichTextEditor>

                    {/* đoạn code bên dưới chỉ dùng css thuần mới can thiệp được css bên các thẻ ở trên */}
                    {/* tailwind không thể nào can thiệp được! */}

                    <style >{` 
                        .ProseMirror {
                            @apply p-4 outline-none text-gray-800 admin-dark:text-gray-100;
                        }
                        .ProseMirror h1 {
                            @apply text-3xl font-bold text-gray-800 admin-dark:text-gray-100 my-6;
                        }
                        .ProseMirror h2 {
                            @apply text-2xl font-semibold text-gray-800 admin-dark:text-gray-100 my-5;
                        }
                        .ProseMirror h3 {
                            @apply text-xl font-semibold text-gray-800 admin-dark:text-gray-100 my-4;
                        }
                        .ProseMirror h4 {
                            @apply text-lg font-semibold text-gray-800 admin-dark:text-gray-100 my-3;
                        }
                        .ProseMirror p {
                            @apply mb-4 text-gray-700 admin-dark:text-gray-300;
                        }
                        .ProseMirror ul, .ProseMirror ol {
                            @apply mb-4 pl-8;
                        }
                        .ProseMirror ul {
                            @apply list-disc;
                        }
                        .ProseMirror ol {
                            @apply list-decimal;
                        }
                        .ProseMirror li {
                            @apply mb-2 text-gray-700 admin-dark:text-gray-300;
                        }
                        .ProseMirror code {
                            @apply bg-gray-100 admin-dark:bg-gray-900 text-gray-700 admin-dark:text-gray-200 px-2 py-1 rounded text-sm font-mono border border-gray-200 admin-dark:border-gray-700;
                        }
                        .ProseMirror blockquote {
                            @apply border-l-4 border-blue-500 admin-dark:border-blue-400 bg-gray-50 admin-dark:bg-gray-900 text-gray-700 admin-dark:text-gray-300 pl-4 py-2 my-4 rounded-r-md italic;
                        }
                        .ProseMirror a {
                            @apply text-blue-500 admin-dark:text-blue-400 underline hover:text-blue-600 admin-dark:hover:text-blue-300 transition-colors;
                        }
                        .ProseMirror img, .custom-image {
                            @apply max-w-full h-auto rounded-md my-4 shadow-sm hover:scale-102 transition-transform duration-200;
                        }
                        .ProseMirror mark {
                            @apply bg-yellow-100 admin-dark:bg-yellow-600 text-gray-800 px-1 rounded;
                        }
                        .ProseMirror hr {
                            @apply border-t border-gray-200 admin-dark:border-gray-700 my-6;
                        }
                        .ProseMirror p.is-empty::before {
                            color: #99999999;
                            content: 'Nhập nội dung...';
                            float: left;
                            pointer-events: none;
                            height: 0;
                        }
                    `}</style>
                </div>
            </div>
        </MantineProvider>
    );
}