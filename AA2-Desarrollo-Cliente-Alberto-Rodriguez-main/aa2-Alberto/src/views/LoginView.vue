<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const store = useUserStore()
const router = useRouter()

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  const emailTrimmed = email.value.trim()
  const passwordTrimmed = password.value.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailTrimmed || !passwordTrimmed) {
    errorMessage.value = 'Por favor, completa todos los campos.'
    isLoading.value = false
    return
  }

  if (!emailRegex.test(emailTrimmed)) {
    errorMessage.value = 'Introduce un correo electrónico válido.'
    isLoading.value = false
    return
  }

  try {
    const loginResult = await store.loginUser(emailTrimmed, passwordTrimmed)

    if (loginResult && store.loggedUser?.email === emailTrimmed) {
      router.push('/homeLogged')
      alert('¡Bienvenido de vuelta, entrenador!')
    } else {
      errorMessage.value = 'Usuario o contraseña incorrectos.'
      isLoading.value = false
    }
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = 'Error inesperado al iniciar sesión. Intenta más tarde.'
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-wrapper">
    <!-- Partículas animadas de fondo -->
    <div class="particles">
      <div class="particle" v-for="n in 20" :key="n" :style="{ 
        left: `${Math.random() * 100}%`, 
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }"></div>
    </div>

    <div class="login-container">
      <!-- Header con Logo -->
      <div class="header-banner">
        <div class="logo-container">
          <img src="@/assets/imgs/Logo.png" alt="The Training Hub" class="main-logo" />
        </div>
        <div class="hero-text">
          <h1 class="hero-title">{{ $t('slogan') }}</h1>
          <p class="hero-subtitle">Tu progreso te está esperando</p>
        </div>
      </div>

      <!-- Contenedor Principal -->
      <div class="content-grid">
        <!-- Panel de Características -->
        <div class="info-panel">
          <div class="welcome-card">
            <div class="welcome-icon">👋</div>
            <h3 class="welcome-title">¡Bienvenido de vuelta!</h3>
            <p class="welcome-desc">Continúa tu viaje hacia tus metas fitness</p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <div class="feature-bullet">🎮</div>
              <div class="feature-content">
                <h4 class="feature-title">Sistema Gamificado</h4>
                <p class="feature-text">Gana XP y sube de nivel con cada entrenamiento</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-bullet">👥</div>
              <div class="feature-content">
                <h4 class="feature-title">Entrena en Grupo</h4>
                <p class="feature-text">Únete a salas y motívense juntos</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-bullet">🏆</div>
              <div class="feature-content">
                <h4 class="feature-title">Retos Épicos</h4>
                <p class="feature-text">Desafíos diarios y recompensas exclusivas</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-bullet">📊</div>
              <div class="feature-content">
                <h4 class="feature-title">Progreso Visible</h4>
                <p class="feature-text">Estadísticas detalladas y logros desbloqueables</p>
              </div>
            </div>
          </div>

          <div class="stats-preview">
            <div class="preview-title">🔥 Sistema de Progresión</div>
            <div class="preview-badges">
              <div class="preview-badge">
                <span class="badge-emoji">⚡</span>
                <span class="badge-label">Niveles</span>
              </div>
              <div class="preview-badge">
                <span class="badge-emoji">🪙</span>
                <span class="badge-label">Monedas</span>
              </div>
              <div class="preview-badge">
                <span class="badge-emoji">💪</span>
                <span class="badge-label">Atributos</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de Login -->
        <div class="form-panel">
          <div class="form-card">
            <!-- Decoración superior -->
            <div class="card-decoration">
              <div class="decoration-line"></div>
              <div class="decoration-icon">🎯</div>
              <div class="decoration-line"></div>
            </div>

            <div class="form-header">
              <div class="level-badge">
                <span class="badge-icon">🔐</span>
                <span class="badge-text">ACCESO SEGURO</span>
              </div>
              <h2 class="form-title">{{ $t('title_login') }}</h2>
              <p class="form-subtitle">Accede a tu cuenta de entrenador</p>
            </div>

            <v-form @submit.prevent="handleLogin" class="login-form">
              <!-- Email -->
              <div class="input-container">
                <div class="input-badge">
                  <span class="badge-emoji">📧</span>
                </div>
                <v-text-field
                  v-model="email"
                  type="email"
                  :placeholder="$t('placeholder_email')"
                  variant="solo"
                  density="comfortable"
                  color="orange-darken-2"
                  class="custom-input"
                  hide-details="auto"
                  bg-color="rgba(255, 255, 255, 0.9)"
                >
                  <template v-slot:label>
                    <span class="field-label">Correo Electrónico</span>
                  </template>
                </v-text-field>
              </div>

              <!-- Contraseña -->
              <div class="input-container">
                <div class="input-badge">
                  <span class="badge-emoji">🔒</span>
                </div>
                <v-text-field
                  v-model="password"
                  type="password"
                  :placeholder="$t('placeholder_password')"
                  variant="solo"
                  density="comfortable"
                  color="orange-darken-2"
                  class="custom-input"
                  hide-details="auto"
                  bg-color="rgba(255, 255, 255, 0.9)"
                >
                  <template v-slot:label>
                    <span class="field-label">Contraseña</span>
                  </template>
                </v-text-field>
              </div>

              <!-- Quick Stats Info -->
              <div class="quick-info">
                <div class="info-item">
                  <span class="info-icon">⚡</span>
                  <span class="info-text">Acceso instantáneo a tus estadísticas</span>
                </div>
                <div class="info-item">
                  <span class="info-icon">🎯</span>
                  <span class="info-text">Retoma tus entrenamientos y retos</span>
                </div>
              </div>

              <!-- Mensaje de Error -->
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="error-alert"
                prominent
                border="start"
                border-color="error"
              >
                <template v-slot:prepend>
                  <span class="error-icon">⚠️</span>
                </template>
                <div class="error-content">
                  <div class="error-title">¡Error de Acceso!</div>
                  <div class="error-message">{{ errorMessage }}</div>
                </div>
              </v-alert>

              <!-- Botón de Login Épico -->
              <v-btn
                type="submit"
                size="x-large"
                class="submit-btn"
                :loading="isLoading"
                :disabled="isLoading"
                block
                elevation="8"
              >
                <template v-slot:default>
                  <div class="btn-content">
                    <span class="btn-icon-left">🚀</span>
                    <div class="btn-text-container">
                      <span class="btn-text-main">{{ $t('login_button') }}</span>
                      <span class="btn-text-sub">Entrar al Hub</span>
                    </div>
                    <span class="btn-icon-right">💪</span>
                  </div>
                </template>
                <template v-slot:loader>
                  <div class="btn-loading">
                    <v-progress-circular
                      indeterminate
                      size="28"
                      width="3"
                      color="white"
                    ></v-progress-circular>
                    <span class="loading-text">Verificando...</span>
                  </div>
                </template>
              </v-btn>

              <!-- Separador con estilo -->
              <div class="separator">
                <div class="separator-line"></div>
                <span class="separator-text">¿Primera vez?</span>
                <div class="separator-line"></div>
              </div>
              
              <!-- Link a Registro -->
              <div class="register-prompt">
                <p class="prompt-text">{{ $t('no_account') }}</p>
                <v-btn
                  variant="outlined"
                  color="deep-purple"
                  size="large"
                  class="register-btn"
                  to="/register"
                  block
                >
                  <span class="register-btn-icon">✨</span>
                  {{ $t('register_button') }}
                  <template v-slot:append>
                    <span class="btn-arrow-register">→</span>
                  </template>
                </v-btn>
              </div>
            </v-form>

            <!-- Hint decorativo -->
            <div class="bottom-hint">
              <span class="hint-icon">💡</span>
              <span class="hint-text">Únete y desbloquea recompensas exclusivas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  position: relative;
  overflow-x: hidden;
  font-family: 'Patrick Hand', cursive;
}

