import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
  plugins: [
    react(),
    analyzer({
      analyzerMode: 'json',
      fileName: 'stats',
    }),
  ],
  build: {
    // Enable module preload injection
    modulePreload: {
      // Preload all JS modules
      resolveDependencies: (_filename, deps) => {
        return deps
      },
    },
    // Generate better chunks for HTTP/2
    rollupOptions: {
      output: {
        // Separate vendor chunks for better caching
        manualChunks: {
          d3: ['d3'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Inline assets smaller than 4kb
    assetsInlineLimit: 4096,
  },
})
