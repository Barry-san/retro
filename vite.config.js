import { defineConfig } from "vite";
import path from "path"
export default defineConfig({
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src"),
      "public/": path.resolve(__dirname, "./public"),
    },
  },
});
