<script setup lang="ts">
import HeaderView from './HeaderView.vue'
import FooterView from './FooterView.vue'
import UserStatsPanel from '../components/Panels/UserStatsPanel.vue'
import InventoryPanel from '../components/Panels/InventoryPanel.vue'
import AdminPanel from '../components/Panels/AdminPanel.vue'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/components/Models/User'
import { computed, onMounted, watch } from 'vue'
import type { Item } from '@/components/Models/Item'
import router from '@/router'

const store = useUserStore()
const loggedUser = computed(() => store.loggedUser)

const selectedItem = defineModel<Item | null>('selectedItem')
const selectedUser = defineModel<User | null>('selectedUser')

watch( // Si el usuario no está logueado, se redirige al inicio, observa una o varias fuentes especificas y decladaraa la accion que se va a realizar
  () => store.loggedUser,
  (newUser) => {
    if (!newUser || !newUser.email) {
      router.push({ name: 'home' })
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-app>
    <v-main class="bg-black text-white main">
      <v-container class="fill-height d-flex flex-column align-center pa-6">
        <v-row class="w-100 justify-center mb-4">
          <UserStatsPanel />
        </v-row>

        <v-row class="w-100 justify-center mb-4">
          <InventoryPanel />
        </v-row>

        <v-row class="w-100 justify-center" v-if="loggedUser?.role === 'userMaster'">
          <AdminPanel
            v-model:selectedItem="selectedItem"
            v-model:selectedUser="selectedUser"
          />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>



<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #0e0e0e;
}


.main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 5rem 2rem 2rem 2rem;
  background-image: url('../assets/imgs/gimansio-fondo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-y: auto;
  height: 650px;
  width: 100%;
}

@media (min-width: 768px) {
  .main {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    align-items: start;
  }
}

.welcome {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffc107;
  display: flex;
  justify-content: flex-end;
  margin-right: 2rem;
  text-shadow: 1px 1px 3px #000;
}

.main::-webkit-scrollbar {
  width: 8px;
}

.main::-webkit-scrollbar-track {
  background: transparent;
}

.main::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>
