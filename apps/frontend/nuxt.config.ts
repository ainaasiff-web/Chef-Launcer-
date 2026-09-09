// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  telemetry: false,

  ssr: false,

  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'Chef Launcher',
      meta: [
        { name: 'theme-color', content: '#ff6e00' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Chef Launcher' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192.png' },
      ],
    },
  },



  nitro: {
    preset: 'cloudflare-pages'
  },

  experimental: {
    payloadExtraction: false
  },

  // Use root as source directory (Nuxt 3 style layout)
  srcDir: '.',
  dir: {
    pages: 'pages',
    layouts: 'layouts',
    middleware: 'middleware',
    assets: 'assets',
    public: 'public',
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  tailwindcss: {
    cssPath: './assets/css/tailwind.css',
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://chef-launcher-backend.anawasilay.workers.dev'
    }
  }
})
