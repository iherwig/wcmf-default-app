import { getItemsOfType } from '~/api/entity'
import { EntityType } from '~/model/meta/types'
import { reactive, Ref } from 'vue'
import { GetItemsResponse } from '~/api'
import { useTableStateStore } from '~/stores/tableState'

const PAGE_SIZE = 30

const ENTITY_QUERY_KEY = (type: string) => {
  return {
    root: [type] as const
  }
}

const { getSort, getFilter } = useTableStateStore()

export const getItemsQuery = <T extends EntityType>(lang: Ref<string>, type: Ref<T>) => {
  return reactive({
    key: () => [ENTITY_QUERY_KEY(type.value.typeName).root, getSort(type.value.typeName), getFilter(type.value.typeName)],
    query: (context: { pageParam: number}) => getItemsOfType<T>(lang.value, type.value, PAGE_SIZE)
        .getItems(context.pageParam, getSort(type.value.typeName), getFilter(type.value.typeName)),
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetItemsResponse) =>  lastPage?.nextPage ?? null
  })
}