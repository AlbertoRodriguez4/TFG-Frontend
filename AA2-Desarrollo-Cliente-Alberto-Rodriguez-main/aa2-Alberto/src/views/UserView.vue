<script setup lang="ts">
import { ref, computed } from 'vue'
import HeaderView from '../views/HeaderView.vue'
import FooterView from '../views/FooterView.vue'
import UserRender from '@/components/Renders/UserRender.vue'

// Estados y filtros
const searchQuery = ref('')
const sortBy = ref('level') // level, xp, recent, alphabetical
const filterBy = ref('all') // all, online, friends, top-players
const viewMode = ref('list') // grid, list - Por defecto en modo lista

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
      <!-- Particles background effect -->
      <div class="particles-bg">
        <div class="particle" v-for="i in 25" :key="i" :style="{ 
          left: Math.random() * 100 + '%', 
          animationDelay: Math.random() * 8 + 's',
          animationDuration: (4 + Math.random() * 6) + 's'
        }"></div>
      </div>

      <v-container fluid class="main-container">
        <!-- Hero Section Mejorada -->
        <div class="hero-section">
          <div class="hero-glow"></div>
          
          <!-- Icon Container con efecto -->
          <div class="hero-icon-container">
            <div class="icon-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
            </div>
            <v-icon class="hero-icon">mdi-account-group</v-icon>
          </div>

          <!-- Título Principal -->
          <h1 class="hero-title">
            <span class="title-main">{{ $t('COMUNIDAD') }}</span>
            <span class="title-sub">TRAININGHUB</span>
          </h1>
          
          <p class="hero-subtitle">{{ $t('Descubre y conecta con atletas legendarios') }}</p>

          <!-- Divider decorativo -->
          <div class="title-divider">
            <div class="divider-line"></div>
            <v-icon class="divider-icon">mdi-fire</v-icon>
            <div class="divider-line"></div>
          </div>

          <!-- Community Stats Mejoradas -->
          <div class="stats-arena">
            <div 
              v-for="(stat, key) in communityStats" 
              :key="key"
              class="stat-card"
              :class="`stat-${key}`"
            >
              <div class="stat-shine"></div>
              <div class="stat-icon-wrapper">
                <v-icon 
                  :color="key === 'activeToday' ? '#4ade80' : '#ffcc00'" 
                  size="36" 
                  class="stat-icon"
                >
                  {{ 
                    key === 'totalUsers' ? 'mdi-account-multiple' :
                    key === 'activeToday' ? 'mdi-account-check' :
                    key === 'totalCheckIns' ? 'mdi-check-circle' :
                    'mdi-door-open'
                  }}
                </v-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stat.toLocaleString() }}</div>
                <div class="stat-label">
                  {{ 
                    key === 'totalUsers' ? $t('Usuarios') :
                    key === 'activeToday' ? $t('Activos Hoy') :
                    key === 'totalCheckIns' ? $t('Check-ins') :
                    $t('Salas Activas')
                  }}
                </div>
              </div>
              <div class="stat-glow" :class="`glow-${key}`"></div>
            </div>
          </div>
        </div>

        <v-row class="w-100 justify-center mt-8" id="users-container">
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

        <v-btn
          color="#ffcc00"
          icon
          size="x-large"
          class="fab-button"
          elevation="12"
        >
          <v-icon size="32">mdi-account-plus</v-icon>
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Main Container */
.main {
  min-height: 100vh;
  background-image: url('../assets/imgs/gimansio-fondo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  overflow-x: hidden;
}

.main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.9) 100%);
  z-index: 0;
}

/* Particles Background */
.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 204, 0, 0.5);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) translateX(0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(50px) scale(1);
    opacity: 0;
  }
}

.main-container {
  position: relative;
  z-index: 2;
  padding: 3rem 2rem 5rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  text-align: center;
  padding: 2rem 0 3rem;
  margin-bottom: 3rem;
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(255, 204, 0, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* Hero Icon */
.hero-icon-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.icon-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 204, 0, 0.3);
  border-radius: 50%;
  animation: ring-expand 3s ease-out infinite;
}

