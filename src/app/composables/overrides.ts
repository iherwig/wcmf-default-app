import { provide, InjectionKey, Component } from 'vue'

// list of known injection keys for providing overrides
export const EntityTabsInjectionKey: InjectionKey<Component> = Symbol('EntityTabs');

// custom overrides
/**/
import EntityTabs from '~/app/components/EntityTabs.vue'
/**/


export const useOverrides = () => {
  // NOTE we provide custom application specific components here
  provide(EntityTabsInjectionKey, EntityTabs)
}