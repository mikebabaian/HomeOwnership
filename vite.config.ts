import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'icons/*'],
      manifest: {
        name: 'Own Well Services',
        short_name: 'Steward',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2b6cb0',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      // Forward /api requests to the .NET backend during local development.
      // Start the API with: dotnet run --project api/HomeOwnership.Api
      '/api': {
        target: 'http://localhost:5238',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
