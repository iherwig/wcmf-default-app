import { Entity } from '~/model/meta/types'

export interface GetItemsResponse {
  items: Entity[]
  totalCount: number
  nextPage: number|null
}