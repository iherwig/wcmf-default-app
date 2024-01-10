import { createI18n } from 'vue-i18n'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useConfig } from '~/composables/config'
import { useApi } from '~/composables/fetch'

const config = useConfig() as any

// placeholder replacement (see loadLocaleMessages)
const regex = /(%([^%]+)%)/gm
const subst = '{$2}'

async function loadLocaleMessages(): Promise<Record<string, Record<string, string>>> {
  const messages: Record<string, any> = {}
  for (const locale of Object.keys(config.languages)) {
    const { statusCode, error, data } = await useApi(`/messages/${locale}`)
    if (statusCode.value == 200) {
      const translations = data.value as Record<string, string>

      // NOTE: we remove blank translations, to let vue-i18n return the translation keys for undefined translations
      const nonBlankTranslations = Object.fromEntries(Object.entries(translations).filter(([k, v]) => v != ''))
      messages[locale] = nonBlankTranslations
      // NOTE since wcmf messages use %...% as interpolation placeholders,
      // we need to transform them to {...} be used with vue-i18n-next
      Object.keys(messages[locale]).forEach((k) => {
        if (k.match(regex)) {
          const kNew = k.replace(regex, subst)
          const vNew = messages[locale][k].replace(regex, subst)
          messages[locale][kNew] = vNew
        }
      })
    }
    else {
      console.error(`Unable to load locale '${locale}'`)
    }
  }
  return messages
}

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

// https://vue-i18n.intlify.dev/guide/advanced/composition.html
const i18n = createI18n({
  legacy: false,
  locale: config.uiLanguage,
  fallbackLocale: config.uiLanguage,
  missingWarn: false,
  fallbackWarn: false,
  messages: await loadLocaleMessages()
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