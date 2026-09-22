import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7139',
        changeOrigin: true,
        secure: false,
      },
      '/graphql': {
        target: 'https://localhost:7139',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
