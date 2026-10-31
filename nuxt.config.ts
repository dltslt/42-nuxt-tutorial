// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Lerch, explained',
      // Tells the browser the page has both schemes before the first paint.
      meta: [{ name: 'color-scheme', content: 'light dark' }]
    }
  },
  nitro: {
    experimental: {
      database: true
    },
    database: {
      default: {
        connector: 'node-sqlite',
        options: { path: '.data/tutorial.sqlite' }
      }
    }
  }
})
