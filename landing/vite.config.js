import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: { outDir: 'dist', assetsDir: 'assets' },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/themica': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      }
    }
  },
});
