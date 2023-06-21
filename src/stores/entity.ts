import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiWithAuth, useConfig } from '~/composables'
import { Entity, EntityType } from './model/meta/entity'
import { EntityStore } from '.'

interface ResponseData {
  list: Entity[],
  totalCount: number
}

export const useEntityStore = <T extends EntityType>(lang: string, type: T) => defineStore<string, EntityStore>('entity', () => {
  const config = useConfig()
  const entities = ref<Entity[]>([])

  async function fetch(limit: number=30) {
    const { statusCode, error, data } = await useApiWithAuth<ResponseData>(config.backendUrl+`rest/${lang}/${type.typeName}`)
    if (statusCode.value == 200 && data.value) {
      entities.value = data.value.list
    }
    else {
      throw new Error('Failed to load entities', { cause: error.value })
    }
  }

  return { entities, fetch }
})()