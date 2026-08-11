export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const fetchApi = async <T>(endpoint: string, options: Parameters<typeof $fetch>[1] = {}) => {
    const headers = { ...(options.headers as Record<string, string> || {}) } as Record<string, string>
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    try {
      const response = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers,
      })
      return { data: response, error: null }
    } catch (e: any) {
      const message = e?.data?.error || e?.message || 'An error occurred'
      return { data: null, error: message }
    }
  }

  return { fetchApi }
}
