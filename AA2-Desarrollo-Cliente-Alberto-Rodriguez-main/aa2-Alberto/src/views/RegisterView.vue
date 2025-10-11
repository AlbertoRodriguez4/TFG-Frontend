<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/components/Models/User'

const store = useUserStore()
const errorMessage = ref('')
const isLoading = ref(false)

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')

const register = async () => {
  errorMessage.value = ''
  isLoading.value = true

  const emailTrimmed = email.value.trim()
  const passwordTrimmed = password.value.trim()
  const confirmPasswordTrimmed = confirmPassword.value.trim()
  const nameTrimmed = name.value.trim()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailTrimmed || !passwordTrimmed || !confirmPasswordTrimmed || !nameTrimmed) {
    errorMessage.value = 'Por favor, completa todos los campos.'
    isLoading.value = false
    return
  }

  if (!emailRegex.test(emailTrimmed)) {
    errorMessage.value = 'Introduce un correo electrónico válido.'
    isLoading.value = false
    return
  }

  if (nameTrimmed.length < 3) {
    errorMessage.value = 'El nombre debe tener al menos 3 caracteres.'
    isLoading.value = false
    return
  }

  if (passwordTrimmed.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
    isLoading.value = false
    return
  }

  if (passwordTrimmed !== confirmPasswordTrimmed) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    isLoading.value = false
    return
  }

  const user: User = {
    id: 0,
    name: nameTrimmed,
    passwordhash: passwordTrimmed,
    email: emailTrimmed,
    level: 0,
    strength: 0,
    endurance: 0,
    consistencystreak: 0,
    gold: 0,
    role: 'userNormal'
  }

  try {
    const result = await store.createUser(user)
    if (!result) {
      errorMessage.value = 'No se pudo crear el usuario. Puede que el correo ya esté registrado.'
      isLoading.value = false
      return
    }

    const loginResult = await store.loginUser(emailTrimmed, passwordTrimmed)
    if (loginResult && store.loggedUser?.email === emailTrimmed) {
      alert('¡Bienvenido al Training Hub! Tu aventura comienza ahora.')
      router.push({ name: 'homeLogged' })
    } else {
      errorMessage.value = 'El registro fue exitoso, pero hubo un error al iniciar sesión.'
      isLoading.value = false
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Error inesperado. Intenta más tarde.'
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-wrapper">
    <!-- Partículas animadas de fondo -->
    <div class="particles">
      <div class="particle" v-for="n in 20" :key="n" :style="{ 
        left: `${Math.random() * 100}%`, 
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }"></div>
    </div>

    <div class="register-container">
      <!-- Header con Logo -->
      <div class="header-banner">
        <div class="logo-container">
          <img src="@/assets/imgs/Logo.png" alt="The Training Hub" class="main-logo" />
        </div>
        <div class="hero-text">
          <h1 class="hero-title">{{ $t('slogan') }}</h1>
          <p class="hero-subtitle">Entrena. Compite. Conquista.</p>
        </div>
      </div>

      <!-- Contenedor Principal -->
      <div class="content-grid">
        <!-- Panel de Información -->
        <div class="info-panel">
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h3 class="feature-title">Sistema de Niveles</h3>
            <p class="feature-desc">Sube de nivel completando entrenamientos y desbloquea nuevas salas exclusivas</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3 class="feature-title">Entrena en Grupo</h3>
            <p class="feature-desc">Únete a salas con otros usuarios y motívense mutuamente</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3 class="feature-title">Retos y Recompensas</h3>
            <p class="feature-desc">Acepta desafíos, gana XP, monedas de oro y mejora tus atributos</p>
          </div>

          <div class="starting-rewards">
            <h4 class="rewards-title">🎁 Recompensas Iniciales</h4>
            <div class="rewards-grid">
              <div class="reward-item">
                <span class="reward-icon">⚡</span>
                <span class="reward-text">Nivel 1</span>
              </div>
              <div class="reward-item">
                <span class="reward-icon">🪙</span>
                <span class="reward-text">100 Oro</span>
              </div>
              <div class="reward-item">
                <span class="reward-icon">💎</span>
                <span class="reward-text">Pack Inicial</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de Registro -->
        <div class="form-panel">
          <div class="form-card">
            <!-- Decoración superior -->
            <div class="card-decoration">
              <div class="decoration-line"></div>
              <div class="decoration-icon">⚡</div>
              <div class="decoration-line"></div>
            </div>

            <div class="form-header">
              <div class="level-badge">
                <span class="badge-icon">🎮</span>
                <span class="badge-text">NUEVO JUGADOR</span>
              </div>
              <h2 class="form-title">{{ $t('register_title') }}</h2>
              <p class="form-subtitle">Crea tu cuenta y empieza a entrenar</p>
              
              <!-- Barra de progreso ficticia -->
              <div class="progress-container">
                <div class="progress-label">Preparando tu aventura...</div>
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
              </div>
            </div>

            <v-form @submit.prevent="register" class="register-form">
              <!-- Grid de inputs en 2 columnas -->
              <div class="inputs-grid">
                <!-- Nombre de Usuario -->
                <div class="input-container">
                  <div class="input-badge">
                    <span class="badge-emoji">👤</span>
                  </div>
                  <v-text-field
                    v-model="name"
                    :placeholder="$t('username_placeholder')"
                    variant="solo"
                    density="comfortable"
                    color="orange-darken-2"
                    class="custom-input"
                    hide-details="auto"
                    bg-color="rgba(255, 255, 255, 0.9)"
                  >
                    <template v-slot:label>
                      <span class="field-label">Usuario</span>
                    </template>
                  </v-text-field>
                </div>

                <!-- Email -->
                <div class="input-container">
                  <div class="input-badge">
                    <span class="badge-emoji">📧</span>
                  </div>
                  <v-text-field
                    v-model="email"
                    type="email"
                    :placeholder="$t('email_placeholder')"
                    variant="solo"
                    density="comfortable"
                    color="orange-darken-2"
                    class="custom-input"
                    hide-details="auto"
                    bg-color="rgba(255, 255, 255, 0.9)"
                  >
                    <template v-slot:label>
                      <span class="field-label">Email</span>
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
                    :placeholder="$t('password_placeholder')"
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

                <!-- Confirmar Contraseña -->
                <div class="input-container">
                  <div class="input-badge">
                    <span class="badge-emoji">✓</span>
                  </div>
                  <v-text-field
                    v-model="confirmPassword"
                    type="password"
                    :placeholder="$t('confirm_password_placeholder')"
                    variant="solo"
                    density="comfortable"
                    color="orange-darken-2"
                    class="custom-input"
                    hide-details="auto"
                    bg-color="rgba(255, 255, 255, 0.9)"
                  >
                    <template v-slot:label>
                      <span class="field-label">Confirmar</span>
                    </template>
                  </v-text-field>
                </div>
              </div>

              <!-- Stats Preview -->
              <div class="stats-section">
                <div class="stats-title">📊 Estadísticas Iniciales</div>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-icon">💪</div>
                    <div class="stat-info">
                      <div class="stat-value">0</div>
                      <div class="stat-name">Fuerza</div>
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-info">
                      <div class="stat-value">0</div>
                      <div class="stat-name">Resistencia</div>
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-info">
                      <div class="stat-value">0</div>
                      <div class="stat-name">Racha</div>
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon">🪙</div>
                    <div class="stat-info">
                      <div class="stat-value">100</div>
                      <div class="stat-name">Oro</div>
                    </div>
                  </div>
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
                  <div class="error-title">¡Error!</div>
                  <div class="error-message">{{ errorMessage }}</div>
                </div>
              </v-alert>

              <!-- Botón de Registro Épico -->
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
                    <span class="btn-icon-left">⚔️</span>
                    <div class="btn-text-container">
                      <span class="btn-text-main">{{ $t('register_button') }}</span>
                      <span class="btn-text-sub">Comenzar Aventura</span>
                    </div>
                    <span class="btn-icon-right">🎯</span>
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
                    <span class="loading-text">Creando tu perfil...</span>
                  </div>
                </template>
              </v-btn>

              <!-- Separador con estilo -->
              <div class="separator">
                <div class="separator-line"></div>
                <span class="separator-text">o</span>
                <div class="separator-line"></div>
              </div>
              
              <!-- Link a Login -->
              <div class="login-prompt">
                <p class="prompt-text">{{ $t('already_have_account') }}</p>
                <v-btn
                  variant="outlined"
                  color="deep-purple"
                  size="large"
                  class="login-btn"
                  to="/login"
                  block
                >
                  <span class="login-btn-icon">🎮</span>
                  {{ $t('login_button') }}
                  <template v-slot:append>
                    <span class="btn-arrow-login">→</span>
                  </template>
                </v-btn>
              </div>
            </v-form>
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

.register-wrapper {
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

.register-container {
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
  letter-spacing: 2px;
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
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
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

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 193, 7, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(255, 193, 7, 0.2);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
}

.feature-title {
  color: #ffc107;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.feature-desc {
  color: #ccc;
  font-size: 1rem;
  line-height: 1.5;
}

.starting-rewards {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
  border: 2px solid #ffc107;
  border-radius: 16px;
  padding: 1.5rem;
  animation: slideInLeft 0.8s ease-out 0.2s both;
}

.rewards-title {
  color: #ffc107;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.reward-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;
}

.reward-item:hover {
  transform: scale(1.1);
}

.reward-icon {
  font-size: 2rem;
}

.reward-text {
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
  margin-bottom: 1.5rem;
}

.progress-container {
  margin-top: 1rem;
}

.progress-label {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.5rem;
  text-align: left;
}

.progress-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #ffc107, #ff9800);
  border-radius: 10px;
  animation: progress-animate 2s ease-in-out infinite;
}

@keyframes progress-animate {
  0%, 100% {
    width: 30%;
  }
  50% {
    width: 60%;
  }
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Grid de inputs */
.inputs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
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

.badge-emoji {
  font-size: 1.2rem;
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

/* Sección de estadísticas */
.stats-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 0.5rem;
}

.stats-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 1rem 0.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px) scale(1.05);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 0.2rem;
}

