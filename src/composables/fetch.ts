import { createFetch, CreateFetchOptions, BeforeFetchContext, AfterFetchContext } from '@vueuse/core'
import { useAuthToken } from '~/composables'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const contentHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
}

const baseOptions: Partial<CreateFetchOptions> = {
  baseUrl: apiBaseUrl,
  combination: 'overwrite',
}

const beforeFetchImpl = async(ctx: BeforeFetchContext, withAuth: boolean) => {
  ctx.options.headers = {
    ...ctx.options.headers,
    ...contentHeaders,
  }
  // add authorization header if requested
  if (withAuth) {
    const { name, token } = useAuthToken()
    if (token) {
      ctx.options.headers = Object.assign({}, ctx.options.headers, {
        [name]: token
      })
    }
  }
  return ctx
}

const afterFetch = (ctx: AfterFetchContext) => {
  try {
    ctx.data = JSON.parse(ctx.data)
  }
  catch {
    throw('Invalid JSON')
  }
  return ctx
}

const useApiFetch = createFetch({
  ...baseOptions,
  options: {
    async beforeFetch(ctx: BeforeFetchContext) {
      return beforeFetchImpl(ctx, false)
    },
    afterFetch
  },
})
export const useApi = useApiFetch

const useApiFetchWithAuth = createFetch({
  ...baseOptions,
  options: {
    async beforeFetch(ctx: BeforeFetchContext) {
      return beforeFetchImpl(ctx, true)
    },
    afterFetch
  },
})
export const useApiWithAuth = useApiFetchWithAuth