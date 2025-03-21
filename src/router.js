// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Index from './views/Index.vue'
import ChangE from './views/ChangE.vue'
import ChangErule from './views/ChangErule.vue'
import About from './views/About.vue'
import Gun from './views/Gun.vue'
import Nickname from './views/Nickname.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: { hideNavbar: true }
  },
  {
    path: '/changE',
    name: 'ChangE',
    component: ChangE,
    meta: { title: '嫦娥模拟器' }
  },
  {
    path: '/changErule',
    name: 'ChangErule',
    component: ChangErule,
    meta: { title: '嫦娥规则说明' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于工具' }
  },
  {
    path: '/gun',
    name: 'Gun',
    component: Gun,
    meta: { title: '命运左轮' }
  },
  {
    path: '/nickname',
    name: 'Nickname',
    component: Nickname,
    meta: { title: '重复名生成' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router