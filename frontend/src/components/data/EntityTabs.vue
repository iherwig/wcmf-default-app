<template>
  <n-tabs type="card"
    :value="activeTab"
    @update:value="tabChanged"
    @close="tabClosed"
  >
    <n-tab-pane
      v-for="item in tabs"
      :tab="item.title"
      :name="item.name"
      :closable="item.closable"
      display-directive="if"
    >
      <template #tab>
        <n-space justify="space-between">
          <n-icon><component :is="item.icon"/></n-icon>
          <span>{{ t(item.title) }}</span>
        </n-space>
      </template>
      <slot></slot>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import { markRaw, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NTabs, NTabPane, NIcon, NSpace } from 'naive-ui'
import { Document16Regular as DocumentIcon } from '@vicons/fluent'
import router from '~/router'
import { useModel } from '~/composables/model'
import { getItemQuery } from '~/queries/entity'
import { useQuery } from '@pinia/colada'
import { Tab, useTabStateStore } from '~/stores/tabState'

const props = defineProps<{
  selectedTab: string
}>()
const emit = defineEmits<{
  tabChanged: [type: string]
}>()

const { t, locale } = useI18n()
const { tabs, addTab, removeTab } = useTabStateStore()
const model = useModel()

const activeTab = ref(props.selectedTab)

const getTab = (tabName: string): Tab|null => {
  const matchingTabs = tabs.filter((tab) => tab.name == tabName)
  return matchingTabs.length > 0 ? matchingTabs[0] : null
}

const tabClosed = (tabName: string) => {
  const currentTabs = tabs
  let activeName = activeTab.value
  if (activeName === tabName) {
    currentTabs.forEach((tab, index) => {
      if (tab.name === tabName) {
        const nextTab = currentTabs[index+1] || currentTabs[index-1]
        if (nextTab) {
          activeName = nextTab.name
          tabChanged(activeName)
        }
      }
    })
  }
  removeTab(tabName)
}

const tabChanged = (tabName: string) => {
  const tab = getTab(tabName)
  if (tab != null) {
    emit('tabChanged', tabName)
    activeTab.value = tabName
    router.push(tab.route)
  }
}

onMounted(async () => {
  const tabName = props.selectedTab
  const tabExists = getTab(tabName) != null
  if (!tabExists) {
    const typeClass = model.getTypeFromOid(tabName)
    const id = model.getIdFromOid(tabName)
    const query = useQuery(getItemQuery(locale, ref(typeClass), ref(id)))
    await query.refresh()
    if (query.status.value == 'success') {
      addTab({
        title: typeClass.getSummary(query.state.value.data ?? undefined),
        name: tabName,
        icon: markRaw(DocumentIcon),
        closable: true,
        route: { name: 'Entity', params: { locale: locale.value, type: model.getSimpleTypeName(typeClass.typeName), id: id }}
      })
    }
  }
})
</script>

<style>
</style>