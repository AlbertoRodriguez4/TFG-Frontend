<script setup lang="ts">
import { useRoomStore } from '@/stores/RoomStore';
import HeaderView from './HeaderView.vue';
import FooterView from './FooterView.vue';
import RoomRender from '../components/Renders/RoomRender.vue';
const store = useRoomStore()
store.fetchRoom()
</script>

<template>
  <v-app>
    <v-main class="main">
      <v-container fluid class="fill-height d-flex flex-column pa-0">
        <!-- Hero Section con overlay gradiente -->
        <div class="hero-section">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <div class="title-container">
              <div class="icon-pulse">
                <v-icon size="48" color="#00ff88">mdi-dumbbell</v-icon>
              </div>
              <h1 class="hero-title">{{ $t('rooms') }}</h1>
              <p class="hero-subtitle">Entrena en grupo, supera retos, alcanza la grandeza</p>
            </div>
            
            <!-- Stats bar flotante -->
            <div class="stats-bar">
              <div class="stat-item">
                <v-icon size="20" color="#00ff88">mdi-account-group</v-icon>
                <span class="stat-value">{{ store.activeUsers || '...' }}</span> <!-- Mostrar '...' si el valor es null o undefined, crear una funcion que me cuente los active users-->
                <span class="stat-label">Entrenando ahora</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <v-icon size="20" color="#ffcc00">mdi-fire</v-icon>
                <span class="stat-value">{{ store.totalRooms || '...' }}</span> <!-- Mostrar '...' si el valor es null o undefined, crear una funcion que me cuente las salas activas-->
                <span class="stat-label">Salas activas</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <v-icon size="20" color="#ff6b9d">mdi-trophy</v-icon>
                <span class="stat-value">{{ store.dailyChallenges || '...' }}</span> <!-- Mostrar '...' si el valor es null o undefined, crear una funcion que me cuente los retos diarios-->
                <span class="stat-label">Retos hoy</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <v-row class="content-section w-100 ma-0 pa-6" id="inventarios">
          <v-col cols="12">
            <RoomRender />
          </v-col>
        </v-row>

        <!-- Floating action button -->
        <v-btn
          class="floating-action"
          color="#00ff88"
          size="x-large"
          elevation="8"
          icon
        >
          <v-icon size="32">mdi-plus</v-icon>
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.main {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  width: 100%;
  min-height: 400px;
  background-image: url('../assets/imgs/gimansio-fondo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(10, 10, 10, 0.95) 100%
  );
  backdrop-filter: blur(2px);
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

/* Title Section */
.title-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon-pulse {
  animation: pulse 2s ease-in-out infinite;
  background: rgba(0, 255, 136, 0.1);
  padding: 1rem;
  border-radius: 50%;
  border: 2px solid rgba(0, 255, 136, 0.3);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 15px rgba(0, 255, 136, 0);
  }
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #00ff88 0%, #00d9ff 50%, #ffcc00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  text-shadow: 0 0 80px rgba(0, 255, 136, 0.5);
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 0.05em;
  margin: 0;
  text-transform: uppercase;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  padding: 1.5rem 3rem;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  min-width: 40px;
  text-align: center;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

/* Content Section */
.content-section {
  position: relative;
  z-index: 3;
  margin-top: -50px;
}

/* Floating Action Button */
.floating-action {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%) !important;
  box-shadow: 
    0 8px 32px rgba(0, 255, 136, 0.4),
    0 0 0 0 rgba(0, 255, 136, 0.7);
  animation: floatPulse 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

.floating-action:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 
    0 12px 48px rgba(0, 255, 136, 0.6),
    0 0 0 20px rgba(0, 255, 136, 0);
}

@keyframes floatPulse {
  0%, 100% {
    box-shadow: 
      0 8px 32px rgba(0, 255, 136, 0.4),
      0 0 0 0 rgba(0, 255, 136, 0.7);
  }
  50% {
    box-shadow: 
      0 8px 32px rgba(0, 255, 136, 0.4),
      0 0 0 20px rgba(0, 255, 136, 0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    min-height: 300px;
  }
  
  .hero-content {
    padding: 2rem 1rem;
    gap: 2rem;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-radius: 24px;
  }
  
  .stat-divider {
    width: 80%;
    height: 1px;
  }
  
  .stat-item {
    width: 100%;
    justify-content: center;
  }
  
  .floating-action {
    bottom: 1rem;
    right: 1rem;
  }
  
  .content-section {
    margin-top: -30px;
  }
}

/* Animaciones adicionales */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.content-section {
  animation: fadeIn 0.8s ease-out 0.2s both;
}
</style>