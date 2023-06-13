import { useCookies } from '@vueuse/integrations/useCookies'
import { useConfig } from '~/composables'

export function useAuthToken() {
  const cookies = useCookies()
  const config = useConfig()

  const name = config.authTokenHeaderName

  const tokenValue = cookies.get(config.authTokenCookieName)
  const token = tokenValue && tokenValue.length ? (name == 'Authorization' ? 'Bearer ' : '') + tokenValue : undefined

  return { name, token }
}