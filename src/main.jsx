import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "./index.css";
import App from "./app/App.jsx";

// tắt stricMode tạm thời trong dev
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
