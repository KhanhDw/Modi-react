import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import svgr from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  // ✅ Base path cho Netlify (để build ra link tương đối)
  base: "./",

  plugins: [
    // React + Tailwind
    react(),
    tailwindcss(),

    // SVG thành React component
    svgr({
      include: "**/*.svg?react",
      svgrOptions: { exportType: "named" },
    }),

    // ✅ Tự động nén file JS/CSS (gzip + brotli)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),

    // ✅ Tối ưu hình ảnh khi build
    ViteImageOptimizer({
      jpg: { quality: 70 },
      jpeg: { quality: 70 },
      png: { quality: 70 },
      webp: { quality: 70 },
      avif: { quality: 60 },
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  optimizeDeps: {
    include: ["lenis"], // hoặc các lib bạn dùng
  },

  build: {
    target: "esnext",
    sourcemap: false,
    cssCodeSplit: true, // tách riêng CSS cho từng page
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      output: {
        // ✅ Giúp cache tốt và không lỗi MIME
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },

    // ✅ Giảm size, tối ưu cho production
    minify: "terser",
  },

  // ✅ Cache mạnh cho dev server (không ảnh hưởng Netlify)
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
});
