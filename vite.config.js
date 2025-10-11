import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      include: "**/*.svg?react",
      svgrOptions: {
        exportType: "named",
      },
    }),

    // 📊 Plugin hiển thị phân tích kích thước bundle
    visualizer({
      filename: "dist/stats.html", // nơi lưu file kết quả
      template: "treemap", // kiểu hiển thị: treemap, sunburst, network
      open: true, // tự động mở sau khi build
      gzipSize: true, // hiển thị kích thước gzip
      brotliSize: true, // hiển thị kích thước brotli
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  optimizeDeps: {
    include: ["lenis"],
  },

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("recharts")) return "vendor-recharts";
            if (id.includes("three")) return "vendor-three";
            if (id.includes("framer-motion")) return "vendor-motion";
            return "vendor";
          }
        },
      },
    },
  },
});
