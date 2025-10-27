import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import svgr from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    // ✅ Base path cho Netlify
    base: "./",

    plugins: [
      // React + Tailwind
      react({
        jsxRuntime: "automatic", // tự động import React
        fastRefresh: true, // HMR nhanh hơn
      }),
      tailwindcss(),

      // SVG thành React component
      svgr({
        include: "**/*.svg?react",
        svgrOptions: {
          exportType: "named",
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false, // giữ viewBox cho responsive
                  },
                },
              },
            ],
          },
        },
      }),

      // 🗜️ Brotli compression (nén tốt nhất)
      isProduction &&
        viteCompression({
          algorithm: "brotliCompress",
          ext: ".br",
          threshold: 10240, // chỉ nén file > 10kb
          deleteOriginFile: false,
        }),

      // 🗜️ Gzip compression (fallback cho browser cũ)
      isProduction &&
        viteCompression({
          algorithm: "gzip",
          ext: ".gz",
          threshold: 10240,
          deleteOriginFile: false,
        }),

      // 🖼️ Tối ưu hình ảnh
      isProduction &&
        ViteImageOptimizer({
          jpg: { quality: 75 },
          jpeg: { quality: 75 },
          png: { quality: 80 },
          webp: { quality: 75 },
          avif: { quality: 65 },
        }),
    ].filter(Boolean), // loại bỏ false values

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "lenis"],
      exclude: ["@vite/client", "@vite/env"],
    },

    build: {
      target: "esnext",
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 3500, // tăng lên để tránh warning (sẽ tối ưu sau)

      rollupOptions: {
        output: {
          // 📦 Code splitting strategy
          manualChunks: (id) => {
            // ✅ FIX: Chỉ tách animation libs, gộp phần còn lại
            // Cách này tránh lỗi dependency resolution

            // Animation libraries (tách riêng vì ít thay đổi)
            if (
              id.includes("node_modules/lenis") ||
              id.includes("node_modules/gsap") ||
              id.includes("node_modules/@studio-freight")
            ) {
              return "animation-vendor";
            }

            // Tất cả node_modules còn lại (React, Router, UI libs, etc)
            if (id.includes("node_modules/")) {
              return "vendor";
            }
          },

          // ✅ Cache-friendly filenames
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },

        // 🎯 Tree-shaking mạnh hơn
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },

      // 🔥 Terser minification
      minify: isProduction ? "terser" : "esbuild",
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true, // xóa console.log
              drop_debugger: true, // xóa debugger
              pure_funcs: ["console.log", "console.info", "console.debug"],
              passes: 2, // chạy 2 lần để tối ưu hơn
            },
            format: {
              comments: false, // xóa comments
            },
            mangle: {
              safari10: true, // fix lỗi Safari 10
            },
          }
        : undefined,
    },

    // ⚡ Dev server (chỉ dùng cho development)
    server: {
      port: 3000,
      open: true,
      host: true,
      hmr: {
        overlay: true, // hiện lỗi full-screen
      },
    },

    // 🎯 Preview server (test production build)
    preview: {
      port: 4173,
      open: true,
    },

    // 🎨 CSS optimization
    css: {
      devSourcemap: false, // tắt sourcemap CSS trong dev
    },

    // 🔧 Esbuild config
    esbuild: {
      logOverride: { "this-is-undefined-in-esm": "silent" },
      legalComments: "none", // xóa license comments
    },
  };
});
