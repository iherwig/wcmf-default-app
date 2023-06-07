import { Ref, ref } from 'vue'
import { useApi } from './fetch'

async function fetchConfig(): Promise<Ref<any>> {
  const { statusCode, error, data } = await useApi('')
  if (statusCode.value == 200) {
    return data
  }
  console.error('Failed to load configuration', error.value)
  return ref({});
}
const allConfig = await fetchConfig()
const clientConfig = JSON.parse(allConfig.value.clientConfig)

export function useConfig() {
  return clientConfig
}