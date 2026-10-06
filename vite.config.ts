import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const root = path.resolve(import.meta.dirname);
const port = Number(process.env.PORT ?? 5174);

export default defineConfig({
  root,
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "0.0.0.0",
    port: Number.isFinite(port) && port > 0 ? port : 5174,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: Number.isFinite(port) && port > 0 ? port : 5174,
    allowedHosts: true,
  },
});