.ring-1 {
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}

.ring-2 {
  width: 80px;
  height: 80px;
  animation-delay: 1s;
}

.ring-3 {
  width: 80px;
  height: 80px;
  animation-delay: 2s;
}

@keyframes ring-expand {
  0% {
    width: 80px;
    height: 80px;
    opacity: 1;
  }
  100% {
    width: 220px;
    height: 220px;
    opacity: 0;
  }
}

.hero-icon {
  font-size: 4rem !important;
  color: #ffcc00;
  filter: drop-shadow(0 0 30px rgba(255, 204, 0, 0.6));
  animation: icon-pulse 3s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 30px rgba(255, 204, 0, 0.6));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 50px rgba(255, 204, 0, 0.9));
  }
}

/* Hero Title */
.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0 0 1rem;
}

.title-main {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 6px;
  text-transform: uppercase;
}

.title-sub {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
  text-transform: uppercase;
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  letter-spacing: 1px;
  margin-bottom: 2rem;
}

/* Title Divider */
.title-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto 3rem;
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 204, 0, 0.5), transparent);
}

.divider-icon {
  color: #FF6B35;
  font-size: 1.5rem !important;
  animation: fire-flicker 1.5s ease-in-out infinite;
}

@keyframes fire-flicker {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.15);
  }
}

/* Stats Arena */
.stats-arena {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.stat-card {
  position: relative;
  background: linear-gradient(135deg, rgba(20, 30, 48, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 204, 0, 0.3);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  overflow: hidden;
  animation: stat-entrance 0.6s ease-out backwards;
}

@keyframes stat-entrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.stat-card:hover {
  transform: translateY(-10px) scale(1.05);
  border-color: rgba(255, 204, 0, 0.7);
  box-shadow: 
    0 20px 50px rgba(255, 204, 0, 0.3),
    0 0 60px rgba(255, 204, 0, 0.2);
}

.stat-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 204, 0, 0.15),
    transparent
  );
  transition: left 0.6s;
}

.stat-card:hover .stat-shine {
  left: 100%;
}

.stat-icon-wrapper {
  margin-bottom: 1rem;
}

.stat-icon {
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.2) rotate(5deg);
}

.stat-content {
  position: relative;
  z-index: 2;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0.75rem 0 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  opacity: 0.2;
  filter: blur(20px);
  pointer-events: none;
  transition: opacity 0.3s;
}

.stat-card:hover .stat-glow {
  opacity: 0.4;
}

.glow-totalUsers { background: radial-gradient(ellipse, rgba(255, 204, 0, 0.3), transparent); }
.glow-activeToday { background: radial-gradient(ellipse, rgba(74, 222, 128, 0.3), transparent); }
.glow-totalCheckIns { background: radial-gradient(ellipse, rgba(255, 204, 0, 0.3), transparent); }
.glow-totalRooms { background: radial-gradient(ellipse, rgba(255, 204, 0, 0.3), transparent); }

/* Controls Section */
.controls-section {
  margin-bottom: 3rem;
}

.controls-panel {
  background: linear-gradient(135deg, rgba(20, 30, 48, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 204, 0, 0.25);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.controls-panel:hover {
  border-color: rgba(255, 204, 0, 0.4);
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.6);
}

/* Search Field */
.search-wrapper {
  position: relative;
}

:deep(.search-field .v-field) {
  background: rgba(30, 30, 30, 0.8) !important;
  border: 2px solid rgba(255, 204, 0, 0.3) !important;
  border-radius: 16px !important;
  font-size: 1rem;
  transition: all 0.3s ease;
}

:deep(.search-field .v-field:hover) {
  border-color: rgba(255, 204, 0, 0.5) !important;
  background: rgba(35, 35, 35, 0.9) !important;
}

:deep(.search-field .v-field--focused) {
  border-color: #ffcc00 !important;
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.3) !important;
}

:deep(.search-field .v-field__input) {
  color: #fff !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
}

:deep(.search-field .v-field__prepend-inner),
:deep(.search-field .v-field__append-inner) {
  padding-top: 0.5rem !important;
  color: #ffcc00 !important;
}

