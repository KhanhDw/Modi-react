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
            // React core libraries
            if (id.includes("react") && !id.includes("react-router")) return "vendor-react";
            
            // UI component libraries
            if (id.includes("@radix-ui") || id.includes("@material-tailwind") || id.includes("@mantine")) 
              return "vendor-ui";
              
            // Charting libraries
            if (id.includes("recharts") || id.includes("chart.js") || id.includes("apexcharts") || id.includes("echarts")) 
              return "vendor-charts";
              
            // Animation libraries
            if (id.includes("framer-motion") || id.includes("lucide-react") || id.includes("react-icons")) 
              return "vendor-animation";
              
            // Form libraries
            if (id.includes("react-hook-form") || id.includes("react-select") || id.includes("react-dropzone")) 
              return "vendor-forms";
              
            // Utility libraries
            if (id.includes("lodash") || id.includes("clsx") || id.includes("tailwind-merge")) 
              return "vendor-utils";
              
            // Other large libraries
            if (id.includes("tiptap") || id.includes("slate")) 
              return "vendor-editor";
              
            return "vendor";
          }
        },
      },
    },
  },
});