.stat-name {
  font-size: 0.85rem;
  color: #666;
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

/* Sección de login */
.login-prompt {
  text-align: center;
  margin-top: 0.5rem;
}

.prompt-text {
  color: #666;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.login-btn {
  text-transform: none !important;
  font-family: 'Patrick Hand', cursive !important;
  font-size: 1.2rem !important;
  font-weight: bold !important;
  letter-spacing: 0 !important;
  border-radius: 16px !important;
  border-width: 2px !important;
  padding: 1.2rem 2rem !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
}

.login-btn-icon {
  font-size: 1.3rem;
  margin-right: 8px;
}

.btn-arrow-login {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.login-btn:hover .btn-arrow-login {
  transform: translateX(5px);
  color: linear-gradient(135deg, #ffc107 0%, #ff9800 100%) !important;
  color: #1a1a2e !important;
  font-weight: bold !important;
  font-size: 1.3rem !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4) !important;
  font-family: 'Patrick Hand', cursive !important;
  margin-top: 0.5rem;
  text-transform: none !important;
  letter-spacing: 0 !important;
  transition: all 0.3s ease !important;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 193, 7, 0.6) !important;
}

.submit-btn:active {
  transform: translateY(-1px);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
}

.btn-arrow {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-arrow {
  transform: translateX(5px);
}

/* Sección de login */
.login-prompt {
  text-align: center;
  margin-top: 0.5rem;
}

.prompt-text {
  color: #666;
  font-size: 1.05rem;
  margin-bottom: 0.8rem;
}

.login-btn {
  text-transform: none !important;
  font-family: 'Patrick Hand', cursive !important;
  font-size: 1.2rem !important;
  font-weight: bold !important;
  letter-spacing: 0 !important;
}

.btn-arrow-login {
  font-size: 1.3rem;
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.login-btn:hover .btn-arrow-login {
  transform: translateX(5px);
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
  .register-container {
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

  .rewards-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 1.2rem;
  }

  .feature-icon {
    font-size: 2rem;
  }

  .feature-title {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .register-container {
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

  .form-title {
    font-size: 1.6rem;
  }

  .form-subtitle {
    font-size: 1rem;
  }

  .submit-btn {
    font-size: 1.2rem;
    padding: 1rem;
  }

  .input-label {
    font-size: 0.95rem;
  }
}
</style>