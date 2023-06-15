import { createApp } from 'vue';
import { createPinia } from 'pinia'
import { fetchConfig } from '~/composables'

import './styles/index.scss'
import 'uno.css'

import 'element-plus/theme-chalk/src/message.scss'

fetchConfig().then(async() => {
  const i18nModule = await import('./i18n')
  const routerModule = await import('./router')
  const appModule = await import('./App.vue')

  const pinia = createPinia()
  const app = createApp(appModule.default)

  app.use(pinia)
    .use(routerModule.default)
    .use(i18nModule.default)
    .mount("#app")
})

