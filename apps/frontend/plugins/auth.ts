export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.client) {
    // Unregister legacy Service Workers & clear stale CacheStorage
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister()
        }
      }).catch(() => {})
    }

    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name)
        }
      }).catch(() => {})
    }

    // Migrate hash routes (/#/auth/login -> /auth/login)
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const cleanPath = window.location.hash.replace(/^#/, '')
      window.history.replaceState(null, '', cleanPath)
    }
  }

  const authStore = useAuthStore()
  await authStore.initAuth()
})
