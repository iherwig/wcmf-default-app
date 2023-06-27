import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiWithAuth, useConfig } from '~/composables'
import { Entity } from './model/meta/entity'
import { EntityStore } from '.'

interface ResponseData {
  list: Entity[],
  totalCount: number
}

export const useHistoryStore = () => defineStore<string, EntityStore>('history', () => {
  const config = useConfig()
  const entities = ref<Entity[]>([])

  async function fetch(limit: number=30) {
    const { statusCode, error, data } = await useApiWithAuth<ResponseData>(config.backendUrl+`?action=history&limit=${limit}`)
    if (statusCode.value == 200 && data.value) {
      entities.value = data.value.list
    }
    else {
      throw new Error('Failed to load history', { cause: error.value })
    }
  }

  return { entities, fetch }
})()