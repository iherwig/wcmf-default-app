<template>
  <el-space :fill="true" wrap>
    <h1>{{ $t(type) }}</h1>
    <component :is="entityTabs"
      style="height:75vh; width:90vw"
    />
  </el-space>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { EntityTabsInjectionKey } from '~/app/composables/overrides';
import EntityTabs from '~/components/data/EntityTabs.vue'

defineProps<{ type: string }>()

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)
</script>