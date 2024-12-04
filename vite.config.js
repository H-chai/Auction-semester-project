import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import tailwindcss from 'tailwindcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  appType: 'mpa',
  plugins: [tailwindcss()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
        login: resolve(__dirname, './auth/login/index.html'),
        register: resolve(__dirname, './auth/register/index.html'),
        listing: resolve(__dirname, './listing/index.html'),
        listingCreate: resolve(__dirname, './listing/create/index.html'),
        listingUpdate: resolve(__dirname, './listing/update/index.html'),
        profile: resolve(__dirname, './profile/index.html'),
        profileUpdate: resolve(__dirname, './profile/update/index.html'),
      },
    },
  },
});
