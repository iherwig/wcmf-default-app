<template>
  <n-layout :id="cssId" position="absolute"
    :style="{
      '--backgroundUrl': backgroundUrl,
      '--backgroundColor': backgroundColor,
      '--gradient': gradient
    }">
    <n-layout-header v-if="menu" position="absolute" style="height: var(--header-height)" bordered>
      <component :is="header" :menu="menu" />
    </n-layout-header>
    <n-layout-content position="absolute" content-style="padding: 0 16px;" :style="`bottom: var(--footer-height); `+ (menu ? `top: var(--header-height)`:'')" :class="background ? (backgroundUrl ? 'bg-image': 'bg-pattern') : ''">
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
import { useGradient } from '~/composables/color'
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
const gradient = useGradient(backgroundColor)
</script>

<style>
body {
  --header-height: 64px;
  --footer-height: 64px;
}
.bg-image {
  background-size: cover;
  background-position: bottom center;
  background-image: v-bind(backgroundUrl);
  background-color: v-bind(backgroundColor);
}
.bg-pattern {
  background: v-bind(gradient);
  height: 100vh;
  margin: 0;
}
#logo {
  background-size: contain;
  background-position: top left;
  background-repeat: no-repeat;
  background-image: v-bind(logoUrl);
}
</style>