<script setup lang="ts">
import HeaderView from './HeaderView.vue'
import FooterView from './FooterView.vue'
import PlanRender from '@/components/Renders/PlanRender.vue'
</script>

<template>
  <v-app>
    <v-main class="main">
      <!-- Particles Background -->
      <div class="particles-bg">
        <div class="particle" v-for="i in 35" :key="i" :style="{ 
          left: Math.random() * 100 + '%', 
          animationDelay: Math.random() * 10 + 's',
          animationDuration: (5 + Math.random() * 8) + 's'
        }"></div>
      </div>

      <v-container fluid class="main-container">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-glow"></div>
          
          <!-- Trophy Icon -->
          <div class="trophy-container">
            <div class="trophy-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
            </div>
            <v-icon class="trophy-icon">mdi-trophy-variant</v-icon>
          </div>

          <!-- Title Section -->
          <div class="hero-title-section">
            <h1 class="hero-title">
              <span class="title-top">DESBLOQUEA TU</span>
              <span class="title-main">POTENCIAL</span>
            </h1>
            <p class="hero-subtitle">Elige el plan perfecto para alcanzar tus objetivos de fitness</p>
          </div>

          <!-- Divider -->
          <div class="hero-divider">
            <div class="divider-line"></div>
            <v-icon class="divider-icon">mdi-fire</v-icon>
            <div class="divider-line"></div>
          </div>

          <!-- Benefits Pills -->
          <div class="benefits-grid">
            <div class="benefit-card benefit-1">
              <div class="benefit-icon-wrapper">
                <v-icon size="32" color="#00ff88">mdi-lightning-bolt</v-icon>
              </div>
              <div class="benefit-content">
                <div class="benefit-title">Activación Inmediata</div>
                <div class="benefit-text">Acceso instantáneo al contenido</div>
              </div>
            </div>

            <div class="benefit-card benefit-2">
              <div class="benefit-icon-wrapper">
                <v-icon size="32" color="#00D2FF">mdi-account-group</v-icon>
              </div>
              <div class="benefit-content">
                <div class="benefit-title">Comunidad Élite</div>
                <div class="benefit-text">Entrena con los mejores</div>
              </div>
            </div>

            <div class="benefit-card benefit-3">
              <div class="benefit-icon-wrapper">
                <v-icon size="32" color="#A855F7">mdi-chart-line-variant</v-icon>
              </div>
              <div class="benefit-content">
                <div class="benefit-title">Progreso Detallado</div>
                <div class="benefit-text">Analytics y estadísticas avanzadas</div>
              </div>
            </div>
          </div>

          <!-- Stats Banner -->
          <div class="stats-banner">
            <div class="stat-item">
              <div class="stat-value">10K+</div>
              <div class="stat-label">Atletas Activos</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">98%</div>
              <div class="stat-label">Satisfacción</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">24/7</div>
              <div class="stat-label">Soporte Premium</div>
            </div>
          </div>
        </div>

        <!-- Plans Section -->
        <div class="plans-section">
          <div class="section-header">
            <h2 class="section-title">NUESTROS PLANES</h2>
            <p class="section-subtitle">Selecciona el que mejor se adapte a ti</p>
          </div>
          <PlanRender />
        </div>

        <!-- FAQ/Help Section -->
        <div class="help-section">
          <div class="help-card">
            <div class="help-icon">
              <v-icon size="48" color="#FFD700">mdi-chat-question</v-icon>
            </div>
            <h3 class="help-title">¿Necesitas ayuda para decidir?</h3>
            <p class="help-text">Nuestro equipo de expertos está listo para asesorarte y ayudarte a encontrar el plan perfecto según tus objetivos</p>
            <v-btn
              size="large"
              class="help-btn"
            >
              <v-icon class="mr-2">mdi-headset</v-icon>
              CONTACTAR ASESOR
            </v-btn>
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="trust-section">
          <div class="trust-badge badge-1">
            <div class="badge-icon">
              <v-icon size="36" color="#00ff88">mdi-shield-check</v-icon>
            </div>
            <div class="badge-text">
              <div class="badge-title">Pago 100% Seguro</div>
              <div class="badge-subtitle">Encriptación SSL</div>
            </div>
          </div>

          <div class="trust-badge badge-2">
            <div class="badge-icon">
              <v-icon size="36" color="#00D2FF">mdi-lock-check</v-icon>
            </div>
            <div class="badge-text">
              <div class="badge-title">Datos Protegidos</div>
              <div class="badge-subtitle">Privacidad garantizada</div>
            </div>
          </div>

          <div class="trust-badge badge-3">
            <div class="badge-icon">
              <v-icon size="36" color="#FFD700">mdi-flash</v-icon>
            </div>
            <div class="badge-text">
              <div class="badge-title">Acceso Instantáneo</div>
              <div class="badge-subtitle">Sin esperas</div>
            </div>
          </div>

          <div class="trust-badge badge-4">
            <div class="badge-icon">
              <v-icon size="36" color="#FF6B9D">mdi-calendar-remove</v-icon>
            </div>
            <div class="badge-text">
              <div class="badge-title">Cancela Cuando Quieras</div>
              <div class="badge-subtitle">Sin compromisos</div>
            </div>
          </div>
        </div>

        <!-- Money Back Guarantee -->
        <div class="guarantee-section">
          <div class="guarantee-badge">
            <v-icon size="64" color="#FFD700">mdi-shield-star</v-icon>
          </div>
          <h3 class="guarantee-title">Garantía de 30 Días</h3>
          <p class="guarantee-text">Si no estás completamente satisfecho, te devolvemos tu dinero. Sin preguntas.</p>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Main Container */
