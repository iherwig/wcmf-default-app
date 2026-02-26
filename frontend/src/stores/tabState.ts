import { defineStore } from "pinia"
import { Component, markRaw, ref } from "vue"
import { useI18n } from "vue-i18n"
import { RouteLocationRaw } from "vue-router"
import { TextBulletListLtr16Regular as ListIcon } from '@vicons/fluent'
import { useConfig } from "~/composables/config"

export interface Tab {
  title: string
  name: string
  icon: Component
  closable: boolean
  route: RouteLocationRaw
}

export const useTabStateStore = defineStore('tab-state', () => {
  const { locale } = useI18n()
  const config = useConfig() as any

  // setup initial type tabs
  const typeTabs: Tab[] = []
  config.rootTypes.forEach((type: string) => {
    typeTabs.push({
      title: `${type} [Pl.]`,
      name: type,
      icon: markRaw(ListIcon),
      closable: false,
      route: { name: 'EntityList', params: { locale: locale.value, type: type }}
    })
  })

  const tabs = ref<Tab[]>(typeTabs)

  const addTab = (tab: Tab) => {
    tabs.value.push(tab)
  }

  const removeTab = (tabName: string) => {
    const i = tabs.value.findIndex((tab) => tab.name == tabName);
    tabs.value.splice(i, 1)
  }

  return { tabs, addTab, removeTab }
})