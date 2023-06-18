<template>
  <el-config-provider namespace="ep" :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useConfig } from '~/composables'
import { useOverrides } from './app/composables/overrides'

let locale = ref(undefined)

const overrides = useOverrides()

onMounted(async() => {
  const config = useConfig() as any

  // NOTE: we need a relative path here due to Rollup dynamic import limitations
  // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
  locale = await import(`../node_modules/element-plus/dist/locale/${config.uiLanguage}.js`);
})
</script>

<style>
#app {
  color: var(--ep-text-color-primary);
}
</style>