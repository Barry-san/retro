import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "src",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
});