.main {
  position: relative;
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    linear-gradient(180deg, #0a0e1a 0%, #0f1419 50%, #0a0e1a 100%);
  overflow-x: hidden;
}

/* Particles */
.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  animation: particle-rise linear infinite;
}

@keyframes particle-rise {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

.main-container {
  position: relative;
  z-index: 1;
  padding: 3rem 2rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  text-align: center;
  padding: 3rem 0 4rem;
  margin-bottom: 4rem;
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 1000px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* Trophy Container */
.trophy-container {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.trophy-rings {
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
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  animation: ring-expand 4s ease-out infinite;
}

.ring-1 {
  width: 100px;
  height: 100px;
  animation-delay: 0s;
}

.ring-2 {
  width: 100px;
  height: 100px;
  animation-delay: 1.3s;
}

.ring-3 {
  width: 100px;
  height: 100px;
  animation-delay: 2.6s;
}

@keyframes ring-expand {
  0% {
    width: 100px;
    height: 100px;
    opacity: 1;
  }
  100% {
    width: 280px;
    height: 280px;
    opacity: 0;
  }
}

.trophy-icon {
  font-size: 5rem !important;
  color: #FFD700;
  filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8));
  animation: trophy-float 3s ease-in-out infinite;
}

@keyframes trophy-float {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
    filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8));
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
    filter: drop-shadow(0 0 60px rgba(255, 215, 0, 1));
  }
}

/* Hero Title */
.hero-title-section {
  margin-bottom: 2.5rem;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 0 1rem;
}

.title-top {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 8px;
  text-transform: uppercase;
}

.title-main {
  font-size: clamp(3rem, 8vw, 5.5rem);
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
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  letter-spacing: 1px;
  max-width: 700px;
  margin: 0 auto;
}

/* Hero Divider */
.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
}

.divider-icon {
  color: #FF6B35;
  font-size: 2rem !important;
  animation: fire-pulse 1.5s ease-in-out infinite;
}

@keyframes fire-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto 3rem;
}

.benefit-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(135deg, rgba(20, 30, 48, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid;
  border-radius: 20px;
  padding: 1.75rem;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: benefit-entrance 0.6s ease-out backwards;
}

.benefit-1 {
  border-color: rgba(0, 255, 136, 0.3);
  animation-delay: 0.1s;
}

.benefit-2 {
  border-color: rgba(0, 210, 255, 0.3);
  animation-delay: 0.2s;
}

.benefit-3 {
  border-color: rgba(168, 85, 247, 0.3);
  animation-delay: 0.3s;
}

@keyframes benefit-entrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.benefit-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.benefit-1:hover {
  border-color: rgba(0, 255, 136, 0.6);
  box-shadow: 0 15px 40px rgba(0, 255, 136, 0.3);
}

.benefit-2:hover {
  border-color: rgba(0, 210, 255, 0.6);
  box-shadow: 0 15px 40px rgba(0, 210, 255, 0.3);
}

.benefit-3:hover {
  border-color: rgba(168, 85, 247, 0.6);
  box-shadow: 0 15px 40px rgba(168, 85, 247, 0.3);
}

.benefit-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.benefit-content {
  flex: 1;
  text-align: left;
}

.benefit-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.25rem;
}

