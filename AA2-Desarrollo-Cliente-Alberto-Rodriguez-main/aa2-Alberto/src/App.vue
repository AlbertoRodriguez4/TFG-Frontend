<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HeaderView from './views/HeaderView.vue';
import FooterView from './views/FooterView.vue';
import HomeView from './views/HomeView.vue';
</script>

<template>
  <v-app>
    <!-- Patrón de fondo animado -->
    <div class="background-pattern"></div>
    <div class="background-overlay"></div>
    
    <HeaderView class="header" />

    <v-main class="main-content">
      <v-container fluid class="content-wrapper">
        <!-- Decoración de partículas flotantes -->
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        
        <div class="router-container">
          <RouterView v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </v-container>
    </v-main>

    <FooterView />
  </v-app>
</template>

<style scoped>
/* Patrón de fondo animado */
.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -2;
}

.background-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(79, 172, 254, 0.1) 0%, transparent 50%);
  animation: patternMove 20s ease-in-out infinite;
}

@keyframes patternMove {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(50px, 50px); }
  50% { transform: translate(-30px, 30px); }
  75% { transform: translate(30px, -50px); }
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 2px,
      rgba(255, 255, 255, 0.03) 4px
    );
  z-index: -1;
  pointer-events: none;
}

/* Header */
.header {
  height: 100px;
  flex-shrink: 0;
  z-index: 100;
  position: relative;
}

/* Main content */
.main-content {
  position: relative;
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}

.content-wrapper {
  position: relative;
  margin: 0 auto;
  padding: 2rem;
}

/* Partículas decorativas */
.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  pointer-events: none;
  animation: floatParticle 15s ease-in-out infinite;
}

.particle-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.particle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 3s;
}

.particle-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 15%;
  animation-delay: 6s;
}

.particle-4 {
  width: 120px;
  height: 120px;
  top: 40%;
  right: 20%;
  animation-delay: 9s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.2;
  }
  25% {
    transform: translate(30px, -50px) scale(1.1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-20px, -30px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: translate(40px, 20px) scale(1.05);
    opacity: 0.25;
  }
}

/* Container del router */
.router-container {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  min-height: 500px;
}

/* Transiciones de vistas */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .router-container {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .particle {
    display: none;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem 0;
  }
  
  .router-container {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}
</style>