import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" — GitHub Pages (repo yo'li ostida ham) bilan ishlashi uchun
// Ikki sahifa: ommaviy sayt (index.html) va admin panel (admin/index.html → /admin/)
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: { main: "index.html", admin: "admin/index.html" },
    },
  },
});
