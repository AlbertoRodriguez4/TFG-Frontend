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
import JoinRoomView from '@/views/JoinRoomView.vue'

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
  },
  {
    path: '/sala',
    name: 'sala',
    component: JoinRoomView,
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Scroll en window
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        
        // Scroll en el body por si acaso
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        
        // También en el v-main de Vuetify
        const mainElement = document.querySelector('.v-main')
        if (mainElement) {
          mainElement.scrollTop = 0
        }
        
        resolve({ top: 0, left: 0 })
      }, 100) // Delay de 100ms para asegurar que el DOM esté renderizado
    })
  }
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