:deep(.search-field .v-field__prepend-inner .v-icon),
:deep(.search-field .v-field__append-inner .v-icon) {
  font-size: 1.5rem !important;
}

/* Filter Selects */
:deep(.filter-select .v-field) {
  background: rgba(30, 30, 30, 0.8) !important;
  border: 2px solid rgba(255, 204, 0, 0.25) !important;
  border-radius: 16px !important;
  transition: all 0.3s ease;
}

:deep(.filter-select .v-field:hover) {
  border-color: rgba(255, 204, 0, 0.4) !important;
}

:deep(.filter-select .v-field--focused) {
  border-color: #ffcc00 !important;
  box-shadow: 0 0 15px rgba(255, 204, 0, 0.2) !important;
}

:deep(.filter-select .v-field__input) {
  color: #fff !important;
  font-size: 0.95rem !important;
}

:deep(.filter-select .v-field__prepend-inner) {
  color: #ffcc00 !important;
}

/* View Toggle */
.view-toggle {
  display: flex;
  justify-content: center;
}

:deep(.toggle-group) {
  background: rgba(30, 30, 30, 0.8) !important;
  border: 2px solid rgba(255, 204, 0, 0.3) !important;
  border-radius: 16px !important;
  overflow: hidden;
}

:deep(.toggle-group .v-btn) {
  border-radius: 0 !important;
  color: rgba(255, 255, 255, 0.6) !important;
  transition: all 0.3s ease !important;
}

:deep(.toggle-group .v-btn:hover) {
  background: rgba(255, 204, 0, 0.1) !important;
  color: #ffcc00 !important;
}

:deep(.toggle-group .v-btn--active) {
  background: rgba(255, 204, 0, 0.2) !important;
  color: #ffcc00 !important;
}

/* Users Container */
#users-container {
  min-height: 400px;
}

.users-wrapper {
  width: 100%;
  max-width: 1600px;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  justify-items: center;
}

.list-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

/* FAB Button */
.fab-button {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 1000;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
  box-shadow: 
    0 10px 40px rgba(255, 204, 0, 0.4),
    0 0 60px rgba(255, 204, 0, 0.3) !important;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fab-button:hover {
  transform: scale(1.15) rotate(90deg);
  box-shadow: 
    0 15px 50px rgba(255, 204, 0, 0.6),
    0 0 80px rgba(255, 204, 0, 0.5) !important;
}

.fab-button .v-icon {
  color: #000 !important;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stats-arena {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 960px) {
  .main-container {
    padding: 2rem 1.5rem 4rem;
  }

  .hero-section {
    padding: 1.5rem 0 2rem;
    margin-bottom: 2rem;
  }

  .hero-icon {
    font-size: 3rem !important;
  }

  .title-main {
    font-size: 1.3rem;
    letter-spacing: 4px;
  }

  .title-sub {
    font-size: 2.2rem;
    letter-spacing: 2px;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .stats-arena {
    gap: 1rem;
  }

  .stat-card {
    padding: 1.5rem 1rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .controls-panel {
    padding: 1.5rem;
  }

  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .fab-button {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}

@media (max-width: 600px) {
  .main-container {
    padding: 1.5rem 1rem 3rem;
  }

  .hero-icon {
    font-size: 2.5rem !important;
  }

  .title-main {
    font-size: 1.1rem;
    letter-spacing: 3px;
  }

  .title-sub {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .stats-arena {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat-card {
    padding: 1.25rem 0.75rem;
  }

  .stat-icon {
    font-size: 28px !important;
  }

  .stat-value {
    font-size: 1.6rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .controls-panel {
    padding: 1.25rem;
  }

  .grid-view {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .fab-button {
    bottom: 1rem;
    right: 1rem;
  }

  :deep(.toggle-group .v-btn) {
    min-width: 48px !important;
  }
}

@media (max-width: 400px) {
  .stats-arena {
    grid-template-columns: 1fr;
  }

  .title-sub {
    font-size: 1.5rem;
  }
}
</style>