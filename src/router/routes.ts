import { RouteRecordRaw, RouteLocation, RouterView } from 'vue-router'
import { routeMiddleware } from '~/i18n';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:locale([a-zA-Z]{2})?',
    name: 'Root',
    component: RouterView,
    beforeEnter: routeMiddleware,
    children: [
      {
        path: '',
        component: () => import('~/views/BasePage.vue'),
        props: (route: RouteLocation) => {
          const isLoginPage = route.name == 'Login'
          const props = {
            menu: !isLoginPage,
            background: isLoginPage,
            logo: isLoginPage,
            cssId: route.name ? `page-${route.name.toString().toLowerCase()}` : ''
          }
          return props
        },
        children: [
          {
            path: '',
            name: 'Login',
            component: () => import('~/views/Login.vue'),
          },
          {
            path: 'home',
            name: 'Home',
            component: () => import('~/views/Home.vue'),
          }
        ]
      }
    ]
  },
  {
    // path: "*",
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import('~/views/NotFound.vue'),
  }
];

export default routes