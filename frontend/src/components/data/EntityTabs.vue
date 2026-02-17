<template>
  <n-tabs type="card" animated
    :value="activeTab"
    :closable="true"
    @update:value="changeTab"
    @close="closeTab"
  >
    <n-tab-pane
      v-for="item in tabs"
      :tab="item.title"
      :name="item.name"
    >
      <template #tab>
        <n-space justify="space-between">
          <n-icon><list-icon /></n-icon>
          <span>{{ item.title }}</span>
        </n-space>
      </template>
      <slot></slot>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NTabs, NTabPane, NIcon, NSpace } from 'naive-ui'
import { TextBulletListLtr16Regular as ListIcon } from '@vicons/fluent'
import { useConfig } from '~/composables/config'
import router from '~/router'

const props = defineProps<{
  selectedTab: string
}>()
const emit = defineEmits<{
  tabChange: [type: string]
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

const closeTab = (tabName: string) => {
  const currentTabs = tabs.value
  let activeName = activeTab.value
  if (activeName === tabName) {
    currentTabs.forEach((tab, index) => {
      if (tab.name === tabName) {
        const nextTab = currentTabs[index+1] || currentTabs[index-1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  activeTab.value = activeName
  tabs.value = currentTabs.filter((tab) => tab.name !== tabName)
}

const getTab = (tabName: string) => {
  const matchingTabs = tabs.value.filter((tab) => tab.name == tabName)
  return matchingTabs.length > 0 ? matchingTabs[0] : null
}

const changeTab = (tabName: string) => {
  activeTab.value = tabName
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
  emit('tabChange', tab.name)
  if (tab) {
    router.push(tab.route)
  }
})
</script>

<style>
</style>