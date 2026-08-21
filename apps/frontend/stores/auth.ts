import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name?: string | null
  email: string
  phone?: string
  dob?: string | null
  role: 'diner' | 'chef' | 'USER' | 'CHEF'
  chefProfileId?: string | null
  chefProfile?: any
  createdAt?: string
}

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })

  const token = ref<string | null>(tokenCookie.value || null)
  const user = ref<User | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isChef = computed(() => {
    if (!user.value?.role) return false
    const roleLower = user.value.role.toLowerCase()
    return roleLower === 'chef'
  })

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken
    tokenCookie.value = newToken
    user.value = newUser
  }

  function logout() {
    token.value = null
    tokenCookie.value = null
    user.value = null
  }

  async function fetchUser() {
    if (!token.value) return false
    const { fetchApi } = useApi()
    const { data, error } = await fetchApi<{ success: boolean; user: User }>('/auth/me')

    if (data?.user) {
      user.value = data.user
      return true
    } else {
      logout()
      return false
    }
  }

  async function signup(payload: { name?: string; email: string; password: string; phone?: string; dob?: string; role?: string }) {
    const { fetchApi } = useApi()
    const { data, error } = await fetchApi<{ success: boolean; token: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: payload,
    })

    if (error) {
      return { success: false, error }
    }

    if (data?.token && data?.user) {
      setAuth(data.token, data.user)
      return { success: true, user: data.user }
    }

    return { success: false, error: 'Registration failed' }
  }

  async function login(credentials: { email: string; password: string }) {
    const { fetchApi } = useApi()
    const { data, error } = await fetchApi<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: credentials,
    })

    if (error) {
      return { success: false, error }
    }

    if (data?.token && data?.user) {
      setAuth(data.token, data.user)
      return { success: true, user: data.user }
    }

    return { success: false, error: 'Login failed' }
  }

  async function initAuth() {
    if (initialized.value) return
    initialized.value = true
    if (tokenCookie.value) {
      token.value = tokenCookie.value
      await fetchUser()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isChef,
    setAuth,
    logout,
    signup,
    login,
    fetchUser,
    initAuth,
  }
})
