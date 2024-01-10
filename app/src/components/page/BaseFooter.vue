<template>
  <el-row class="items-center">
    <el-col :span="12">
      <div>
        <small>{{ appProperties.appTitle }} <em>{{ appProperties.version }}</em> created with <a href="https://wcmf.wemove.com" target="_blank">wCMF</a></small>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="flex gap-2 justify-end">
        <LocaleChanger :onlyIfMultiple="true" />
        <el-button circle @click="toggleDark()">
          <el-icon v-if="isDark" class="el-icon"><Moon /></el-icon>
          <el-icon v-else class="el-icon"><Sunny /></el-icon>
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { isDark, toggleDark } from '~/composables/dark'
import { useAppProperties } from '~/composables/config'
import { Moon, Sunny } from '@element-plus/icons-vue'

const appProperties = useAppProperties()
</script>

<style scoped>
.ep-row {
  height: 100%;
}
</style>