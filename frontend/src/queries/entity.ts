import { getItems, getItem } from '~/api/entity'
import { EntityType } from '~/model/meta/types'
import { reactive, Ref } from 'vue'
import { GetItemsResponse } from '~/api'
import { useTableStateStore } from '~/stores/tableState'

const PAGE_SIZE = 30

const ENTITY_QUERY_KEY = (type: Ref<EntityType>) => {
  return {
    root: [type.value.typeName] as const
  }
}

const { getSort, getFilter } = useTableStateStore()

export const getItemsQuery = (lang: Ref<string>, type: Ref<EntityType>) => {
  return reactive({
    key: () => [ENTITY_QUERY_KEY(type).root, getSort(type.value.typeName), getFilter(type.value.typeName)],
    query: (context: { pageParam: number}) => getItems(lang, type, PAGE_SIZE, context.pageParam, getSort(type.value.typeName), getFilter(type.value.typeName)),
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetItemsResponse) =>  lastPage?.nextPage ?? null
  })
}

export const getItemQuery = (lang: Ref<string>, type: Ref<EntityType>, id: Ref<string|number>) => {
  return reactive({
    key: () => [ENTITY_QUERY_KEY(type).root, id],
    query: () => getItem(lang, type, id)
  })
}