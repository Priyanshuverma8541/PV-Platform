import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pv/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@pv/ui/styles.css': path.resolve(__dirname, '../../packages/ui/src/styles.css'),
      '@pv/hooks': path.resolve(__dirname, '../../packages/hooks/src'),
      '@pv/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
      '@pv/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@pv/types': path.resolve(__dirname, '../../packages/types/src'),
      '@pv/auth': path.resolve(__dirname, '../../packages/auth/src'),
      '@pv/ai': path.resolve(__dirname, '../../packages/ai/src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