.benefit-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Stats Banner */
.stats-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  background: linear-gradient(135deg, rgba(20, 30, 48, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 100px;
  padding: 2rem 3rem;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.2);
  animation: fadeIn 0.8s ease-out 0.4s backwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.stat-divider {
  width: 2px;
  height: 50px;
  background: linear-gradient(180deg, transparent, rgba(255, 215, 0, 0.3), transparent);
}

/* Plans Section */
.plans-section {
  margin-bottom: 4rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: white;
  letter-spacing: 3px;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* Help Section */
.help-section {
  margin-bottom: 4rem;
  padding: 0 1rem;
}

.help-card {
  max-width: 700px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.1) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.help-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
}

.help-icon {
  margin-bottom: 1.5rem;
}

.help-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: white;
  margin: 0 0 1rem;
}

.help-text {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0 0 2rem;
}

.help-btn {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
  color: #000 !important;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 1.5rem 2.5rem !important;
  border-radius: 50px !important;
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.4);
  transition: all 0.3s ease;
}

.help-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 40px rgba(255, 215, 0, 0.6);
}

/* Trust Section */
.trust-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 0 1rem;
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(135deg, rgba(20, 30, 48, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: badge-entrance 0.6s ease-out backwards;
}

.badge-1 { animation-delay: 0.1s; }
.badge-2 { animation-delay: 0.2s; }
.badge-3 { animation-delay: 0.3s; }
.badge-4 { animation-delay: 0.4s; }

@keyframes badge-entrance {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.trust-badge:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.badge-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.badge-text {
  flex: 1;
}

.badge-title {
  font-size: 1rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.25rem;
}

.badge-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Guarantee Section */
.guarantee-section {
  text-align: center;
  background: linear-gradient(135deg, rgba(20, 30, 48, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 24px;
  padding: 3rem 2rem;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.2);
}

.guarantee-badge {
  margin-bottom: 1.5rem;
}

.guarantee-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: #FFD700;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.guarantee-text {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .benefits-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
}

@media (max-width: 960px) {
  .main-container {
    padding: 2rem 1.5rem;
  }

  .hero-section {
    padding: 2rem 0 3rem;
    margin-bottom: 3rem;
  }

  .trophy-icon {
    font-size: 4rem !important;
  }

  .title-top {
    font-size: 1.1rem;
    letter-spacing: 6px;
  }

  .title-main {
    font-size: 2.5rem;
    letter-spacing: 2px;
  }

  .stats-banner {
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    border-radius: 24px;
  }

  .stat-divider {
    width: 80%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
  }

  .trust-section {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .main-container {
    padding: 1.5rem 1rem;
  }

  .trophy-icon {
    font-size: 3.5rem !important;
  }

  .title-top {
    font-size: 1rem;
    letter-spacing: 4px;
  }

  .title-main {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .benefit-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .benefit-content {
    text-align: center;
  }

  .stats-banner {
    padding: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .help-card {
    padding: 2rem 1.5rem;
  }

  .help-title {
    font-size: 1.5rem;
  }

  .help-text {
    font-size: 0.95rem;
  }

  .help-btn {
    width: 100%;
    padding: 1.25rem 2rem !important;
  }

  .trust-section {
    grid-template-columns: 1fr;
  }

  .trust-badge {
    flex-direction: column;
    text-align: center;
  }

  .badge-text {
    text-align: center;
  }

  .guarantee-section {
    padding: 2rem 1.5rem;
  }

  .guarantee-title {
    font-size: 1.5rem;
  }

  .guarantee-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 400px) {
  .title-main {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.6rem;
  }
}
</style>