const path = require('node:path');

module.exports = async () => {
  const { defineConfig } = await import('vite');
  const { default: react } = await import('@vitejs/plugin-react');

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@pv/ui/styles.css': path.resolve(__dirname, '../../packages/ui/src/styles.css'),
        '@pv/ui/style.css': path.resolve(__dirname, '../../packages/ui/src/styles.css'),
        '@pv/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
