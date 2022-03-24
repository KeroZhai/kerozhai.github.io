import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/prose.css'
import './styles/markdown.css'
import 'uno.css'

import generatedRoutes from 'pages-generated'
import NProgress from 'nprogress'
import { createHead } from '@vueuse/head'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
// import 'prism-theme-vars/base.css'
// import 'prism-theme-vars/themes/vitesse-dark.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...generatedRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'Unknown',
      redirect: '/404',
    },
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition)
      return savedPosition

    return { top: 0 }
  },
})
const head = createHead()

router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})

app.use(head)
app.use(router)
app.mount('#app')
