import { createI18n, Locale, LocaleMessages, Path } from 'vue-i18n'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useConfig, useApi } from '~/composables'
import { WcmfFormatter } from './formatter'

// load resources
const config = useConfig() as any
const messages = {} //await loadAll(Object.keys(config.languages))

const i18n = createI18n({
  locale: config.uiLanguage,
  fallbackLocale: config.uiLanguage,
  missingWarn: false,
  fallbackWarn: false,
  globalInjection: true,
  legacy: false,
  formatter: new WcmfFormatter({messages}),
  messages
})
export default i18n

const t = i18n.global.t
export { t }

export async function routeMiddleware(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<any> {
  const paramLocale = to.params.locale
  if (!paramLocale) {
    return next(getUserDefaultLocale()+to.path)
  }
  else if (!i18n.global.availableLocales.includes(paramLocale)) {
    return next('/404')
  }
  i18n.global.locale.value = paramLocale
  return next()
}

type ResourceSchema = { [key: Path]: string }

function getBrowserLocale(options = {}) {
  const defaultOptions = { countryCodeOnly: false }
  const opt = { ...defaultOptions, ...options }
  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : (navigator.language)
  if (!navigatorLocale) {
    return undefined
  }
  const trimmedLocale = opt.countryCodeOnly
    ? navigatorLocale.trim().split(/-|_/)[0]
    : navigatorLocale.trim()
  return trimmedLocale
}

function getUserDefaultLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true });
  if (browserLocale && i18n.global.availableLocales.includes(browserLocale)) {
    return browserLocale
  }
  return config.uiLanguage
}

async function loadAll<Locales>(locales: readonly Locale[]) {
  const messages: Record<string, any> = {}
  for (const locale of locales) {
    try {
      messages[locale] = await loadTranslations(locale)
    }
    catch {
      console.error(`Unable to load locale '${locale}'`)
    }
  }
  return messages as LocaleMessages<ResourceSchema, Locales>
}

async function loadTranslations(locale: Locale) {
  const { statusCode, error, data } = await useApi(`/messages/${locale}`)
  if (statusCode.value == 200) {
    const translations = data.value as Record<string, string>

    // NOTE: we remove blank translations, to let vue-i18n return the translation keys for undefined translations
    var nonBlankTranslations = Object.fromEntries(Object.entries(translations).filter(([k, v]) => v != ''))
    return nonBlankTranslations
  }
  else {
    throw new Error(error.value)
  }
}