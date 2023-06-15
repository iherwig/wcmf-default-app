<template>
  <el-config-provider namespace="ep" :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useConfig } from '~/composables'

let locale = ref(undefined)

onMounted(async() => {
  try {
    const config = useConfig() as any
    console.log('Configuration:', config)

    // NOTE: we need a relative path here due to Rollup dynamic import limitations
    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    locale = await import(`../node_modules/element-plus/dist/locale/${config.uiLanguage}.js`);
  }
  catch(error) {
    ElMessage({
      showClose: true,
      message: `Error fetching configuration: ${error}`,
      type: 'error',
    })
  }
})
</script>

<style>
#app {
  color: var(--ep-text-color-primary);
}
</style>