import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src"),
      "public/": path.resolve(__dirname, "./public"),
    },
  },
});
