import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://exploreindiasmartly.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: 'https://exploreindiasmartly.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      // /images NOT proxied — served locally from frontend/public/images/
    }
  }
})