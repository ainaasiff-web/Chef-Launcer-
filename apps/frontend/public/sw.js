const CACHE_NAME = 'chef-launcher-pwa-v3'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add('/index.html'))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name)
        })
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/downloads/')) return

  // Handle SPA navigation requests (/chefs/demo-2, /menus, etc.)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy))
            return response
          }
          // Server returned 404 or error for static SPA path -> return /index.html
          return caches.match('/index.html').then((cached) => cached || response)
        })
        .catch(() => {
          return caches.match('/index.html').then((cached) => {
            if (cached) return cached
            return new Response('Network error', { status: 503, headers: { 'Content-Type': 'text/plain' } })
          })
        })
    )
    return
  }

  // Handle standard static asset requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(event.request)
        if (cached) return cached
        return new Response('Network error', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        })
      })
  )
})


