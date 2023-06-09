<template>
  <el-menu v-if="menu" mode="horizontal">
    <el-menu-item index="0">{{ config.title }}</el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { useConfig } from '~/composables'

defineProps<{ menu: boolean }>();

const config = useConfig() as any
</script>