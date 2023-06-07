import { inject } from 'vue'
import { VueCookies } from 'vue-cookies'

export function useCookies() {
  const cookies = inject<VueCookies>('$cookies')
  return cookies
}