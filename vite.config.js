import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Disable source maps for production
    sourcemap: false,
    
    // Target modern browsers for smaller bundles
    target: 'es2015',
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          // Core Vue dependencies
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          
          // HTTP and utilities
          'utils': ['axios', 'universal-cookie'],
          
          // UI libraries
          'ui-libs': ['vue3-toastify'],
        },
        
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    },
    
    // Use default esbuild minification (faster than terser)
    minify: 'esbuild',
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  
  server: {
    // Enable compression
    compress: true,
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'vue3-toastify'],
    exclude: ['@vueuse/core'], // Exclude if not used
  },
  
  // Enable esbuild optimization
  esbuild: {
    drop: ['console', 'debugger'], // Remove in production
  },
})
