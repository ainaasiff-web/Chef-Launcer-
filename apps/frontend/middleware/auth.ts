export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const token =
    useCookie('token').value ||
    useCookie('auth_token').value ||
    (typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('auth_token') : null)

  const authStore = useAuthStore()

  if (token && !authStore.token) {
    authStore.token = token
  }

  if (token && !authStore.user && typeof window !== 'undefined') {
    try {
      const cachedUser = localStorage.getItem('user')
      if (cachedUser) {
        authStore.user = JSON.parse(cachedUser)
      }
    } catch (e) {}
  }

  if (!token && to.path.startsWith('/dashboard')) {
    return navigateTo('/auth/login')
  }
})
