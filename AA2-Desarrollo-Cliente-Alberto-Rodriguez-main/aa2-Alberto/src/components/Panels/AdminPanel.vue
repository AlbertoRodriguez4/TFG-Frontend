<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useItemStore } from '@/stores/itemStore'
import EditUserPopup from '../PopUps/EditUserPopup.vue'
import EditItemPopup from '../PopUps/EditItemPopup.vue'
import type { User } from '@/components/Models/User'
import type { Item } from '@/components/Models/Item'
import router from '@/router'
import { useI18n } from 'vue-i18n'

const store = useUserStore()
const loggedUser = computed(() => store.loggedUser)
const itemStore = useItemStore()
const selectedUser = defineModel<User | null>('selectedUser')
const selectedItem = defineModel<Item | null>('selectedItem')
const showPopup = ref(false)
const userSearch = ref('')
const itemSearch = ref('')
const { t, locale } = useI18n()
locale.value = 'es'

// Stats computadas para el dashboard
const totalUsers = computed(() => store.user.length)
const totalItems = computed(() => itemStore.items.length)
const activeUsers = computed(() => store.user.filter(u => u.role !== 'userMaster').length)

onMounted(async () => {
    if (loggedUser.value?.email && loggedUser.value.passwordhash) {
        await store.getItems(loggedUser.value.email, loggedUser.value.passwordhash)
    }
    if (loggedUser.value?.role === 'userMaster') {
        await store.fetchUser()
        await itemStore.fetchItems()
    }
})

watch(
    () => store.loggedUser,
    (newUser) => {
        if (!newUser || !newUser.email) {
            router.push({ name: 'home' })
        }
    },
    { immediate: true }
)

const openPopup = (item: Item) => {
    selectedItem.value = item
    showPopup.value = true
}

const closePopup = () => {
    showPopup.value = false
    selectedItem.value = null
}

const openUserPopup = (user: User) => {
    selectedUser.value = user
    showPopup.value = true
}

const closeUserPopup = () => {
    showPopup.value = false
    selectedUser.value = null
}

const filteredUsers = computed(() =>
    store.user.filter(user => user.name.toLowerCase().includes(userSearch.value.toLowerCase()))
)

const filteredItems = computed(() =>
    itemStore.items.filter(item => item.name.toLowerCase().includes(itemSearch.value.toLowerCase()))
)
</script>

