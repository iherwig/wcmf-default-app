import { GetItemsResponse } from '~/api'
import { getItems } from '~/api/history'

const PAGE_SIZE = 30

const HISTORY_QUERY_KEY = {
  root: ['history'] as const
}

export const getItemsQuery = {
  key: HISTORY_QUERY_KEY.root,
  query: () => getItems(PAGE_SIZE),
  initialPageParam: 1,
  getNextPageParam: (lastPage: GetItemsResponse) => null
}