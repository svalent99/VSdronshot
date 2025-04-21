
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    allowedHosts: [
      "fdbb6de6-4f47-4c37-b791-d78665502467.lovableproject.com"
    ],
    hmr: {
      clientPort: 443,
      webSocketClient: {
        random: () => Math.random()
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
