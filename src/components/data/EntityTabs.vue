<template>
  <el-tabs
    v-model="activeTab"
    type="border-card"
    closable
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      <template #label>
        <span class="tabs-label">
          <el-icon><files /></el-icon>
          <span>{{ item.title }}</span>
        </span>
      </template>
      <slot></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Files } from '@element-plus/icons-vue'
import { TabPaneName } from 'element-plus'
import { useConfig } from '~/composables'
import router from '~/router'

const props = defineProps<{
  selectedTab: string
}>()

const { t, locale } = useI18n()

const config = useConfig() as any

const tabs = ref<any[]>([])
config.rootTypes.forEach((type: string) => {
  tabs.value.push({
    title: t(`${type} [Pl.]`),
    name: type,
    content: t(`${type} [Pl.]`),
    route: { name: 'EntityList', params: { locale: locale, type: type }}
  })
})
const activeTab = ref(props.selectedTab)

const removeTab = (targetName: TabPaneName) => {
  const currentTabs = tabs.value
  let activeName = activeTab.value
  if (activeName === targetName) {
    currentTabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = currentTabs[index+1] || currentTabs[index-1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  activeTab.value = activeName
  tabs.value = currentTabs.filter((tab) => tab.name !== targetName)
}

const getTab = (targetName: TabPaneName) => {
  const matchingTabs = tabs.value.filter((tab) => tab.name == targetName)
  return matchingTabs.length > 0 ? matchingTabs[0] : null
}

watch(props, () => {
  const type = props.selectedTab
  const tabExists = getTab(type) != null
  if (!tabExists) {
    tabs.value.push({
      title: t(type),
      name: type,
      content: t(type),
      route: { name: 'EntityList', params: { locale: locale, type: type }}
    })
  }
  activeTab.value = type
})
watch(activeTab, () => {
  const tab = getTab(activeTab.value)
  if (tab) {
    router.push(tab.route)
  }
})
</script>

<style>
.tabs-label .el-icon {
  vertical-align: middle;
}
.tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>