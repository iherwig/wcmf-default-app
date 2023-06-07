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

/*
export function useApi(url: any, method: string='GET', requestData: any=null) {
  console.log(`${method} ${url} ...`)

  const data = ref(null)
  const error = ref(null)
  const status = ref()
  const loading = ref(false)

  const doFetch = async () => {
    data.value = null
    error.value = null
    loading.value = true

    const options: RequestInit = {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }
    if (requestData) {
      options.body = JSON.stringify(requestData)
    }
    try {
      const result = await fetch(unref(url), options)
      status.value = result.status
      try {
        data.value = await result.json()
      }
      catch {
        error.value = 'Invalid JSON' as any
      }
    }
    catch(err) {
      error.value = err as any
    }
    finally {
      loading.value = false
    }
  }

  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    // and avoid the overhead of a watcher
    doFetch()
  }

  return { status, error, data, loading }
}*/