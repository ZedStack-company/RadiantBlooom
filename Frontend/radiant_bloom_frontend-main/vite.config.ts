import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
  define: {
    // Define environment variables for Vite
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://143.110.253.120:5000/api'),
    'import.meta.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://143.110.253.120:5000/api'),
    'import.meta.env.VERCEL': JSON.stringify(process.env.VERCEL || 'true'),
  },
  build: {
    // Ensure environment variables are available at build time
    envPrefix: ['VITE_', 'REACT_APP_'],
    // Optimize for production
    minify: 'esbuild',
    sourcemap: false,
    // Ensure proper chunking
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  // Ensure proper base path for Vercel
  base: '/',
}));
