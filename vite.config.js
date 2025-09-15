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
    // Generate source maps for better debugging
    sourcemap: false,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          utils: ['axios', 'universal-cookie']
        }
      }
    }
  },
  server: {
    // Enable compression
    compress: true
  },
  // SEO and Performance optimizations
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios']
  }
})
