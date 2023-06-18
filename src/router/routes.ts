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
        name: '_Base',
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
          },
          {
            path: 'data/:type/',
            name: 'EntityList',
            component: () => import('~/views/EntityList.vue'),
            props: (route: RouteLocation) => {
              const props = {
                type: route.params.type
              }
              return props
            }
          },
          {
            path: 'data/:type/:id',
            name: 'Entity',
            component: () => import('~/views/Entity.vue'),
          },
          {
            path: 'search',
            name: 'SearchResult',
            component: () => import('~/views/SearchResult.vue'),
          },
          {
            path: 'media',
            name: 'Media',
            component: () => import('~/views/Media.vue'),
          },
          {
            path: 'link',
            name: 'Link',
            component: () => import('~/views/Media.vue'),
          },
          {
            path: 'settings',
            name: 'Settings',
            component: () => import('~/views/Settings.vue'),
          },
          {
            path: 'admin',
            name: 'Admin',
            component: () => import('~/views/admin/Admin.vue'),
          },
          {
            path: 'admin/Lock',
            name: 'LockList',
            component: () => import('~/views/admin/LockList.vue'),
          },
          {
            path: 'admin/Lock/:id',
            name: 'Lock',
            component: () => import('~/views/admin/Lock.vue'),
          },
          {
            path: 'admin/Permission',
            name: 'PermissionList',
            component: () => import('~/views/admin/PermissionList.vue'),
          },
          {
            path: 'admin/Permission/:id',
            name: 'Permission',
            component: () => import('~/views/admin/Permission.vue'),
          },
          {
            path: 'admin/:type',
            name: 'PrincipalList',
            component: () => import('~/views/admin/PrincipalList.vue'),
          },
          {
            path: 'admin/:type/:id',
            name: 'Principal',
            component: () => import('~/views/admin/Principal.vue'),
          },
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