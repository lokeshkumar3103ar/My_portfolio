import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// Determine base path based on environment
const base = process.env.NODE_ENV === 'production' 
  ? '/My_portfolio/' // Use repository name for GitHub Pages
  : '/'  // Use root path in development

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip' }),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      includeAssets: ['vite.svg', 'robots.txt', '*.png', 'textures/**/*', 'Lokesh_Kumar_AR_Resume_2025.pdf'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,ico,pdf}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Lokesh Kumar Portfolio',
        short_name: 'LK Portfolio',
        description: 'AI/ML Engineer | Creator of QritiQ',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        // Using function form of manualChunks for better compatibility
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/gsap')) {
            return 'animations';
          }
          // Other dependencies will go in the main chunk
          return null;
        }
      }
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      // Add path aliases to make imports cleaner
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap']
  },
  server: {
    port: 3001,
    host: true,
    open: true,
    // Disable browser caching of development assets
    headers: {
      'Cache-Control': 'no-store',
    },
  },
})
