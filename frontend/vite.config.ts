import path from 'path'
import http from 'http'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // API base URL from .env - requests to this path will be proxied to backend
  // Set VITE_API_BASE_URL in .env for your environment
  const apiBaseUrl = env.VITE_API_BASE_URL || '/api/'
  const config = {
    server: {
      host: '0.0.0.0',  // Listen on all interfaces (required for dev containers)
      port: 5173,
      strictPort: false, // Allow fallback to next available port
      proxy: {
        // Proxy API requests to backend
        [apiBaseUrl]: {
          target: 'http://localhost',
          changeOrigin: false,
          secure: false,
          ws: true,
          configure: (proxy: any, _options: unknown) => {
            proxy.on('error', (err: Error, _req: http.IncomingMessage, _res: http.ServerResponse) => {
              console.log('Proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage, _res: http.ServerResponse) => {
              console.log('Sending request:', req.url, `${proxyReq.method} ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
            });
            proxy.on('proxyRes', (proxyRes: http.IncomingMessage, req: http.IncomingMessage, _res: http.ServerResponse) => {
              console.log('Received response:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
    resolve: {
      alias: {
        '~/': `${pathSrc}/`,
      },
    },
    plugins: [
      vue(),
      VueI18nPlugin({ fullInstall: false }),
    ],
    build: {
      target: ['esnext'],
    },
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
  }
  return config
})
