<template>
  <el-alert
    :title="value?.title"
    :type="value?.type ?? 'info'"
    :description="value?.text"
    show-icon
  />
</template>

<script lang="ts" setup>
import { Notification } from '~/composables'

const props = defineProps<{
  value?: Notification
}>()
</script>

<style scoped>
.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>
