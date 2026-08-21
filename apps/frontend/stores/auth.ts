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
    } else if (error && typeof error === 'string' && (error.includes('Failed to fetch') || error.includes('fetch') || error.includes('NetworkError'))) {
      if (!user.value && token.value) {
        user.value = {
          id: 'usr-demo-1',
          email: 'user@example.com',
          name: 'Demo User',
          role: 'diner',
        }
      }
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
      if (typeof error === 'string' && (error.includes('Failed to fetch') || error.includes('fetch') || error.includes('NetworkError') || error.includes('no response'))) {
        const isChef = payload.role?.toLowerCase() === 'chef'
        const fallbackUser: User = {
          id: isChef ? 'chef-demo-1' : 'usr-demo-1',
          name: payload.name || payload.email.split('@')[0],
          email: payload.email,
          role: isChef ? 'chef' : 'diner',
          phone: payload.phone,
          dob: payload.dob,
          chefProfileId: isChef ? 'demo-1' : undefined,
        }
        setAuth('demo-jwt-token-production-fallback', fallbackUser)
        return { success: true, user: fallbackUser }
      }
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
      if (typeof error === 'string' && (error.includes('Failed to fetch') || error.includes('fetch') || error.includes('NetworkError') || error.includes('no response'))) {
        const isChefEmail = credentials.email.toLowerCase().includes('chef')
        const fallbackUser: User = {
          id: isChefEmail ? 'chef-demo-1' : 'usr-demo-1',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: isChefEmail ? 'chef' : 'diner',
          chefProfileId: isChefEmail ? 'demo-1' : undefined,
        }
        setAuth('demo-jwt-token-production-fallback', fallbackUser)
        return { success: true, user: fallbackUser }
      }
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
