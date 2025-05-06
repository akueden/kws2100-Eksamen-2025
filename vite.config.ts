import { defineConfig } from "vite";

export default defineConfig({
  // Base-stien siden din ligger under /kws2100-Eksamen-2025
  base: "/kws2100-Eksamen-2025",

  server: {
    // Proxy alle kall til /kws2100-Eksamen-2025/api/* til Hono-serveren
    proxy: {
      "/kws2100-Eksamen-2025/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/kws2100-Eksamen-2025\/api/,
            "/kws2100-Eksamen-2025/api",
          ),
      },
    },
  },
});
