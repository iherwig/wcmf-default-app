import Cookies, { CookieAttributes } from 'js-cookie'

export enum CookieFormat {
  JSON,
  PLAIN
}

export function useCookies() {

  const set = (name: string, value: any, format?: CookieFormat, options?: CookieAttributes): void => {
    value = format == CookieFormat.JSON ? JSON.stringify(value) : value
    Cookies.set(name, value, options)
  }

  const get = (name: string, format?: CookieFormat): any => {
    const value = Cookies.get(name)
    return value && format == CookieFormat.JSON ? JSON.parse(value) : value
  }

  const remove = (name: string, options?: CookieAttributes): any => {
    return Cookies.remove(name, options)
  }

  const removeAll = (options?: CookieAttributes): any => {
    Object.keys(Cookies.get()).forEach((c) => {
      Cookies.remove(c, options)
    })
  }

  return { set, get, remove, removeAll };
}