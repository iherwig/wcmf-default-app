import { createApp } from 'vue';
import { createPinia } from 'pinia'
import { fetchConfig } from '~/composables'

import './styles/index.scss'
import 'uno.css'

import 'element-plus/theme-chalk/src/message.scss'

fetchConfig().then(async(config) => {
  console.log('Configuration:', config)

  // delay loading of modules that depend on the configuration
  const i18nModule = await import('./i18n')
  const routerModule = await import('./router')
  const appModule = await import('./App.vue')

  const pinia = createPinia()
  const app = createApp(appModule.default)

  app.use(pinia)
    .use(routerModule.default)
    .use(i18nModule.default)
    .mount("#app")
}).catch((error) => {
  console.error(`Error fetching configuration: ${error}`)
})

