import { Ref } from 'vue'
import { Entity } from './model/meta/entity'

export * from './history'

export interface Store {
  entities: Ref<Entity[]>
  fetch: () => Promise<void>
}