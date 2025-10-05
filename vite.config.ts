import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin مخصص لنسخ ملف .htaccess
    {
      name: 'copy-htaccess',
      writeBundle() {
        const htaccessPath = resolve(__dirname, 'public/.htaccess');
        const distPath = resolve(__dirname, 'dist/.htaccess');
        if (existsSync(htaccessPath)) {
          copyFileSync(htaccessPath, distPath);
          console.log('✅ تم نسخ ملف .htaccess إلى مجلد البناء');
        }
      }
    }
  ],
  
  // إعدادات الأداء
  build: {
    // تحسين حجم البناء
    target: 'es2015',
    minify: 'terser',
    
    // تقسيم الكود
    rollupOptions: {
      output: {
        manualChunks: {
          // مكتبة React
          'react-vendor': ['react', 'react-dom'],
          
          // مكتبة React Router
          'router-vendor': ['react-router-dom'],
          
          // مكتبة i18n
          'i18n-vendor': ['react-i18next', 'i18next'],
          
          // مكتبة UI
          'ui-vendor': ['lucide-react'],
          
          // مكتبة Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // مكتبة Forms
          'forms-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // مكتبة Utils
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          
          // مكتبة HTTP
          'http-vendor': ['axios'],
          
          // مكتبة Validation
          'validation-vendor': ['zod'],
        },
        // تحسين أسماء الملفات
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    
    // إعدادات إضافية
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    
    // تحسين الأداء
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  
  // إعدادات الخادم
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
  
  // إعدادات المعاينة
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['rezgee.com', 'localhost', '127.0.0.1'],
    cors: true,
  },
  
  // إعدادات CSS
  css: {
    devSourcemap: true,
  },
  
  // إعدادات المسارات
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@data': resolve(__dirname, 'src/data'),
    },
  },
  
  // إعدادات البيئة
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // إعدادات الأداء
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'i18next',
      '@supabase/supabase-js',
      'lucide-react',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  
  // إعدادات إضافية
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  
  // إعدادات JSON
  json: {
    namedExports: true,
    stringify: false,
  },
  
  // إعدادات الصور
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp'],
  
  
  // إعدادات الأداء الإضافية
  experimental: {
    renderBuiltUrl(filename: string) {
      return `/${filename}`;
    },
  },
});