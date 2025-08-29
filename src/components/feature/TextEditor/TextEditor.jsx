import React, { forwardRef } from "react";
import { MantineProvider } from "@mantine/core";
import TextEditor_mantine from "./TextEditor_mantine";

const TextEditorWrapper = forwardRef(({ value }, ref) => {


    return (
        <MantineProvider>
            <TextEditor_mantine ref={ref} valueContextNews={value} />

        </MantineProvider>
    );
});

export default TextEditorWrapper;
