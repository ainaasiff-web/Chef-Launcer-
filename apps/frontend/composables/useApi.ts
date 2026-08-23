export const useApi = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('auth_token')

  const fetchApi = async <T>(endpoint: string, options: Parameters<typeof $fetch>[1] = {}) => {
    let rawApiBase = config.public?.apiBase as string | undefined

    const isBrowser = typeof window !== 'undefined'
    const isLocalhostDomain = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

    if (!isBrowser || !isLocalhostDomain) {
      rawApiBase = 'https://chef-launcher-backend.anawasilay.workers.dev'
    } else if (!rawApiBase) {
      rawApiBase = 'http://localhost:3001'
    }

    let baseUrl = rawApiBase.replace(/\/$/, '')
    if (isBrowser && !isLocalhostDomain && baseUrl.includes('localhost')) {
      baseUrl = 'https://chef-launcher-backend.anawasilay.workers.dev'
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    let url = `${baseUrl}${cleanEndpoint}`

    if (isBrowser && !isLocalhostDomain && url.includes('localhost')) {
      url = url.replace(/http:\/\/localhost:\d+/, 'https://chef-launcher-backend.anawasilay.workers.dev')
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

      if (typeof message === 'string' && isBrowser && !isLocalhostDomain) {
        message = message.replace(/http:\/\/localhost:\d+/g, 'https://chef-launcher-backend.anawasilay.workers.dev')
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
