const CACHE_NAME = 'chef-launcher-pwa-v5'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add('/index.html')).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name)
          }
        })
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  let url
  try {
    url = new URL(event.request.url)
  } catch (e) {
    return
  }

  // Only handle HTTP/HTTPS GET requests from same origin
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/downloads/')) return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request)
          if (response) {
            if (response.status === 200) {
              try {
                const copy = response.clone()
                const cache = await caches.open(CACHE_NAME)
                await cache.put('/index.html', copy)
              } catch (cacheErr) {}
            }
            return response
          }
        } catch (err) {}

        try {
          const cached = await caches.match('/index.html')
          if (cached) return cached
        } catch (err) {}

        return new Response('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/"></head><body>Loading...</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
      })()
    )
    return
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request)
        if (response) {
          if (response.ok && response.type === 'basic') {
            try {
              const copy = response.clone()
              const cache = await caches.open(CACHE_NAME)
              await cache.put(event.request, copy)
            } catch (cacheErr) {}
          }
          return response
        }
      } catch (err) {}

      try {
        const cached = await caches.match(event.request)
        if (cached) return cached
      } catch (err) {}

      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' },
      })
    })()
  )
})




