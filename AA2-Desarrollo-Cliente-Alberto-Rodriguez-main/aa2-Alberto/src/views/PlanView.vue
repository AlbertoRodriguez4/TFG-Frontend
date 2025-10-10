<script setup lang="ts">
import HeaderView from './HeaderView.vue'
import FooterView from './FooterView.vue'
import PlanRender from '@/components/Renders/PlanRender.vue'
</script>

<template>
  <v-app>
    <v-main class="main">
      <v-container fluid class="fill-height d-flex flex-column pa-0">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <!-- Animated Background Elements -->
            <div class="floating-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>

            <!-- Title Section -->
            <div class="title-container">
              <div class="title-decoration">
                <v-icon size="60" color="#ffcc00">mdi-trophy-variant</v-icon>
              </div>
              <h1 class="hero-title">Planes Premium</h1>
              <p class="hero-subtitle">Impulsa tu entrenamiento al siguiente nivel</p>
              
              <!-- Benefits Banner -->
              <div class="benefits-banner">
                <div class="benefit-pill">
                  <v-icon size="18" color="#00ff88">mdi-lightning-bolt</v-icon>
                  <span>Acceso Inmediato</span>
                </div>
                <div class="benefit-pill">
                  <v-icon size="18" color="#00d9ff">mdi-account-group</v-icon>
                  <span>Comunidad Exclusiva</span>
                </div>
                <div class="benefit-pill">
                  <v-icon size="18" color="#ff6b9d">mdi-chart-line</v-icon>
                  <span>Tracking Avanzado</span>
                </div>
              </div>
            </div>

            <!-- Stats Counter -->
            <div class="stats-counter">
              <div class="stat-box">
                <span class="stat-number">1000+</span>
                <span class="stat-label">Miembros Activos</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-box">
                <span class="stat-number">98%</span>
                <span class="stat-label">Satisfacción</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-box">
                <span class="stat-number">24/7</span>
                <span class="stat-label">Soporte</span>
              </div>
            </div>
          </div>

          <!-- Scroll Indicator -->
          <div class="scroll-indicator">
            <v-icon size="32" color="#00ff88" class="bounce">mdi-chevron-down</v-icon>
          </div>
        </div>

        <!-- Plans Section -->
        <div class="plans-section">
          <PlanRender />
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
          <div class="cta-content">
            <h2 class="cta-title">¿No estás seguro qué plan elegir?</h2>
            <p class="cta-text">Nuestro equipo puede ayudarte a encontrar el plan perfecto para tus objetivos</p>
            <v-btn
              size="x-large"
              class="cta-button"
              elevation="0"
            >
              <v-icon class="mr-2">mdi-chat</v-icon>
              Hablar con un Asesor
            </v-btn>
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="trust-section">
          <div class="trust-badge">
            <v-icon size="32" color="#00ff88">mdi-shield-check</v-icon>
            <span>Pago Seguro</span>
          </div>
          <div class="trust-badge">
            <v-icon size="32" color="#00d9ff">mdi-lock</v-icon>
            <span>Datos Protegidos</span>
          </div>
          <div class="trust-badge">
            <v-icon size="32" color="#ffcc00">mdi-clock-fast</v-icon>
            <span>Activación Instantánea</span>
          </div>
          <div class="trust-badge">
            <v-icon size="32" color="#ff6b9d">mdi-cancel</v-icon>
            <span>Cancela Cuando Quieras</span>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.main {
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 600px;
  width: 100%;
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
    rgba(0, 0, 0, 0.5) 0%,
    rgba(10, 10, 10, 0.85) 70%,
    rgba(10, 10, 10, 1) 100%
  );
  backdrop-filter: blur(3px);
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

/* Floating Shapes */
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: #00ff88;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: #00d9ff;
  top: 50%;
  right: 10%;
  animation-delay: -7s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: #ffcc00;
  bottom: 20%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Title Container */
.title-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 900px;
}

.title-decoration {
  display: inline-flex;
  padding: 1.5rem;
  background: rgba(255, 204, 0, 0.1);
  border-radius: 50%;
  border: 3px solid rgba(255, 204, 0, 0.3);
  animation: pulse 3s ease-in-out infinite;
  box-shadow: 0 0 40px rgba(255, 204, 0, 0.3);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(255, 204, 0, 0);
  }
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #ffcc00 0%, #ff6b9d 50%, #00d9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  text-shadow: 0 0 80px rgba(255, 204, 0, 0.5);
  animation: titleGlow 4s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 0.05em;
  margin: 0;
}

/* Benefits Banner */
.benefits-banner {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.benefit-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  animation: slideUp 0.6s ease-out backwards;
}

.benefit-pill:nth-child(1) {
  animation-delay: 0.2s;
}

.benefit-pill:nth-child(2) {
  animation-delay: 0.4s;
}

.benefit-pill:nth-child(3) {
  animation-delay: 0.6s;
}

.benefit-pill:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stats Counter */
.stats-counter {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  padding: 2rem 3rem;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.8s ease-out 0.8s backwards;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00ff88, #00d9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

/* Plans Section */
.plans-section {
  position: relative;
  z-index: 3;
  margin-top: -80px;
  padding: 0 2rem 4rem;
}

/* CTA Section */
.cta-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 217, 255, 0.1));
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 1rem 0;
}

.cta-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.cta-button {
  background: linear-gradient(135deg, #00ff88, #00d9ff) !important;
  color: #000 !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.5rem 3rem !important;
  border-radius: 50px !important;
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 255, 136, 0.6);
}

/* Trust Section */
.trust-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.trust-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  min-width: 180px;
  transition: all 0.3s ease;
}

.trust-badge:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
}

.trust-badge span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 960px) {
  .hero-section {
    min-height: 500px;
  }

  .stats-counter {
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    border-radius: 24px;
  }

  .stat-divider {
    width: 80%;
    height: 1px;
  }

  .benefits-banner {
    flex-direction: column;
    align-items: stretch;
  }

  .benefit-pill {
    justify-content: center;
  }

  .plans-section {
    margin-top: -40px;
  }

  .trust-section {
    gap: 1rem;
  }

  .trust-badge {
    min-width: 150px;
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .hero-content {
    padding: 2rem 1rem;
  }

  .title-decoration {
    padding: 1rem;
  }

  .title-decoration v-icon {
    font-size: 40px !important;
  }

  .cta-section {
    padding: 2rem 1rem;
  }

  .cta-button {
    width: 100%;
  }
}
</style>