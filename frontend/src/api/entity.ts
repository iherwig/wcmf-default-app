import { useApiWithAuth } from '~/composables/fetch'
import { Entity, EntityType } from '~/model/meta/types'
import { GetItemsResponse } from '.'

interface ApiResponse extends Array<Entity>{}

export const getItemsOfType = <T extends EntityType>(lang: string, type: T, limit: number) => {

  async function getItems(page: number): Promise<GetItemsResponse> {
    const offset = (page-1)*limit
    const pageParam = `limit(${limit}${offset != 0 ? `,${offset}` : ''})=`
    const { statusCode, error, data, response } = await useApiWithAuth<ApiResponse>(`/rest/${lang}/${type.typeName}?completeObjects=true&${pageParam}`)
    if (statusCode.value == 200 && data.value) {
      const items = data.value
      let totalCount = items.length
      let hasMore = true

      // parse content-range header
      const headers = response.value?.headers
      const matches = headers?.get('content-range')?.match(/^items ([0-9]+)-([0-9]+)\/([0-9]+)$/)
      if (matches) {
        const [, first, last, total] = matches
        totalCount = parseInt(total)
        hasMore = parseInt(last) < totalCount
      }
      const nextPage = hasMore ? page+1 : null

      return {
        items,
        totalCount,
        nextPage
      }
    }
    else {
      throw new Error('Failed to load entities', { cause: error.value })
    }
  }

  return { getItems }
}