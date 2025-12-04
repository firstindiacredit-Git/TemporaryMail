import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use env vars for dev server / backend target
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Frontend dev port (optional)
  const devPort = Number(env.VITE_DEV_PORT) || 5173;

  // Backend origin for dev proxy; falls back to localhost:3000
  const backendPort = Number(env.PORT) || 3000;
  const backendOrigin =
    env.VITE_BACKEND_ORIGIN || `http://localhost:${backendPort}`;

  return {
    plugins: [react()],
    root: './',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: devPort,
      proxy: {
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});

