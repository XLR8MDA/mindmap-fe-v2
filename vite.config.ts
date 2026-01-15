import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["markmap-lib"], // Ensure Markmap is pre-bundled
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias for @ pointing to src
    },
  },
  server: {
    host: "0.0.0.0", // Allow external access
    port: 4444, // Set the server port to 4444
  },
});
