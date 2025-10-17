import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import viteCompression from "vite-plugin-compression";

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
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    ViteImageOptimizer({
      jpg: { quality: 70 },
      jpeg: { quality: 70 },
      png: { quality: 70 },
      webp: { quality: 70 },
      avif: { quality: 60 },
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
    target: "esnext",
    sourcemap: false,
    cssCodeSplit: true, // tách riêng CSS cho từng page
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
        // ✨ Giúp browser cache mạnh mẽ hơn
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
    minify: "terser", // tốt hơn esbuild cho prod
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // ⚡ Cache mạnh & preload tự động
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
});
