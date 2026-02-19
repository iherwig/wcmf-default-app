import { useApiWithAuth } from '~/composables/fetch'
import { Entity, EntityType } from '~/model/meta/types'
import { GetItemsResponse } from '.'

interface ResponseData extends Array<Entity>{}

export const getItemsOfType = <T extends EntityType>(lang: string, type: T) => {

  async function getItems(offset: number=0, limit: number=30): Promise<GetItemsResponse> {
    const limitParam = `limit(${limit}${offset != 0 ? `,${offset}` : ''})=`
    const { statusCode, error, data, response } = await useApiWithAuth<ResponseData>(`/rest/${lang}/${type.typeName}?completeObjects=true&${limitParam}`)
    if (statusCode.value == 200 && data.value) {
      const items = data.value
      let totalCount = items.length

      // parse content-range header
      const headers = response.value?.headers
      const matches = headers?.get('content-range')?.match(/^items ([0-9]+)-([0-9]+)\/([0-9]+)$/)
      if (matches) {
        const [, offset, size, total] = matches
        totalCount = parseInt(total)
      }

      return {
        items,
        totalCount
      }
    }
    else {
      throw new Error('Failed to load entities', { cause: error.value })
    }
  }

  return { getItems }
}