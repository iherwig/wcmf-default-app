import { useApi } from './fetch'

let allConfig: any = {}
let clientConfig: any = {}

export async function fetchConfig(): Promise<void> {
  const { statusCode, error, data } = await useApi('')
  if (statusCode.value == 200) {
    allConfig = data.value
    clientConfig = JSON.parse(allConfig.clientConfig)
  }
  else {
    throw new Error('Failed to load configuration', { cause: error.value })
  }
}

export function useConfig() {
  return clientConfig
}

export function useAppProperties() {
  const { clientConfig: _, ...appProps } = allConfig
  return appProps
}