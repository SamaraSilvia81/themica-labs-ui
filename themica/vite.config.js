import { defineConfig } from 'vite';

export default defineConfig({
  base: '/themica/',
  build: { outDir: 'dist', assetsDir: 'assets' },
  server: { port: 5174, open: true },
});
