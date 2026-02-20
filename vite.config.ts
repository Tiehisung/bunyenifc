import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import react from "@vitejs/plugin-react"
// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add more aliases as needed
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  }, 
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Make sure this matches your backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})