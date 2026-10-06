import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 8080,
    open: false,
    host: true
  },
  preview: {
    port: 8080,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    target: 'esnext'
  }
});
