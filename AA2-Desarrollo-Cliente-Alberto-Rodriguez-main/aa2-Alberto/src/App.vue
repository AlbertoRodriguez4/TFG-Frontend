<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderView from './views/HeaderView.vue';
import FooterView from './views/FooterView.vue';
</script>

<template>
  <v-app class="app-root">
    <!-- Fondo base con textura -->
    <div class="background-base"></div>
    
    <!-- Gradiente animado superior -->
    <div class="gradient-top"></div>
    
    <!-- Grid pattern sutil -->
    <div class="grid-pattern"></div>
    
    <!-- Header fijo -->
    <HeaderView />

    <!-- Contenedor principal -->
    <v-main class="main-wrapper">
      <div class="content-container">
        <!-- Partículas flotantes decorativas -->
        <div class="particles-container">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
        </div>
        
        <!-- RouterView con transiciones -->
        <div class="router-content">
          <RouterView v-slot="{ Component }">
            <transition name="page-transition" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </div>
    </v-main>

    <!-- Footer -->
    <FooterView />
  </v-app>
</template>

<style>
/* Reset global para eliminar bordes blancos */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll; /* permite el scroll */
  scrollbar-width: none; /* oculta la barra en Firefox */
}

/* Oculta la barra en Chrome, Edge y Safari */
body::-webkit-scrollbar {
  display: none;
}


/* Vuetify overrides para eliminar espacios */
.v-application {
  background: transparent !important;
}

.v-application__wrap {
  min-height: 100vh !important;
  background: transparent !important;
}
</style>

<style scoped>
.app-root {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Fondo base oscuro */
.background-base {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at top,
    #0a0a0a 0%,
    #000000 100%
  );
  z-index: -3;
}

/* Gradiente superior animado */
.gradient-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: radial-gradient(
    ellipse at top,
    rgba(255, 204, 0, 0.15) 0%,
    rgba(255, 153, 0, 0.08) 25%,
    transparent 70%
  );
  z-index: -2;
  animation: gradientPulse 8s ease-in-out infinite;
}

@keyframes gradientPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* Grid pattern */
.grid-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 204, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 204, 0, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: -1;
  pointer-events: none;
  opacity: 0.5;
}

/* Main wrapper */
.main-wrapper {
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 0 !important;
  background: transparent !important;
}

/* Contenedor de contenido */
.content-container {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 0;
  margin: 0;
}

/* Partículas decorativas */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 204, 0, 0.15),
    rgba(255, 204, 0, 0.05),
    transparent
  );
  filter: blur(40px);
  pointer-events: none;
  animation: floatParticle 20s ease-in-out infinite;
}

.particle-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation-duration: 18s;
  animation-delay: 0s;
}

.particle-2 {
  width: 250px;
  height: 250px;
  top: 50%;
  right: 10%;
  animation-duration: 22s;
  animation-delay: 4s;
}

.particle-3 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  left: 15%;
  animation-duration: 25s;
  animation-delay: 8s;
}

.particle-4 {
  width: 280px;
  height: 280px;
  top: 30%;
  right: 25%;
  animation-duration: 20s;
  animation-delay: 12s;
}

.particle-5 {
  width: 220px;
  height: 220px;
  bottom: 30%;
  right: 15%;
  animation-duration: 24s;
  animation-delay: 16s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(50px, -80px) scale(1.1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-40px, -50px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: translate(60px, 30px) scale(1.05);
    opacity: 0.35;
  }
}

/* Router content */
.router-content {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 80px);
  z-index: 1;
  padding: 0;
  margin: 0;
}

/* Transiciones de página */
.page-transition-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .particle {
    filter: blur(30px);
  }
}

@media (max-width: 768px) {
  .gradient-top {
    height: 40%;
  }

  .grid-pattern {
    background-size: 30px 30px;
  }

  .particle {
    display: none;
  }
}

@media (max-width: 480px) {
  .gradient-top {
    height: 30%;
  }
}

/* Scroll suave */
html {
  scroll-behavior: smooth;
}

/* Scrollbar personalizada */
:deep(::-webkit-scrollbar) {
  width: 10px;
}

:deep(::-webkit-scrollbar-track) {
  background: rgba(0, 0, 0, 0.3);
}

:deep(::-webkit-scrollbar-thumb) {
  background: rgba(255, 204, 0, 0.5);
  border-radius: 5px;
}

:deep(::-webkit-scrollbar-thumb:hover) {
  background: rgba(255, 204, 0, 0.7);
}
</style>