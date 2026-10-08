import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" — GitHub Pages (repo yo'li ostida ham) bilan ishlashi uchun
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
