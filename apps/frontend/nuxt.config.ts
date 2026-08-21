// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  telemetry: false,

  ssr: false,

  nitro: {
    preset: 'cloudflare-pages-static',
    prerender: {
      autoSubfolderIndex: true,
      routes: ['/']
    }
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.NUXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'https://chef-launcher-backend.anawasilay.workers.dev'
    }
  }
})
