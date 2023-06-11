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
      <template v-for="(type, index) in config.rootTypes" :key="type">
        <el-menu-item :index="'3-'+(index+1)"><el-icon><collection /></el-icon><span>{{ $t(type) }}</span></el-menu-item>
      </template>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>{{ $t('Administration') }}</template>
      <el-menu-item index="4-1"><el-icon><setting /></el-icon><span>{{ $t('Settings') }}</span></el-menu-item>
      <el-menu-item index="4-2"><el-icon><user /></el-icon><span>{{ $t('Users') }}</span></el-menu-item>
      <el-menu-item index="4-3"><el-icon><key /></el-icon><span>{{ $t('Permissions') }}</span></el-menu-item>
      <el-menu-item index="4-4"><el-icon><lock /></el-icon><span>{{ $t('Locks') }}</span></el-menu-item>
    </el-sub-menu>
    <el-form>
      <el-form-item prop="query" class="search-field"><el-input autocomplete="off" :prefix-icon="Search" :placeholder="$t('Search')"></el-input></el-form-item>
    </el-form>
    <div class="flex-grow" />
    <el-sub-menu index="5">
      <template #title>{{ getLogin() }}</template>
      <el-menu-item index="5-1"><el-icon><setting /></el-icon><span>{{ $t('Settings') }}</span></el-menu-item>
      <el-menu-item index="5-2" @click="handleLogout"><el-icon><close /></el-icon><span>{{ $t('Logout') }}</span></el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { Collection, User, Key, Lock, Search, Setting, Close } from '@element-plus/icons-vue'
import { MenuItemRegistered } from 'element-plus';
import { useConfig, useUser } from '~/composables'
import router from '~/router';

defineProps<{ menu: boolean }>();

const config = useConfig() as any
const { getLogin, destroy } = useUser()

const handleLogout = (item: MenuItemRegistered) => {
  router.push({ name: 'Root' })
  destroy()
}
</script>

<style scoped>
.search-field {
  margin: 0 10px;
}
</style>