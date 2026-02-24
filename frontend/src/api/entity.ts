import { useApiWithAuth } from '~/composables/fetch'
import { Entity, EntityType } from '~/model/meta/types'
import { GetItemsResponse } from '.'
import { FilterState, SortState } from '~/stores/tableState'
import { useModel } from '~/composables/model'

interface ApiResponse extends Array<Entity>{}

const model = useModel()

const renderFilter = (type: string, filter: FilterState): string => {
  const parts: string[] = []
  Object.keys(filter).forEach((attr) => {
    // TODO adapt according to input type
    parts.push(`${type}.${attr}${encodeURIComponent(`=match=/.*${filter[attr]}.*/i`)}`)
  })
  return parts.join(encodeURIComponent('&'))
}

export const getItemsOfType = <T extends EntityType>(lang: string, type: T, limit: number) => {

  const getItems = async (page: number, sort: SortState, filter: FilterState): Promise<GetItemsResponse> => {
    const offset = (page-1)*limit
    const pageParam = `&limit(${limit}${offset != 0 ? `,${offset}` : ''})=`
    const sortParam = sort ? `&sort(${sort.order == 'descend' ? '-' : '+'}${sort.attribute})` : ''
    const filterParam = filter ? `&query=${renderFilter(model.getSimpleTypeName(type.typeName), filter)}` : ''
    const { statusCode, error, data, response } = await useApiWithAuth<ApiResponse>(`/rest/${lang}/${type.typeName}?completeObjects=true${pageParam}${sortParam}${filterParam}`)
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