import { useConfig } from '~/composables/config'
import { useCookies } from '~/composables/cookies'

export function useAuthToken() {
  const cookies = useCookies()
  const config = useConfig()

  const name = config.authTokenHeaderName

  const tokenValue = cookies.get(config.authTokenCookieName)
  const token = tokenValue && tokenValue.length ? (name == 'Authorization' ? 'Bearer ' : '') + tokenValue : undefined

  return { name, token }
}