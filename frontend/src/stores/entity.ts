import { Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiWithAuth } from '~/composables/fetch'
import { Entity, EntityType } from './model/meta/types'
import { EntityStore } from '.'

interface ResponseData extends Array<Entity>{}

export const useEntityStore = <T extends EntityType>(lang: Ref<string>, type: Ref<T|undefined>) => defineStore<string, EntityStore>('entity', () => {
  const entities = ref<Entity[]>([])

  async function fetch(limit: number=30) {
    if (!lang.value || !type.value) {
      return
    }
    const { statusCode, error, data } = await useApiWithAuth<ResponseData>(`/rest/${lang.value}/${type.value.typeName}?completeObjects=true`)
    if (statusCode.value == 200 && data.value) {
      entities.value = data.value
    }
    else {
      throw new Error('Failed to load entities', { cause: error.value })
    }
  }

  return { entities, fetch }
})()