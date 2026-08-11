import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<{ id: string; email: string; role: 'CHEF' | 'USER' | 'ADMIN'; isVerified?: boolean } | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isChef = computed(() => user.value?.role === 'CHEF')

  function setAuth(newToken: string, newUser: any) {
    token.value = newToken
    user.value = newUser
    if (import.meta.client) {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    }
  }

  function logout() {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  function initAuth() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  return { token, user, isAuthenticated, isChef, setAuth, logout, initAuth }
})
