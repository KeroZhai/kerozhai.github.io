import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/prose.css'
import './styles/markdown.css'
import 'uno.css'

import generatedRoutes from 'pages-generated'
import NProgress from 'nprogress'

import { ViteSSG } from 'vite-ssg'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'

import App from './App.vue'
// import 'prism-theme-vars/base.css'
// import 'prism-theme-vars/themes/vitesse-dark.css'

export const createApp = ViteSSG(
  App,
  {
    routes: [
      ...generatedRoutes,
      {
        path: '/:pathMatch(.*)*',
        name: 'Unknown',
        redirect: '/404-not-found',
      },
    ],
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) return savedPosition

      return { top: 0 }
    },
  },
  ({ router, isClient }) => {
    dayjs.extend(LocalizedFormat)

    if (isClient) {
      router.beforeEach(() => {
        NProgress.start()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  },
)
