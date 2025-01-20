import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/modules/layouts', import.meta.url)),
      '@products': fileURLToPath(new URL('./src/modules/products', import.meta.url)),
      '@cart': fileURLToPath(new URL('./src/modules/cart', import.meta.url)),
    },
  },
});
