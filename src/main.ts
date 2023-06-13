import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue'
import Router from './router'
import I18n from './i18n'

import './styles/index.scss'
import 'uno.css'

import 'element-plus/theme-chalk/src/message.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
  .use(Router)
  .use(I18n)
  .mount("#app")
