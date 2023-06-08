import { RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router'
import { useAuthToken, useUser } from '~/composables'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

router.beforeEach(async(to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const { token } = useAuthToken()
  const { isLoggedIn: isLoggedInFn, destroy } = useUser()
  const isLoggedIn = isLoggedInFn()

  // redirect to login, if another route is requested and no
  // authentication cookie is found
  if (token === undefined && to.name !== 'Login') {
    if (isLoggedIn) {
      console.error('User is authenticated, but auth token is empty. AuthTokenSession is required on server side! Deleting cookies...')
      destroy()
    }
    return { name: 'Login', query: { route: to.path } }
  }

  // redirect to home page, if user is logged in already
  if (to.name == 'Login' && isLoggedIn) {
    return { name: 'Home' }
  }
})

export default router