export const useApi = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('auth_token')

  const fetchApi = async <T>(endpoint: string, options: Parameters<typeof $fetch>[1] = {}) => {
    const LIVE_BACKEND_URL = 'https://chef-launcher-backend.anawasilay.workers.dev'

    const isBrowser = typeof window !== 'undefined'
    const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

    let baseUrl = config.public?.apiBase || LIVE_BACKEND_URL
    if (!baseUrl || baseUrl.includes('localhost')) {
      baseUrl = LIVE_BACKEND_URL
    }
    baseUrl = baseUrl.replace(/\/$/, '')

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    let url = `${baseUrl}${cleanEndpoint}`

    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      url = url.replace(/http:\/\/(localhost|127\.0\.0\.1):\d+/g, LIVE_BACKEND_URL)
    }

    const token = tokenCookie.value

    const headers = { ...(options.headers as Record<string, string> || {}) } as Record<string, string>
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await $fetch<T>(url, {
        ...options,
        headers,
      })
      return { data: response, error: null }
    } catch (e: any) {
      const status = e?.status || e?.response?.status
      let message =
        e?.data?.error ||
        e?.data?.message ||
        e?.statusText ||
        e?.message ||
        'An error occurred'

      if (typeof message === 'string') {
        message = message.replace(/http:\/\/(localhost|127\.0\.0\.1):\d+/g, LIVE_BACKEND_URL)
      }

      // Intercept 401 Unauthorized errors to clear stale token without redirect flooding on auth pages
      if (status === 401) {
        tokenCookie.value = null
        if (import.meta.client) {
          try {
            localStorage.removeItem('token')
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
          } catch (err) {}
          const route = useRoute()
          if (!route.path.startsWith('/auth/')) {
            navigateTo('/auth/login')
          }
        }
      }

      return {
        data: null,
        error: typeof message === 'string' ? message : JSON.stringify(message),
      }
    }
  }

  return { fetchApi }
}
