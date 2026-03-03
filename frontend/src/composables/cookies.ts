import Cookies from 'js-cookie'

export const CookieFormat = {
  JSON: 'json',
  PLAIN: 'plain'
} as const
export type CookieFormat = typeof CookieFormat[keyof typeof CookieFormat]

export function useCookies() {

  const set = (name: string, value: any, format?: CookieFormat, options?: Cookies.CookieAttributes): void => {
    value = format == CookieFormat.JSON ? JSON.stringify(value) : value
    Cookies.set(name, value, options)
  }

  const get = (name: string, format?: CookieFormat): any => {
    const value = Cookies.get(name)
    return value && format == CookieFormat.JSON ? JSON.parse(value) : value
  }

  const remove = (name: string, options?: Cookies.CookieAttributes): any => {
    return Cookies.remove(name, options)
  }

  const removeAll = (options?: Cookies.CookieAttributes): any => {
    Object.keys(Cookies.get()).forEach((c) => {
      Cookies.remove(c, options)
    })
  }

  return { set, get, remove, removeAll };
}