<template>
  <v-container fluid class="admin-panel">
    <!-- Partículas de fondo -->
    <div class="particles-bg">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
    </div>

    <!-- Header con estadísticas -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="admin-header">
          <v-card class="header-card" dark elevation="12">
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-4">
                <v-avatar size="72" class="admin-avatar mr-4">
                  <span style="font-size: 36px;">👑</span>
                </v-avatar>
                <div>
                  <h1 class="text-h3 font-weight-black mb-2">
                    {{ $t('panel') }} {{ loggedUser?.name }}
                  </h1>
                  <div class="d-flex align-center">
                    <v-chip color="success" size="small" class="mr-2">
                      <v-icon start size="small">mdi-shield-check</v-icon>
                      Admin
                    </v-chip>
                  </div>
                </div>
              </div>

              <!-- Stats Cards -->
              <v-row class="mt-6">
                <v-col cols="12" sm="4">
                  <div class="stat-mini-card stat-cyan">
                    <div class="stat-icon">👥</div>
                    <div>
                      <div class="stat-value">{{ totalUsers }}</div>
                      <div class="stat-label">{{ $t('users') }}</div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="stat-mini-card stat-purple">
                    <div class="stat-icon">🎁</div>
                    <div>
                      <div class="stat-value">{{ totalItems }}</div>
                      <div class="stat-label">{{ $t('items') }}</div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="stat-mini-card stat-pink">
                    <div class="stat-icon">⚡</div>
                    <div>
                      <div class="stat-value">{{ activeUsers }}</div>
                      <div class="stat-label">Activos</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Sección de gestión -->
    <v-row justify="center">
      <!-- USUARIOS -->
      <v-col cols="12" lg="6">
        <v-card class="management-card" elevation="8">
          <v-card-title class="card-title-custom">
            <div class="d-flex align-center">
              <v-avatar size="40" color="cyan" class="mr-3">
                <v-icon color="white">mdi-account-group</v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">{{ $t('users') }}</div>
                <div class="text-caption text-grey">Gestión de usuarios registrados</div>
              </div>
            </div>
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Buscador con estilo gaming -->
            <v-text-field
              v-model="userSearch"
              :label="$t('Buscar usuario...')"
              variant="outlined"
              density="comfortable"
              class="search-field mb-4"
              clearable
              hide-details
            >
              <template v-slot:prepend-inner>
                <v-icon color="cyan">mdi-account-search</v-icon>
              </template>
            </v-text-field>

            <!-- Lista de usuarios -->
            <div class="users-list-container">
              <v-list class="users-list" bg-color="transparent">
                <v-list-item
                  v-for="(user, index) in filteredUsers"
                  :key="user.id"
                  class="user-list-item mb-2"
                  :class="{ 'item-even': index % 2 === 0 }"
                >
                  <template v-slot:prepend>
                    <v-avatar color="cyan-lighten-1" size="40">
                      <span class="text-h6">{{ user.name.charAt(0).toUpperCase() }}</span>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">
                    {{ user.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-grey-lighten-1">
                    {{ user.email }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-btn
                      color="cyan"
                      variant="flat"
                      size="small"
                      class="edit-btn"
                      @click="openUserPopup(user)"
                    >
                      <v-icon start size="medium">mdi-pencil</v-icon>
                      {{ $t('Editar') }}
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>

              <!-- Empty state -->
              <div v-if="filteredUsers.length === 0" class="empty-state">
                <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
                <p class="text-grey mt-4">No se encontraron usuarios</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ITEMS -->
      <v-col cols="12" lg="6">
        <v-card class="management-card" elevation="8">
          <v-card-title class="card-title-custom">
            <div class="d-flex align-center">
              <v-avatar size="40" color="purple" class="mr-3">
                <v-icon color="white">mdi-gift</v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">{{ $t('items') }}</div>
                <div class="text-caption text-grey">Gestión de ítems y recompensas</div>
              </div>
            </div>
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Buscador -->
            <v-text-field
              v-model="itemSearch"
              :label="$t('Buscar ítem...')"
              variant="outlined"
              density="comfortable"
              class="search-field mb-4"
              clearable
              hide-details
            >
              <template v-slot:prepend-inner>
                <v-icon color="purple">mdi-magnify</v-icon>
              </template>
            </v-text-field>

            <!-- Lista de items -->
            <div class="items-list-container">
              <v-list class="items-list" bg-color="transparent">
                <v-list-item
                  v-for="(item, index) in filteredItems"
                  :key="item.id"
                  class="item-list-item mb-2"
                  :class="{ 'item-even': index % 2 === 0 }"
                >
                  <template v-slot:prepend>
                    <v-avatar color="purple-lighten-1" size="40">
                      <v-icon color="white">mdi-gift</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">
                    {{ item.name }}
                  </v-list-item-title>

                  <template v-slot:append>
                    <v-btn
                      color="purple"
                      variant="flat"
                      size="small"
                      class="edit-btn"
                      @click="openPopup(item)"
                    >
                      <v-icon start size="small">mdi-pencil</v-icon>
                      {{ $t('Editar') }}
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>

              <!-- Empty state -->
              <div v-if="filteredItems.length === 0" class="empty-state">
                <v-icon size="64" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
                <p class="text-grey mt-4">No se encontraron ítems</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Popups -->
    <EditItemPopup
      v-if="selectedItem"
      :visible="showPopup"
      :item="selectedItem"
      @close="closePopup"
      @edit="(item) => console.log('Editando', item)"
    />
    <EditUserPopup
      v-if="selectedUser"
      :visible="showPopup"
      :user="selectedUser"
      @close="closeUserPopup"
      @edit="(user) => console.log('Editando', user)"
    />
  </v-container>
</template>

<style scoped>
.admin-panel {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  padding: 2rem 1rem;
}

/* Partículas de fondo */
.particles-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: float 20s infinite;
}

.particle-1 {
  top: 10%;
  left: 10%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent);
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  right: 10%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.1), transparent);
  animation-delay: 5s;
}

