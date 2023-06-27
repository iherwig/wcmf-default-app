import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || '/cms/app/public/'
  const config = {
    server: {
      proxy: {
        // local development
        [apiBaseUrl]: {
          target: 'http://localhost',
          changeOrigin: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending request:', req.url, `${proxyReq.method} ${proxyReq.protocol}://${proxyReq.host}${proxyReq.path}`);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
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
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/element/index.scss" as *;`,
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
        dts: 'src/components.d.ts',
      }),
      VueI18nPlugin({ compositionOnly: true, fullInstall: false }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss({
        presets: [
          presetUno(),
          presetAttributify(),
          presetIcons({
            scale: 1.2,
            warn: true,
          }),
        ],
        transformers: [
          transformerDirectives(),
          transformerVariantGroup(),
        ]
      }),
    ],
  }
  return config
})
