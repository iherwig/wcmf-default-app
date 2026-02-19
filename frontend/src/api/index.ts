import { Entity } from '~/model/meta/types'

export * from './history'
export * from './entity'

export interface GetItemsResponse {
  items: Entity[]
  totalCount: number
}