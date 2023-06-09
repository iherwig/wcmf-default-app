<template>
  <el-menu v-if="menu" class="flex-items-center"
    mode="horizontal"
    :ellipsis="false"
  >
    <div class="px">{{ config.title }}</div>
    <el-menu-item index="1">{{ $t('Home') }}</el-menu-item>
    <el-menu-item index="2">{{ $t('Media Pool') }}</el-menu-item>
    <el-sub-menu index="3">
      <template #title>{{ $t('Content') }}</template>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>{{ $t('Administration') }}</template>
      <el-menu-item index="4-1">{{ $t('Settings') }}</el-menu-item>
      <el-menu-item index="4-2">{{ $t('Users') }}</el-menu-item>
      <el-menu-item index="4-3">{{ $t('Permissions') }}</el-menu-item>
      <el-menu-item index="4-4">{{ $t('Locks') }}</el-menu-item>
    </el-sub-menu>
    <el-form>
      <el-form-item prop="query" class="search-field"><el-input autocomplete="off" :prefix-icon="Search" :placeholder="$t('Search')"></el-input></el-form-item>
    </el-form>
    <div class="flex-grow" />
    <el-sub-menu index="5">
      <template #title>{{ getLogin() }}</template>
      <el-menu-item index="5-1">{{ $t('Settings') }}</el-menu-item>
      <el-menu-item index="5-2">{{ $t('Logout') }}</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useConfig, useUser } from '~/composables'

defineProps<{ menu: boolean }>();

const config = useConfig() as any
const { getLogin } = useUser()
</script>

<style scoped>
.search-field {
  margin: 0 10px;
}
</style>