<template>
  <el-container :id="cssId">
    <el-header>
      <component :is="header" :menu="menu" />
    </el-header>
    <el-main class="important-flex flex-justify-center flex-items-center" :class="{ 'bg-image': background }">
      <div v-if="logo" id="logo"></div>
      <router-view />
    </el-main>
    <el-footer>
      <component :is="footer" />
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { HeaderInjectionKey, FooterInjectionKey } from '~/keys'
import { useConfig } from '~/composables'
import BaseHeader from '~/components/page/BaseHeader.vue'
import BaseFooter from '~/components/page/BaseFooter.vue'

const props = defineProps<{ menu: boolean, background: boolean, logo: boolean, cssId: string }>()

const header = inject(HeaderInjectionKey, BaseHeader)
const footer = inject(FooterInjectionKey, BaseFooter)

const config = useConfig() as any
const backgroundUrl = config.background
const logoUrl = config.logo
</script>

<style>
.ep-container {
  height: 100vh;
}
.bg-image {
  background-size: cover;
  background-position: bottom center;
  background-image: v-bind(backgroundUrl);
}
#logo {
  background-size: contain;
  background-position: top left;
  background-repeat: no-repeat;
  background-image: v-bind(logoUrl);
}
</style>