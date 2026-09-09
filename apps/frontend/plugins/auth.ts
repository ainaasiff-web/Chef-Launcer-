export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.client) {
    // Unregister legacy Service Workers & clear stale CacheStorage (keep the PWA worker)
    const PWA_CACHE = 'chef-launcher-pwa-v1'
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          const scriptURL =
            registration.active?.scriptURL ||
            registration.installing?.scriptURL ||
            registration.waiting?.scriptURL ||
            ''
          if (!scriptURL.endsWith('/sw.js')) {
            registration.unregister()
          }
        }
      }).catch(() => {})

      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          if (name !== PWA_CACHE) {
            caches.delete(name)
          }
        }
      }).catch(() => {})
    }
  }

  const authStore = useAuthStore()
  await authStore.initAuth()
})
