import { Ref } from 'vue'
import { useApi } from './fetch'

async function fetchConfig(): Promise<Ref<any>> {
  const { statusCode, error, data } = await useApi('')
  if (statusCode.value == 200) {
    return data
  }
  throw new Error('Failed to load configuration', { cause: error.value })
}
const allConfig = await fetchConfig()
const clientConfig = JSON.parse(allConfig.value.clientConfig)

export function useConfig() {
  return clientConfig
}

export function useAppProperties() {
  const { clientConfig: _, ...appProps } = allConfig.value
  return appProps
}