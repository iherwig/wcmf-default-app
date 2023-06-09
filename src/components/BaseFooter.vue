<template>
  <el-row align="middle">
    <el-col :span="12">
      <div>
        created with <a href="https://wcmf.wemove.com" target="_blank">wCMF</a>
      </div>
    </el-col>
    <el-col :span="12">
      <div w="full" class="flex gap-2 content-right">
        <LocaleChanger />
        <el-button circle @click="toggleDark()">
          <el-icon v-if="isDark" class="el-icon"><Moon /></el-icon>
          <el-icon v-else class="el-icon"><Sunny /></el-icon>
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { isDark, toggleDark } from "~/composables"
import { Moon, Sunny } from '@element-plus/icons-vue'
</script>

<style scoped>
.ep-row {
  height: var(--ep-footer-height);
}
.content-right {
  justify-content: end;
}
</style>