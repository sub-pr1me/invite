import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Your frontend local development port
    proxy: {
      // This matches any request in your frontend code starting with '/api'
      '/api': {
        target: 'http://localhost:3000', // The exact URL and port of your backend API
        changeOrigin: true,             // Modifies the origin header to match the target URL
        secure: false,                  // Keeps it disabled since you are developing over HTTP
        // Optional: Removes the '/api' prefix before the request hits your backend
        // Use this if your backend route is just '/users' instead of '/api/users'
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})