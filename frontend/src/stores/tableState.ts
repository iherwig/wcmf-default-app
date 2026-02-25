import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useModel } from "~/composables/model"

type SortOrder = 'ascend'|'descend'|false

export interface SortState {
  attribute: string
  order: SortOrder
}

export interface FilterState {
  [attribute: string]: string
}

const model = useModel()

export const useTableStateStore = defineStore('table-state', () => {
  const sort = ref<Record<string, SortState>>({})
  const filter = ref<Record<string, FilterState>>({})

  const setSort = (type: string, sortState: SortState) => {
    sort.value[type] = sortState
  }

  const getSort = computed(() => {
    return (type: string) => sort.value[type]
  })

  const getSortValue = computed(() => {
    return (type: string, attribute: string): SortOrder => sort.value[type]?.attribute == attribute ? sort.value[type].order : false
  })

  const setFilterValue = (type: string, attribute: string, value: string) => {
    if (!filter.value[type]) {
      filter.value[type] = {}
    }
    if (value && value.length > 0) {
      filter.value[type][attribute] = value
    }
    else {
      delete filter.value[type][attribute]
    }
  }

  const getFilter = (type: string): FilterState => {
    return filter.value[type]
  }

  const getFilterValue = computed(() => {
    return (type: string, attribute: string): string => filter.value[type]?.[attribute] ?? ''
  })

  return { setSort, getSort, getSortValue, setFilterValue, getFilter, getFilterValue }
})