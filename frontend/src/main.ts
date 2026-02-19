import { createApp } from 'vue';
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import { fetchConfig } from '~/composables/config'

import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

fetchConfig().then(async(config) => {
  console.log('Configuration:', config)

  // delay loading of modules that depend on the configuration
  const i18nModule = await import('./i18n')
  const routerModule = await import('./router')
  const appModule = await import('./App.vue')

  const pinia = createPinia()
  const app = createApp(appModule.default)

  app.use(pinia)
    .use(PiniaColada, {
      queryOptions: {
        staleTime: 30000 // 30 sec
      }
    })
    .use(routerModule.default)
    .use(i18nModule.default)
    .mount("#app")
}).catch((error) => {
  console.error(`Error fetching configuration: ${error}`)
})

