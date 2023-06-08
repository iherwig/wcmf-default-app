import { createFetch } from '@vueuse/core'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const contentHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
}

const useApiFetch = createFetch({
  baseUrl: apiBaseUrl,
  combination: 'overwrite',
  options: {
    async beforeFetch({ options }) {
      const token = ''
      options.headers = {
        ...options.headers,
        ...contentHeaders,
        Authorization: `Bearer ${token}`,
      }
      return { options }
    },
    afterFetch(ctx) {
      try {
        ctx.data = JSON.parse(ctx.data)
      }
      catch {
        throw('Invalid JSON')
      }
      return ctx
    },
  },
})
export const useApi = useApiFetch