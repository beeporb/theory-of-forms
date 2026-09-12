import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/theory-of-forms/' : '/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Theory of Forms',
        short_name: 'ToF',
        description: 'Explore pocket dimensions, collect Forms, extract or die trying.',
        theme_color: '#101014',
        background_color: '#101014',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
