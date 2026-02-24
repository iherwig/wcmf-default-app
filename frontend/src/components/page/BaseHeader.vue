<template>
  <n-flex v-if="menu" align="center" class="header">
    <n-flex>
      <n-button
        v-if="isMobile"
        quaternary
        circle
        @click="drawerActive=true"
      >
        <template #icon>
          <menu-icon />
        </template>
      </n-button>
    </n-flex>
    <n-flex>
      <div>{{ config.title }}</div>
    </n-flex>
    <n-flex v-if="!isMobile" style="flex-grow: 1">
      <n-flex>
        <div>
          <n-menu
            v-model:value="$route.path"
            mode="horizontal"
            :options="mainMenuOptions"
            responsive
          />
        </div>
        <n-input class="search-field" :placeholder="t('Search')" />
      </n-flex>
    </n-flex>
    <n-flex v-if="!isMobile" style="width: 120px">
      <n-menu
        v-model:value="$route.path"
        mode="horizontal"
        :options="secondaryMenuOptions"
        responsive
      />
    </n-flex>
  </n-flex>

  <n-drawer v-model:show="drawerActive" placement="right">
    <n-drawer-content>
      <n-input class="search-field" :placeholder="t('Search')" />
      <n-menu
        mode="vertical"
        :indent=0
        :options="mainMenuOptions"
        @update:value="drawerActive=false"
        accordion
      />
      <n-menu
        mode="vertical"
        :indent=0
        :options="secondaryMenuOptions"
        @update:value="drawerActive=false"
        accordion
      />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { Component, h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router'
import { NMenu, MenuOption, NIcon, NInput, NFlex, NButton, NDrawer, NDrawerContent } from 'naive-ui'
import {
  TextBulletListLtr16Regular as ListIcon,
  Settings16Regular as SettingsIcon,
  Person16Regular as UsersIcon,
  Shield16Regular as PermissionsIcon,
  LockClosed16Regular as LocksIcon,
  Person16Filled as UserIcon,
  DoorArrowRight16Regular as LogoutIcon,
  LineHorizontal320Filled as MenuIcon
} from '@vicons/fluent'
import { useBreakpoints } from '@vueuse/core'
import { useConfig } from '~/composables/config'
import { useUser } from '~/composables/user'
import router from '~/router';

const props = defineProps<{
  menu: boolean
}>()

const config = useConfig() as any
const { getLogin, destroy: destroySession } = useUser()

const { locale, t } = useI18n()

const breakpoints = useBreakpoints({
  mobile: 0,
  tablet: 980,
  desktop: 1024
})
const isMobile = breakpoints.smaller('tablet')
const drawerActive = ref(false)

const localizedRoute = (route: any) => {
  return { ...route, params: { ...route.params, locale: locale.value } }
}

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const createMenuItem = (options: {id: string, label: string, route?: any, icon?: Component, children?: MenuOption[]}): MenuOption => {
  return {
    label: options.route ? () => h(RouterLink, {
      to: localizedRoute(options.route)
    }, { default: () => options.label }) : options.label,
    key: options.id,
    icon: options.icon ? renderIcon(options.icon) : undefined,
    children: options.children
  }
}

const mainMenuOptions: MenuOption[] = [
  createMenuItem({ id: 'home', label: t('Home'), route: { name: 'Home' } }),
  createMenuItem({ id: 'media-pool', label: t('Media Pool'), route: { name: 'Home' } }),
  createMenuItem({ id: 'content', label: t('Content'),
    children: config.rootTypes.map((type: string) => createMenuItem({
      id: `content-${type}`,
      label: t(`${type} [Pl.]`),
      route: localizedRoute({ name: 'EntityList', params: { type: type }}),
      icon: ListIcon
    }))
  }),
  createMenuItem({ id: 'administration', label: t('Administration'),
    children: [
      createMenuItem({ id: 'settings', label: t('Settings'), route: { name: 'Home' }, icon: SettingsIcon }),
      createMenuItem({ id: 'users', label: t('Users'), route: { name: 'Home' }, icon: UsersIcon }),
      createMenuItem({ id: 'permissions', label: t('Permissions'), route: { name: 'Home' }, icon: PermissionsIcon }),
      createMenuItem({ id: 'locks', label: t('Locks'), route: { name: 'Home' }, icon: LocksIcon }),
    ]
  })
]

const secondaryMenuOptions: MenuOption[] = [
  createMenuItem({ id: 'user', label: getLogin(),
    children: [
      createMenuItem({ id: 'user-settings', label: t('Settings'), route: { name: 'Home' }, icon: UserIcon }),
      createMenuItem({ id: 'users', label: t('Logout'), route: { name: 'Root', params: { logout: true } }, icon: LogoutIcon }),
    ]
  })
]

const logout = (item: any) => {
  router.push({ name: 'Root' })
  destroySession()
}
</script>

<style scoped>
.header {
  height: 100%;
  padding: 0 24px;
}
.search-field {
  width: 216px;
}
</style>