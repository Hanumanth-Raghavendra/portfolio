import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps every asset path relative, so the same build works on
// Vercel, on any static host, and inside a sub-folder.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2019',
    assetsInlineLimit: 0,
  },
});
