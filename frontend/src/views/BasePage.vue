<template>
  <n-layout :id="cssId" position="absolute">
    <n-layout-header v-if="menu" position="absolute" style="height: var(--header-height)" bordered>
      <component :is="header" :menu="menu" />
    </n-layout-header>
    <n-layout-content position="absolute" :style="menu ? `top: var(--header-height)`:''" :class="background ? 'bg-image' : ''">
      <div v-if="logo" id="logo"></div>
      <router-view />
    </n-layout-content>
    <n-layout-footer position="absolute" bordered>
      <component :is="footer" />
    </n-layout-footer>
  </n-layout>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter } from 'naive-ui'
import { HeaderInjectionKey, FooterInjectionKey } from '~/keys'
import { useConfig } from '~/composables/config'
import BaseHeader from '~/components/page/BaseHeader.vue'
import BaseFooter from '~/components/page/BaseFooter.vue'

const props = defineProps<{
  menu: boolean,
  background: boolean,
  logo: boolean,
  cssId: string
}>()

const header = inject(HeaderInjectionKey, BaseHeader)
const footer = inject(FooterInjectionKey, BaseFooter)

const config = useConfig() as any
const backgroundColor = config.color
const backgroundUrl = config.background
const logoUrl = config.logo
</script>

<style>
body {
  --header-height: 64px;
}
.bg-image {
  background-size: cover;
  background-position: bottom center;
  background-image: v-bind(backgroundUrl);
  background-color: v-bind(backgroundColor);
}
#logo {
  background-size: contain;
  background-position: top left;
  background-repeat: no-repeat;
  background-image: v-bind(logoUrl);
}
</style>