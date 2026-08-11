// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001'
    }
  }
})
