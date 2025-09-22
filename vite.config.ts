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
      onwarn(warning, warn) {
        // Suppress specific warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        if (warning.message.includes('dynamic import will not move module into another chunk')) {
          return;
        }
        warn(warning);
      },
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
          
          // Application chunks - more specific to avoid dynamic import conflicts
          if (id.includes('src/components/admin')) {
            return 'admin-components';
          }
          if (id.includes('src/lib/email') || id.includes('src/lib/Email') || 
              id.includes('src/lib/finalEmailService') || 
              id.includes('src/lib/unifiedEmailService') ||
              id.includes('src/lib/notificationEmailService') ||
              id.includes('src/lib/databaseEmailService')) {
            return 'email-services';
          }
          if (id.includes('src/lib/admin') && !id.includes('email')) {
            return 'admin-services';
          }
          if (id.includes('src/lib/subscriptionService')) {
            return 'subscription-services';
          }
          if (id.includes('src/lib/supabase') && !id.includes('email')) {
            return 'supabase-services';
          }
          if (id.includes('src/components') && !id.includes('admin')) {
            return 'user-components';
          }
          if (id.includes('src/lib') && !id.includes('admin') && !id.includes('email') && !id.includes('subscription') && !id.includes('supabase')) {
            return 'user-services';
          }
        }
      }
    }
  }
})