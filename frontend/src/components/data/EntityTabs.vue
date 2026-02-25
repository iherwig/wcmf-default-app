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
      display-directive="if"
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
import { RouteLocationRaw } from 'vue-router'
import router from '~/router'
import { useModel } from '~/composables/model'
import { getItemQuery } from '~/queries/entity'
import { useQuery } from '@pinia/colada'

interface Tab {
  title: string
  name: string
  route: RouteLocationRaw
}

const props = defineProps<{
  selectedTab: string
}>()
const emit = defineEmits<{
  tabChange: [type: string]
}>()

const { t, locale } = useI18n()
const model = useModel()

const config = useConfig() as any
const tabs = ref<Tab[]>([])
config.rootTypes.forEach((type: string) => {
  tabs.value.push({
    title: t(`${type} [Pl.]`),
    name: type,
    route: { name: 'EntityList', params: { locale: locale.value, type: type }}
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

const getTab = (tabName: string): Tab|null => {
  const matchingTabs = tabs.value.filter((tab) => tab.name == tabName)
  return matchingTabs.length > 0 ? matchingTabs[0] : null
}

const changeTab = (tabName: string) => {
  const tab = getTab(tabName)
  if (tab != null) {
    activeTab.value = tabName
    router.push(tab.route)
    emit('tabChange', tab.name)
  }
}

watch(props, () => {
  const tabName = props.selectedTab
  const tabExists = getTab(tabName) != null
  if (!tabExists) {
    if (model.isKnownType(tabName)) {
      tabs.value.push({
        title: t(tabName),
        name: tabName,
        route: { name: 'EntityList', params: { locale: locale.value, type: tabName }}
      })
    }
    else {
      /*
      const typeClass = model.getTypeFromOid(tabName)
      const id = model.getIdFromOid(tabName)
      const { state, status } = useQuery(getItemQuery(locale, ref(typeClass), ref(id)))
      watch(status, () => {
        console.log(status.value)
        if (status.value == 'success') {
          tabs.value.push({
            title: typeClass.getSummary(state.value.data ?? undefined),
            name: tabName,
            route: { name: 'Entity', params: { locale: locale.value, type: model.getSimpleTypeName(typeClass.typeName), id: id }}
          })
        }
      })
        */
    }
  }
  activeTab.value = tabName
})
</script>

<style>
</style>