/* Partículas de fondo */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffc107;
  border-radius: 50%;
  opacity: 0;
  animation: float-particle linear infinite;
  box-shadow: 0 0 10px #ffc107;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px);
    opacity: 0;
  }
}

.login-container {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header Banner */
.header-banner {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container {
  margin-bottom: 1.5rem;
}

.main-logo {
  height: 100px;
  filter: drop-shadow(0 8px 24px rgba(255, 193, 7, 0.4));
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 8px 24px rgba(255, 193, 7, 0.4));
  }
  50% {
    filter: drop-shadow(0 12px 32px rgba(255, 193, 7, 0.6));
  }
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #ffc107, #ff9800, #ffc107);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
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
  font-size: 1.3rem;
  color: #aaa;
  letter-spacing: 1px;
}

/* Grid de Contenido */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  animation: fadeIn 1s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Panel de Información */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: slideInLeft 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.welcome-card {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 152, 0, 0.15));
  border: 2px solid #ffc107;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-20deg);
  }
}

.welcome-title {
  color: #ffc107;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.welcome-desc {
  color: #ccc;
  font-size: 1.1rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 16px;
  padding: 1.2rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(10px);
  border-color: rgba(255, 193, 7, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
}

.feature-bullet {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  color: #ffc107;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

.feature-text {
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.4;
}

.stats-preview {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.preview-title {
  color: #667eea;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.preview-badges {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.preview-badge {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;
}

.preview-badge:hover {
  transform: scale(1.1);
}

.badge-emoji {
  font-size: 2rem;
}

.badge-label {
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Panel de Formulario */
.form-panel {
  animation: slideInRight 0.6s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 255, 0.95));
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.form-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #ffc107, #ff9800, #ffc107);
  background-size: 200% auto;
  animation: gradient-shift 3s linear infinite;
}

/* Decoración superior */
.card-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.decoration-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffc107, transparent);
}

