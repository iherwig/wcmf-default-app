import { getItemsOfType } from '~/api/entity'
import { defineQueryOptions } from '@pinia/colada'
import { EntityType } from '~/model/meta/types'
import { Ref } from 'vue'

const ENTITY_QUERY_KEY = (type: string) => {
  return {
    root: [type] as const
  }
}

export const getItemsQuery = <T extends EntityType>(lang: Ref<string>, type: Ref<T>) => {
  return defineQueryOptions(() => ({
    key: ENTITY_QUERY_KEY(type.value.typeName).root,
    query: () => getItemsOfType<T>(lang.value, type.value).getItems()
  }))
}