.particle-3 {
  bottom: 10%;
  left: 30%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent);
  animation-delay: 10s;
}

.particle-4 {
  top: 30%;
  right: 40%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent);
  animation-delay: 15s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(30px, -30px); }
  50% { transform: translate(-20px, 20px); }
  75% { transform: translate(20px, 10px); }
}

/* Header Card */
.admin-header {
  position: relative;
  z-index: 1;
}

.header-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(88, 28, 135, 0.95) 100%) !important;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-radius: 24px !important;
  position: relative;
  overflow: hidden;
}

.header-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.1), transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(236, 72, 153, 0.1), transparent 50%);
  pointer-events: none;
}

.admin-avatar {
  background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

/* Mini Stats Cards */
.stat-mini-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-mini-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.stat-cyan {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.2));
  border-color: rgba(6, 182, 212, 0.3);
}

.stat-purple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2));
  border-color: rgba(168, 85, 247, 0.3);
}

.stat-pink {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2));
  border-color: rgba(236, 72, 153, 0.3);
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Management Cards */
.management-card {
  background: rgba(30, 41, 59, 0.8) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px !important;
  position: relative;
  z-index: 1;
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-title-custom {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 27, 75, 0.8));
  border-bottom: 2px solid rgba(168, 85, 247, 0.2);
  padding: 1.5rem !important;
}

/* Search Field */
.search-field >>> .v-field {
  background: rgba(51, 65, 85, 0.6) !important;
  border: 2px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-field >>> .v-field:hover {
  border-color: rgba(6, 182, 212, 0.4);
}

.search-field >>> .v-field--focused {
  border-color: rgba(6, 182, 212, 0.6);
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
}

.search-field >>> .v-field__input {
  color: white;
}

/* Lists Container */
.users-list-container,
.items-list-container {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 8px;
}

.users-list-container::-webkit-scrollbar,
.items-list-container::-webkit-scrollbar {
  width: 8px;
}

.users-list-container::-webkit-scrollbar-track,
.items-list-container::-webkit-scrollbar-track {
  background: rgba(51, 65, 85, 0.3);
  border-radius: 4px;
}

.users-list-container::-webkit-scrollbar-thumb,
.items-list-container::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.4);
  border-radius: 4px;
}

.users-list-container::-webkit-scrollbar-thumb:hover,
.items-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.6);
}

/* List Items */
.user-list-item,
.item-list-item {
  background: rgba(51, 65, 85, 0.4) !important;
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px !important;
  padding: 12px 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-list-item:hover,
.item-list-item:hover {
  background: rgba(51, 65, 85, 0.7) !important;
  border-color: rgba(6, 182, 212, 0.3);
  transform: translateX(4px);
}

.item-even {
  background: rgba(51, 65, 85, 0.3) !important;
}

/* Edit Button */
.edit-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(148, 163, 184, 0.6);
}

/* Responsive */
@media (max-width: 960px) {
  .admin-panel {
    padding: 1rem 0.5rem;
  }

  .header-card >>> .v-card-text {
    padding: 1.5rem !important;
  }

  .stat-mini-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .management-card {
    height: auto;
    margin-bottom: 1rem;
  }

  .users-list-container,
  .items-list-container {
    max-height: 350px;
  }
}
</style>