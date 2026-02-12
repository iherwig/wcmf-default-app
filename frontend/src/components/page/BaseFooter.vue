<template>
  <n-grid :cols="2">
    <n-grid-item>
      <n-flex justify="start" class="content">
        <small>{{ appProperties.appTitle }} <em>{{ appProperties.version }}</em> created with <a href="https://wcmf.wemove.com" target="_blank">wCMF</a></small>
      </n-flex>
    </n-grid-item>
    <n-grid-item>
      <n-flex justify="end" class="content">
        <LocaleChanger :onlyIfMultiple="true" />
        <n-button tertiary circle @click="toggleDark()">
          <template #icon>
            <n-icon v-if="isDark"><moon-icon /></n-icon>
            <n-icon v-else><sun-icon /></n-icon>
          </template>
        </n-button>
      </n-flex>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import { isDark, toggleDark } from '~/composables/theme'
import { NGrid, NGridItem, NFlex, NButton, NIcon } from 'naive-ui'
import { WeatherSunny16Regular as SunIcon, WeatherMoon16Regular as MoonIcon } from '@vicons/fluent'
import { useAppProperties } from '~/composables/config'
import LocaleChanger from '~/components/LocaleChanger.vue'

const appProperties = useAppProperties()
</script>

<style scoped>
.content {
  height: 64px;
  align-items: center;
  padding: 0 24px;
}
</style>