.decoration-icon {
  font-size: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px rgba(255, 193, 7, 0.5));
  }
  50% {
    transform: scale(1.2);
    filter: drop-shadow(0 0 16px rgba(255, 193, 7, 0.8));
  }
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  animation: slideInDown 0.6s ease-out;
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  letter-spacing: 1px;
}

.form-title {
  font-size: 2.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.form-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-container {
  position: relative;
}

.input-badge {
  position: absolute;
  top: -12px;
  left: 12px;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
  z-index: 2;
  border: 3px solid white;
}

.field-label {
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Patrick Hand', cursive;
}

/* Estilos personalizados para Vuetify text fields */
:deep(.v-field) {
  border-radius: 16px !important;
  font-family: 'Patrick Hand', cursive;
  font-size: 1.05rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease !important;
}

:deep(.v-field:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
}

:deep(.v-field--focused) {
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.3) !important;
  transform: translateY(-2px);
}

:deep(.v-field__input) {
  padding-left: 12px;
}

/* Quick Info */
.quick-info {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.info-icon {
  font-size: 1.3rem;
}

.info-text {
  color: #667eea;
  font-size: 0.95rem;
  font-weight: 600;
}

/* Estilos para el Alert de error */
.error-alert {
  animation: shake 0.5s ease;
  border-radius: 16px !important;
  font-family: 'Patrick Hand', cursive;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2) !important;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-8px); }
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.error-title {
  font-weight: bold;
  font-size: 1.1rem;
}

.error-message {
  font-size: 0.95rem;
}

.error-icon {
  font-size: 1.8rem;
  margin-right: 8px;
}

