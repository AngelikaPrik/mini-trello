import BoardPage from '@/pages/BoardPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [{ path: '/board/:id', name: 'board', component: BoardPage, props: true }]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
