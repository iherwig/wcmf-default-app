import { useApiWithAuth } from '~/composables/fetch'
import { useModel } from '~/composables/model'
import { Entity } from '~/model/meta/types'
import { HistoryItem } from '~/model/HistoryItem'
import { GetItemsResponse } from '.'

// register HistoryItem type
const model = useModel()
model.registerType(new HistoryItem())

interface ResponseData {
  list: Entity[],
  totalCount: number
}

export async function getItems(limit: number=30): Promise<GetItemsResponse> {
  const { statusCode, error, data } = await useApiWithAuth<ResponseData>(`?action=history&limit=${limit}`)
  if (statusCode.value == 200 && data.value) {
    return {
      items: data.value.list,
      totalCount: data.value.totalCount
    }
  }
  else {
    throw new Error('Failed to load history', { cause: error.value })
  }
}