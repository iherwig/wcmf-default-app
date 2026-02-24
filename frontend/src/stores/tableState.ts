import { defineStore } from "pinia"
import { ref } from "vue"

type SortOrder = 'ascend'|'descend'|false

export interface SortState {
  attribute: string
  order: SortOrder
}

export interface FilterState {
  [attribute: string]: string
}

export const useTableStateStore = defineStore('table-state', () => {
  const sort = ref<Record<string, SortState>>({})
  const filter = ref<Record<string, FilterState>>({})

  const setSort = (type: string, sortState: SortState) => {
    sort.value[type] = sortState
  }

  const getSort = (type: string) => {
    return sort.value[type]
  }

  const getSortValue = (type: string, attribute: string): SortOrder => {
    return sort.value[type]?.attribute == attribute ? sort.value[type].order : false
  }

  const getFilter = (type: string): FilterState => {
    return filter.value[type]
  }

  const getFilterValue = (type: string, attribute: string): string => {
    return filter.value[type] ? (filter.value[type][attribute] ?? '') : ''
  }

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

  return { setSort, getSort, getSortValue, getFilter, getFilterValue, setFilterValue }
})