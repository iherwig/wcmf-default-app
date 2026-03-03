<template>
  <n-collapse-item v-if="visible" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </n-collapse-item>
  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts" setup>
import { NCollapseItem } from 'naive-ui'
const props = defineProps<{
  visible: boolean
}>()
</script>
