<template>
  <el-container :id="cssId">
    <el-header>
      <BaseHeader :menu="menu" />
    </el-header>
    <el-main class="important-flex flex-justify-center flex-items-center">
      <router-view />
    </el-main>
    <el-footer>
      <BaseFooter />
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { useConfig } from '~/composables';

defineProps<{ menu: boolean, cssId: string }>();

const config = useConfig() as any
const background = config.background
const logo = config.logo
</script>

<style>
.ep-main {
  height: calc(100vh - var(--ep-header-height) - var(--ep-footer-height));
  background-size: cover;
  background-position: bottom center;
  background-image: v-bind(background)
}
#logo {
  background-size: contain;
  background-position: top left;
  background-repeat: no-repeat;
  background-image: v-bind(logo);
}
</style>