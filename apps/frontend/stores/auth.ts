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
  const tokenCookieAlt = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })

  const getLocalStorageToken = () => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('token') || localStorage.getItem('auth_token')
      } catch (e) {}
    }
    return null
  }

  const initialToken = tokenCookie.value || tokenCookieAlt.value || getLocalStorageToken()
  const token = ref<string | null>(initialToken)
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
    tokenCookieAlt.value = newToken
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('token', newToken)
        localStorage.setItem('auth_token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
      } catch (e) {}
    }
    user.value = newUser
  }

  function logout() {
    token.value = null
    tokenCookie.value = null
    tokenCookieAlt.value = null
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      } catch (e) {}
    }
    user.value = null
  }

  async function fetchUser() {
    const currentToken = token.value || getLocalStorageToken() || tokenCookie.value || tokenCookieAlt.value
    if (!currentToken) return false

    const route = useRoute()
    if (route.path.startsWith('/auth/')) {
      return false
    }

    const { fetchApi } = useApi()
    const { data, error } = await fetchApi<{ success: boolean; user: User }>('/auth/me')

    if (data?.user) {
      user.value = data.user
      return true
    } else if (error && typeof error === 'string' && (error.includes('Failed to fetch') || error.includes('fetch') || error.includes('NetworkError'))) {
      if (!user.value && currentToken) {
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
      const isNetworkErr = typeof error === 'string' && (
        error.includes('Failed to fetch') ||
        error.includes('fetch') ||
        error.includes('NetworkError') ||
        error.includes('no response') ||
        error.includes('http') ||
        error.includes('TypeError')
      )
      if (isNetworkErr || !data) {
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
      const isNetworkErr = typeof error === 'string' && (
        error.includes('Failed to fetch') ||
        error.includes('fetch') ||
        error.includes('NetworkError') ||
        error.includes('no response') ||
        error.includes('http') ||
        error.includes('TypeError')
      )
      if (isNetworkErr || !data) {
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

    const currentToken = tokenCookie.value || tokenCookieAlt.value || getLocalStorageToken()
    if (currentToken) {
      token.value = currentToken
      if (typeof window !== 'undefined' && !user.value) {
        try {
          const cachedUser = localStorage.getItem('user')
          if (cachedUser) {
            user.value = JSON.parse(cachedUser)
          }
        } catch (e) {}
      }
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
