import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable sourcemaps for production
    minify: "terser", // Better minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react", "react-toastify"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
  base: "/", // Ensure correct base path for subdomain
});
