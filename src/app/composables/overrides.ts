import { provide } from 'vue'
import EntityTabs from '~/app/components/EntityTabs.vue'

export const useOverrides = () => {
  // NOTE we provide custom application specific components here
  provide('entityTabs', EntityTabs)
}