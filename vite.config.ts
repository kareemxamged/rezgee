import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/smtp': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/smtp/, '')
      }
    }
  },
  build: {
    // Chunk size warning limit
    chunkSizeWarningLimit: 2000,
    
    // Rollup options for better chunking
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            if (id.includes('lucide-react') || id.includes('clsx')) {
              return 'ui-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            if (id.includes('i18next')) {
              return 'i18n-vendor';
            }
            if (id.includes('axios') || id.includes('bcryptjs')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
          
          // Application chunks
          if (id.includes('src/components/admin')) {
            return 'admin-components';
          }
          if (id.includes('src/lib') && (id.includes('email') || id.includes('Email'))) {
            return 'email-services';
          }
          if (id.includes('src/lib') && (id.includes('admin') || id.includes('Admin'))) {
            return 'admin-services';
          }
          if (id.includes('src/components') && !id.includes('admin')) {
            return 'user-components';
          }
          if (id.includes('src/lib') && !id.includes('admin') && !id.includes('email')) {
            return 'user-services';
          }
        }
      }
    }
  }
})