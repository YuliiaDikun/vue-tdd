import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  devServer: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080"
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["test/setupTest.js"],
    deps: {
      inline: ["msw"],
    },
  },
});
