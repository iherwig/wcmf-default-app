import { createI18n } from 'vue-i18n'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useConfig, useLocaleMessages } from '~/composables'

// load resources
const config = useConfig() as any
const messages = useLocaleMessages()

// NOTE since wcmf messages use %...% as interpolation placeholders,
// we need to transform them to {...} be used with vue-i18n-next
const regex = /(%([^%]+)%)/gm
const subst = '{$2}'
Object.keys(messages).forEach((locale) => {
  Object.keys(messages[locale]).forEach((k) => {
    if (k.match(regex)) {
      const kNew = k.replace(regex, subst)
      const vNew = messages[locale][k].replace(regex, subst)
      messages[locale][kNew] = vNew
    }
  })
})

// https://vue-i18n.intlify.dev/guide/advanced/composition.html
const i18n = createI18n({
  legacy: false,
  locale: config.uiLanguage,
  fallbackLocale: config.uiLanguage,
  missingWarn: false,
  fallbackWarn: false,
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