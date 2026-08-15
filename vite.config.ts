import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 8081,
      strictPort: true,
    },
  },

  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});