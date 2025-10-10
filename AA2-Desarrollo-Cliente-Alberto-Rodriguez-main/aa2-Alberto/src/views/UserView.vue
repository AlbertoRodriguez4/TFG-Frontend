<script setup lang="ts">
import { ref, computed } from 'vue'
import HeaderView from '../views/HeaderView.vue'
import FooterView from '../views/FooterView.vue'
import UserRender from '@/components/Renders/UserRender.vue'

// Estados y filtros
const searchQuery = ref('')
const sortBy = ref('level') // level, xp, recent, alphabetical
const filterBy = ref('all') // all, online, friends, top-players
const viewMode = ref('grid') // grid, list

// Stats globales de la comunidad (ejemplo)
const communityStats = ref({
  totalUsers: 1247,
  activeToday: 342,
  totalCheckIns: 15680,
  totalRooms: 89
})

</script>

<template>
  <v-app>
    <v-main class="bg-black text-white main">
      <v-container fluid class="main-container">
        <!-- Hero Section con Stats -->
        <v-row class="w-100 justify-center mb-8">
          <v-col cols="12" class="text-center">
            <div class="hero-section">
              <h1 class="welcome animate-glow">
                <v-icon class="mr-3" color="#ffcc00" size="40">mdi-account-group</v-icon>
                {{ $t('users') }}
              </h1>
              <p class="subtitle mt-2">Descubre a la comunidad de TheTrainingHub</p>
              
              <!-- Community Stats Cards -->
              <v-row class="stats-row justify-center mt-6">
                <v-col cols="6" sm="3" md="3" v-for="(stat, key) in communityStats" :key="key">
                  <div class="stat-card">
                    <v-icon :color="key === 'activeToday' ? '#4ade80' : '#ffcc00'" size="32" class="mb-2">
                      {{ 
                        key === 'totalUsers' ? 'mdi-account-multiple' :
                        key === 'activeToday' ? 'mdi-account-check' :
                        key === 'totalCheckIns' ? 'mdi-check-circle' :
                        'mdi-door-open'
                      }}
                    </v-icon>
                    <div class="stat-value">{{ stat.toLocaleString() }}</div>
                    <div class="stat-label">
                      {{ 
                        key === 'totalUsers' ? 'Usuarios Totales' :
                        key === 'activeToday' ? 'Activos Hoy' :
                        key === 'totalCheckIns' ? 'Check-ins' :
                        'Salas Activas'
                      }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <v-row class="w-100 justify-center" id="users-container">
          <v-col cols="12" class="d-flex justify-center">
            <div class="users-wrapper" :class="viewMode === 'list' ? 'list-view' : 'grid-view'">
              <UserRender 
                :search-query="searchQuery"
                :sort-by="sortBy"
                :filter-by="filterBy"
                :view-mode="viewMode"
              />
            </div>
          </v-col>
        </v-row>

        <!-- Quick Actions FAB -->
        <v-btn
          color="#ffcc00"
          icon
          size="large"
          class="fab-button"
          elevation="8"
        >
          <v-icon size="32">mdi-account-plus</v-icon>
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.main {
  min-height: 100vh;
  background-image: url('../assets/imgs/gimansio-fondo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

.main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.75) 50%,
    rgba(0, 0, 0, 0.85) 100%
  );
  z-index: 0;
}

.main-container {
  position: relative;
  z-index: 1;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

/* Hero Section */
.hero-section {
  padding: 2rem 0;
}

.welcome {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #ffcc00;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 
    0 0 20px rgba(255, 204, 0, 0.5),
    0 0 40px rgba(255, 204, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 
      0 0 20px rgba(255, 204, 0, 0.5),
      0 0 40px rgba(255, 204, 0, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.8);
  }
  50% {
    text-shadow: 
      0 0 30px rgba(255, 204, 0, 0.8),
      0 0 60px rgba(255, 204, 0, 0.5),
      0 4px 8px rgba(0, 0, 0, 0.8);
  }
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 1px;
}

/* Stats Cards */
.stats-row {
  gap: 1rem;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.15) 0%, rgba(255, 204, 0, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 204, 0, 0.3);
  border-radius: 16px;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 204, 0, 0.6);
  box-shadow: 0 10px 30px rgba(255, 204, 0, 0.3);
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  margin: 0.5rem 0;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Controls Panel */
.controls-panel {
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.9) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 204, 0, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
}

.search-container {
  max-width: 100%;
}

:deep(.search-field .v-field) {
  background: rgba(40, 40, 40, 0.9) !important;
  border: 2px solid rgba(255, 204, 0, 0.3);
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

:deep(.search-field .v-field:hover) {
  border-color: rgba(255, 204, 0, 0.5);
}

:deep(.search-field .v-field--focused) {
  border-color: #ffcc00 !important;
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.3);
}

:deep(.search-field .v-field__input) {
  color: #fff !important;
  padding: 1rem;
}

:deep(.search-field .v-field__prepend-inner) {
  padding-top: 0.75rem;
  color: #ffcc00 !important;
}

:deep(.filter-select .v-field) {
  background: rgba(40, 40, 40, 0.8) !important;
  border: 1px solid rgba(255, 204, 0, 0.3);
  border-radius: 10px;
}

:deep(.filter-select .v-field__input) {
  color: #fff !important;
}

:deep(.filter-select .v-field__prepend-inner) {
  color: #ffcc00 !important;
}

/* Users Container */
#users-container {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.users-wrapper {
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: center;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  justify-items: center;
}

.list-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
}

/* FAB Button */
.fab-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  transition: all 0.3s ease;
}

.fab-button:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 10px 40px rgba(255, 204, 0, 0.5);
}

/* Responsive */
@media (max-width: 960px) {
  .hero-section {
    padding: 1rem 0;
  }

  .controls-panel {
    padding: 1.5rem;
  }

  .stat-card {
    padding: 1rem 0.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 600px) {
  .welcome {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .stats-row {
    gap: 0.5rem;
  }

  .grid-view {
    grid-template-columns: 1fr;
  }
}
</style>