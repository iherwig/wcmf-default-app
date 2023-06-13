import { ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useConfig, useApi } from '~/composables'

export function useUser() {
  const cookies = useCookies()
  const config = useConfig()
  const userConfig = ref<any>({})

  let stopSessionCheck: Function|undefined = undefined

  const fetchConfigValue = async(key: string) => {
    const { statusCode, error, data } = await useApi(`/user/config/${key}`).get()
    if (statusCode.value != 200) {
      throw new Error(`Failed to load user configuration value '${key}'`)
    }
    userConfig.value[key] = data
    return data
  }

  const storeConfigValue = async(key: string, value: string) => {
    const { statusCode, error, data } = await useApi(`/user/config/${key}`).post({
      value: value
    })
    if (statusCode.value != 200) {
      throw new Error(`Failed to store user configuration value '${key}'`)
    }
  }

  /**
   * Create the user instance. Called, when the session is started
   * @param login The login name
   * @param roles Array of role names
   */
  const create = (login: string, roles: string[]) => {
    cookies.set('user', {
      login: login,
      roles: roles
    })
    initialize()
  }

  /**
   * Initialize the user
   */
  const initialize = async() => {
    // initialize session check
    var sessionCheck = parseInt(config.sessionCheck);
    if (sessionCheck > 0) {
      ({ pause: stopSessionCheck } = useIntervalFn(async() => {
        const alive = await fetchConfigValue('check')
      }, sessionCheck))
    }

    // load config
    userConfig.value.grid = fetchConfigValue('grid')
  }

  /**
   * Destroy the user instance. Called, when the session is ended
   */
  const destroy = () => {
    cookies.keys().forEach((k: string) => {
      cookies.remove(k)
    })
    if (stopSessionCheck) {
      stopSessionCheck()
    }
  }

  /**
   * Get the user's login
   */
  const getLogin = (): string => {
    var user = cookies.get('user')
    return user ? user.login : ''
  }

  /**
   * Check if the user has the given role
   */
  const hasRole = (name: string): boolean => {
    var user = cookies.get('user')
    if (user && user.roles) {
      return user.roles.indexOf(name) !== -1
    }
    return false
  }

  /**
   * Get the user's login
   */
  const isLoggedIn = (): boolean => {
    var user = cookies.get('user')
    return user !== null
  }

  /**
   * Set a user configuration
   * @param name The configuration name
   * @param value The configuration value
   */
  const setConfigValue = async(name: string, value: any) => {
    userConfig.value[name] = value
    storeConfigValue(name, JSON.stringify(value))
  }

  /**
   * Get a user configuration
   */
  const getConfigValue = (name: string): any => {
    return userConfig.value[name];
  }

  return { create, destroy, getLogin, hasRole, isLoggedIn, setConfigValue, getConfigValue };
}