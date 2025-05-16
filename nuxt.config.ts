export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    baseURL: '/', // ローカル生成時は '/' に
  },
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'] // ここを追加
    }
  }
})