/* Botón de submit épico */
.submit-btn {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%) !important;
  color: #1a1a2e !important;
  font-weight: bold !important;
  font-size: 1.2rem !important;
  border-radius: 16px !important;
  padding: 1.5rem 2rem !important;
  box-shadow: 
    0 8px 24px rgba(255, 193, 7, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
  font-family: 'Patrick Hand', cursive !important;
  margin-top: 0.5rem;
  text-transform: none !important;
  letter-spacing: 0 !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 32px rgba(255, 193, 7, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}

.submit-btn:active {
  transform: translateY(-2px);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.btn-icon-left,
.btn-icon-right {
  font-size: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.btn-text-container {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.btn-text-main {
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 1;
}

.btn-text-sub {
  font-size: 0.85rem;
  opacity: 0.8;
  line-height: 1;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.loading-text {
  font-size: 1.1rem;
}

/* Separador */
.separator {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.separator-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
}

.separator-text {
  color: #999;
  font-size: 1.1rem;
  font-weight: bold;
  background: white;
  padding: 0 1rem;
}

/* Sección de registro */
.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
}

.register-btn-icon {
  font-size: 1.3rem;
  margin-right: 8px;
}

.btn-arrow-register {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.register-btn:hover .btn-arrow-register {
  transform: translateX(5px);
}

/* Hint inferior */
.bottom-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
  border-radius: 12px;
  border: 2px solid rgba(255, 193, 7, 0.3);
}

.hint-icon {
  font-size: 1.5rem;
}

.hint-text {
  color: #ff9800;
  font-size: 0.95rem;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .info-panel {
    order: 2;
  }

  .form-panel {
    order: 1;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 1.5rem;
  }

  .header-banner {
    margin-bottom: 2rem;
  }

  .main-logo {
    height: 70px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .form-card {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .welcome-card {
    padding: 1.5rem;
  }

  .welcome-icon {
    font-size: 3rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-desc {
    font-size: 1rem;
  }

  .feature-item {
    padding: 1rem;
  }

  .feature-bullet {
    font-size: 1.5rem;
  }

  .feature-title {
    font-size: 1.1rem;
  }

  .feature-text {
    font-size: 0.9rem;
  }

  .preview-badges {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
  }

  .preview-badge {
    padding: 0.8rem;
  }

  .badge-emoji {
    font-size: 1.5rem;
  }

  .badge-label {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .main-logo {
    height: 60px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .form-card {
    padding: 1.5rem 1rem;
  }

  .card-decoration {
    margin-bottom: 1rem;
  }

  .decoration-icon {
    font-size: 1.5rem;
  }

  .level-badge {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }

  .form-title {
    font-size: 1.6rem;
  }

  .form-subtitle {
    font-size: 1rem;
  }

  .input-badge {
    width: 32px;
    height: 32px;
    top: -10px;
  }

  .badge-emoji {
    font-size: 1rem;
  }

  .quick-info {
    padding: 0.8rem;
  }

  .info-item {
    gap: 0.5rem;
  }

  .info-icon {
    font-size: 1.1rem;
  }

  .info-text {
    font-size: 0.85rem;
  }

  .submit-btn {
    padding: 1rem 1.5rem !important;
  }

  .btn-text-main {
    font-size: 1.1rem;
  }

  .btn-text-sub {
    font-size: 0.75rem;
  }

  .btn-icon-left,
  .btn-icon-right {
    font-size: 1.2rem;
  }

  .register-btn {
    padding: 1rem 1.5rem !important;
    font-size: 1.1rem !important;
  }

  .register-btn-icon {
    font-size: 1.1rem;
  }

  .bottom-hint {
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.8rem;
  }

  .hint-text {
    font-size: 0.85rem;
    text-align: center;
  }

  .welcome-card {
    padding: 1.2rem;
  }

  .welcome-icon {
    font-size: 2.5rem;
  }

  .welcome-title {
    font-size: 1.3rem;
  }

  .welcome-desc {
    font-size: 0.9rem;
  }

  .feature-item {
    padding: 0.8rem;
    gap: 0.8rem;
  }

  .feature-bullet {
    font-size: 1.3rem;
  }

  .feature-title {
    font-size: 1rem;
  }

  .feature-text {
    font-size: 0.85rem;
  }

  .stats-preview {
    padding: 1rem;
  }

  .preview-title {
    font-size: 1.1rem;
  }

  .preview-badges {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .preview-badge {
    padding: 0.6rem;
  }

  .badge-emoji {
    font-size: 1.3rem;
  }

  .badge-label {
    font-size: 0.75rem;
  }
}
</style>