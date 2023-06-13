import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiWithAuth, useConfig } from '~/composables'
import { Entity } from './model/meta/entity'

export const useHistoryStore = defineStore('history', () => {
  const config = useConfig()
  const entities = ref<Entity[]>([])

  async function fetch() {
    const { statusCode, error, data } = await useApiWithAuth(config.backendUrl+'?action=history')
    if (statusCode.value == 200) {
      console.log(data)
      entities.value = data
    }
    throw new Error('Failed to load history', { cause: error.value })
  }

  return { entities, fetch }
})