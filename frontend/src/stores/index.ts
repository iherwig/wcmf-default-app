import { Ref } from 'vue'
import { Entity } from './model/meta/types'

export * from './history'
export * from './entity'

export interface EntityStore {
  entities: Ref<Entity[]>
  fetch: () => Promise<void>
}