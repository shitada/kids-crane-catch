import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/kids-crane-catch/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
