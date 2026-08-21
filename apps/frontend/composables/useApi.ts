export const useApi = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('auth_token')

  const fetchApi = async <T>(endpoint: string, options: Parameters<typeof $fetch>[1] = {}) => {
    const apiBase = config.public.apiBase || 'http://localhost:3001'
    const token = tokenCookie.value

    const headers = { ...(options.headers as Record<string, string> || {}) } as Record<string, string>
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await $fetch<T>(`${apiBase}${endpoint}`, {
        ...options,
        headers,
      })
      return { data: response, error: null }
    } catch (e: any) {
      const status = e?.status || e?.response?.status
      const message =
        e?.data?.error ||
        e?.data?.message ||
        e?.statusText ||
        e?.message ||
        'An error occurred'

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
