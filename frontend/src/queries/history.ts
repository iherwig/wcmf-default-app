import { getItems } from '~/api/history'
import { defineQueryOptions } from '@pinia/colada'

const HISTORY_QUERY_KEY = {
  root: ['history'] as const
}

export const getItemsQuery = defineQueryOptions(() => ({
  key: HISTORY_QUERY_KEY.root,
  query: () => getItems()
}))