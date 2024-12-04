import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [tailwindcss()],
  css: {
    postcss: './postcss.config.js',
  },
});
