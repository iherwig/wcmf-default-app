import { useApi } from './fetch'

let allConfig: any = {}
let clientConfig: any = {}
let messages: Record<string, Record<string, string>> = {}

async function loadLocaleMessages(locales: string[]) {
  const messages: Record<string, any> = {}
  for (const locale of locales) {
    const { statusCode, error, data } = await useApi(`/messages/${locale}`)
    if (statusCode.value == 200) {
      const translations = data.value as Record<string, string>

      // NOTE: we remove blank translations, to let vue-i18n return the translation keys for undefined translations
      const nonBlankTranslations = Object.fromEntries(Object.entries(translations).filter(([k, v]) => v != ''))
      messages[locale] = nonBlankTranslations
    }
    else {
      console.error(`Unable to load locale '${locale}'`)
    }
  }
  return messages
}

export async function fetchConfig(): Promise<any> {
  const { statusCode, error, data } = await useApi('')
  if (statusCode.value == 200) {
    allConfig = data.value
    clientConfig = JSON.parse(allConfig.clientConfig)
    messages = await loadLocaleMessages(Object.keys(clientConfig.languages))
    return clientConfig
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

export function useLocaleMessages() {
  return messages
}