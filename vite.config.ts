import { defineConfig } from "vite";

export default defineConfig({
  base: "/kws2100-Eksamen-2025",
  server: {
    proxy: {
      "/kws2100-Eksamen-2025/api": "http://localhost:3000",
    },
  },
});
