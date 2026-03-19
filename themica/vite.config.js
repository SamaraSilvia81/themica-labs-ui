// themica/vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // ← era '/themica/', muda pra '/'
  build: { outDir: 'dist', assetsDir: 'assets' },
  server: { port: 5174, open: true },
});
