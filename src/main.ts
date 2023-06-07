import { createApp } from 'vue';
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import Router from './router'
import I18n from './i18n'

import './styles/index.scss'
import 'uno.css'

import 'element-plus/theme-chalk/src/message.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
  .use(VueCookies)
  .use(Router)
  .use(I18n)
  .mount("#app")

/*
Router.beforeEach(function (to, from, next) {
  console.log('beforeEach', to.path + ' - Auth: ' + auth.user.authenticated)
  if ((to.path !== '/login' && to.path !== 'login') && !auth.user.authenticated) {
    next({ path: '/login' })
  } else if ((to.path === '/login' || to.path === 'login') && auth.user.authenticated) {
    next({ path: '/' })
  } else {
    next()
  }
})

// Whenerver Server Gives 401 Status Code, it logouts and redirect to login page
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    if (response.status === 401) {
      let msg = response.body.returnMessage
      localStorage.setItem('logoutReason', msg)
      auth.logout()
    }
  })
})
*/