import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'
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
    splitVendorChunkPlugin(),
    compression({ algorithm: 'gzip' }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'robots.txt'],
      manifest: {
        name: 'Lokesh Kumar Portfolio',
        short_name: 'LK Portfolio',
        description: 'AI Prompt Engineer | Data Science Enthusiast',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
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
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/gsap')) {
            return 'animations';
          }
          if (id.includes('node_modules/three')) {
            return 'three';
          }
        }
      }
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      // Add any path aliases if needed
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'framer-motion', 'gsap']
  },
  server: {
    port: 3000,
    open: true,
  },
})
