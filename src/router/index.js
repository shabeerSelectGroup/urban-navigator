import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/task3',
      name: 'task3',
      component: () => import('../views/Task3view.vue'),
    },
    {
      path: '/task7',
      name: 'task7',
      component: () => import('../views/Task7view.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
  ],
})

export default router
