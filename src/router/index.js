import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/main',
      name: 'mainPage',
      component: () => import('../views/MainPage.vue')
    },
    {
      path: '/forgot',
      name: 'forgot password',
      component: () => import('../views/Forgot.vue')
    },
    {
      path: '/generate',
      name: 'generate',
      component: () => import('../views/Generate.vue')
    },
    {
      path: '/upload/new',
      name: 'upload',
      component: () => import('../views/Upload.vue')
    },
    {
      path: '/upload/history',
      name: 'history',
      component: () => import('../views/History.vue')
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('../views/Decrypt.vue')
    },
  ]
})

export default router
