import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import ViteComponents from 'vite-plugin-components';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        name: 'renataohotel',
        short_name: 'Hotel Renatão',
        description: 'vercel',
        theme_color: '#ffffff',
        icons: [
          {
            src: './imagens/256.256',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
    ViteComponents(),
  ],
  build: {
    outDir: 'dist',
    assetsDir: '',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});