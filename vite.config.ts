import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite(),
    react(),
  ],

  resolve: {
    tsconfigPaths: true,
  },

  server: {
    host: true,
    port: 5174,
    open: true,
  },

  preview: {
    host: true,
    port: 4174,
    open: true,
  },
});