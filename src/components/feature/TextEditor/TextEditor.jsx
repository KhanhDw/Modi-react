import { MantineProvider, Button } from "@mantine/core";
import { forwardRef } from "react";
import TextEditor_mantine from "./TextEditor_mantine"; // editor Mantine/Tiptap
import TextEditor_slate from "./TextEditor_slate";     // editor Slate (nếu cần)

// 1️⃣ Editor wrapper: dùng forwardRef để cha có thể getHTML()
const TextEditorWrapper = forwardRef(({ valueContextNews = "" }, ref) => {
    return (
        <MantineProvider>
            <TextEditor_mantine ref={ref} valueContextNews={valueContextNews} />
        </MantineProvider>
    );
});

// 2️⃣ SubmitButton: tách riêng
const SubmitButton = ({ editorRef, onSubmit, label = "Lưu nội dung" }) => {
    const handleClick = () => {
        const html = editorRef.current?.getHTML();
        onSubmit(html);
    };

    return (
        <Button onClick={handleClick} color="blue">
            {label}
        </Button>
    );
};

export { TextEditorWrapper, SubmitButton };
