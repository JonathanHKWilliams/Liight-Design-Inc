import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false, // Recommended for local development
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix when forwarding
        ws: true, // Enable WebSocket proxy if needed
        configure: (proxy) => {
          // Optional error handling
          proxy.on('error', (err) => {
            console.log('Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxy Request:', proxyReq.path);
          });
        }
      },
    },
    // Add these for better development experience
    host: true, // Listen on all network interfaces
    port: 5173, // Explicit default Vite port
    strictPort: true, // Don't fall back to another port if 5173 is taken
    open: false // Disable auto-opening browser
  },
  // Add build configuration for production
  build: {
    outDir: '../dist', // Optional: Build directly to server's public folder
    emptyOutDir: true,
    sourcemap: true // Recommended for debugging
  }
});