export const useApi = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('auth_token')

  const fetchApi = async <T>(endpoint: string, options: Parameters<typeof $fetch>[1] = {}) => {
    const LIVE_BACKEND_URL = 'https://chef-launcher-backend.anawasilay.workers.dev'

    const isBrowser = typeof window !== 'undefined'
    const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

    let baseUrl = isLocalhost ? (config.public?.apiBase || 'http://localhost:3001') : LIVE_BACKEND_URL
    baseUrl = baseUrl.replace(/\/$/, '')

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    let url = `${baseUrl}${cleanEndpoint}`

    if (!isLocalhost && url.includes('localhost')) {
      url = url.replace(/http:\/\/localhost:\d+/g, LIVE_BACKEND_URL)
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

      if (typeof message === 'string' && isBrowser && !isLocalhost) {
        message = message.replace(/http:\/\/localhost:\d+/g, LIVE_BACKEND_URL)
      }

      // Intercept 401 Unauthorized errors to clear stale token and redirect to login
      if (status === 401) {
        tokenCookie.value = null
        if (import.meta.client) {
          const authStore = useAuthStore()
          authStore.logout()
          const router = useRouter()
          router.push('/auth/login')
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
