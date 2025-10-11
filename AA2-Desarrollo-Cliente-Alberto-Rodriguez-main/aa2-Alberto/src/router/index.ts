import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import HomeView from '@/views/HomeView.vue'
import HomeLoggedView from '@/views/HomeLoggedView.vue'
import PlanView from '@/views/PlanView.vue'
import PurchaseView from '@/views/PurchaseView.vue'
import UserView from '@/views/UserView.vue'
import RoomView from '@/views/RoomView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import RutinaView from '@/views/RutinaView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresGuest: true },
  },
  {
    path: '/homeLogged',
    name: 'homeLogged',
    component: HomeLoggedView,
    meta: { requiresAuth: true },
  },
  {
    path: '/plan',
    name: 'plan',
    component: PlanView,
    meta: { requiresAuth: true },
  },
  {
    path: '/purchase',
    name: 'purchase',
    component: PurchaseView,
    meta: { requiresAuth: true },
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: { requiresAuth: true },
  },
  {
    path: '/room',
    name: 'room',
    component: RoomView,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true },
  }, 
  {
    path: '/rutina',
    name: 'rutina',
    component: RutinaView,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_ROUTER_HISTORY),
  routes,
})

// **Global Guard**
router.beforeEach((to, from, next) => {
  const store = useUserStore()
  const isLogged = !!store.loggedUser?.email

  if (to.meta.requiresAuth && !isLogged) {
    // intenta ir a ruta protegida sin sesión → home público
    return next({ name: 'home' })
  }
  if (to.meta.requiresGuest && isLogged) {
    // intenta ir a home/página pública estando logueado → homeLogged
    return next({ name: 'homeLogged' })
  }
  next()
})

export default router
