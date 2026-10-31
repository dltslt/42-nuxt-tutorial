// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', './modules/xray/index'],
  css: ['~/assets/css/main.css'],
  // Remote font hosts are not required. The page uses the browser's UI font.
  fonts: {
    providers: {
      fontshare: false,
      google: false,
      bunny: false,
      googleicons: false,
      fontsource: false
    }
  },
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
