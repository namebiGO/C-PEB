import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui';
            }
            return 'dependencies';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    historyApiFallback: true, // Always serve index.html for client-side routes
    proxy: {
      // Forward all /api/* requests to the Express backend during dev
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
