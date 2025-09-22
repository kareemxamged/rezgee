import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Production Vite configuration for Rezge Islamic Marriage Platform
// إعدادات Vite للإنتاج - منصة رزقي للزواج الإسلامي

export default defineConfig({
  plugins: [react()],
  
  // Base URL for production deployment
  base: '/',
  
  // Build configuration
  build: {
    // Output directory
    outDir: 'dist',
    
    // Source map configuration
    sourcemap: false, // Disable source maps in production for security
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 2000,
    
    // Rollup options
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['lucide-react', 'clsx'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'i18n-vendor': ['i18next', 'react-i18next'],
          'utils-vendor': ['axios', 'bcryptjs'],
          // Email services chunk
          'email-services': [
            './src/lib/emailService.ts',
            './src/lib/finalEmailService.ts',
            './src/lib/unifiedEmailService.ts',
            './src/lib/notificationEmailService.ts',
            './src/lib/databaseEmailService.ts',
            './src/lib/unifiedDatabaseEmailService.ts'
          ],
          // Admin services chunk
          'admin-services': [
            './src/lib/adminAuthService.ts',
            './src/lib/adminUsersService.ts',
            './src/lib/adminDashboardService.ts',
            './src/lib/adminTwoFactorService.ts'
          ]
        },
        // File naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      }
    },
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    },
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Target modern browsers
    target: 'es2020'
  },
  
  // Server configuration (for preview)
  server: {
    port: 4173,
    host: true,
    strictPort: true
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
    strictPort: true
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // CSS configuration
  css: {
    devSourcemap: false,
    postcss: {
      plugins: [
        // Add any PostCSS plugins here if needed
      ]
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'clsx',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'i18next',
      'react-i18next',
      'axios',
      'bcryptjs'
    ]
  },
  
  // Environment variables
  envPrefix: 'VITE_',
  
  // Log level
  logLevel: 'warn'
})
