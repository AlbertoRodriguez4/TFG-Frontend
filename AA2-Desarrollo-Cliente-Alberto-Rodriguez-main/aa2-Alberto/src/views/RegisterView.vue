<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/components/Models/User'

const store = useUserStore()
const errorMessage = ref('')

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')

const register = async () => {
  errorMessage.value = ''

  const emailTrimmed = email.value.trim()
  const passwordTrimmed = password.value.trim()
  const confirmPasswordTrimmed = confirmPassword.value.trim()
  const nameTrimmed = name.value.trim()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailTrimmed || !passwordTrimmed || !confirmPasswordTrimmed || !nameTrimmed) {
    errorMessage.value = 'Por favor, completa todos los campos.'
    return
  }

  if (!emailRegex.test(emailTrimmed)) {
    errorMessage.value = 'Introduce un correo electrónico válido.'
    return
  }

  if (nameTrimmed.length < 3) {
    errorMessage.value = 'El nombre debe tener al menos 3 caracteres.'
    return
  }

  if (passwordTrimmed.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  if (passwordTrimmed !== confirmPasswordTrimmed) {
    errorMessage.value = 'Las contraseñas no coinciden.'
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
      return
    }

    const loginResult = await store.loginUser(emailTrimmed, passwordTrimmed)
    if (loginResult && store.loggedUser?.email === emailTrimmed) {
      alert('Registro exitoso')
      router.push({ name: 'homeLogged' })
    } else {
      errorMessage.value = 'El registro fue exitoso, pero hubo un error al iniciar sesión.'
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Error inesperado. Intenta más tarde.'
  }
}
</script>

<template>
  <div class="register-container">
    <!-- Panel Izquierdo -->
    <div class="left-panel">
      <div class="logo-section">
        <img src="@/assets/imgs/Logo.png" alt="The Training Hub logo" class="logo" />
        <div class="divider"></div>
        <p class="slogan">{{ $t('slogan') }}</p>
      </div>
      
      <!-- Elementos decorativos gamificados -->
      <div class="stats-preview">
        <div class="stat-badge">
          <span class="stat-icon">⚡</span>
          <span class="stat-label">Nivel 1</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">🏆</span>
          <span class="stat-label">0 XP</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">🪙</span>
          <span class="stat-label">100 Oro</span>
        </div>
      </div>
    </div>

    <!-- Panel Derecho -->
    <div class="right-panel">
      <div class="form-container">
        <div class="header-section">
          <h2 class="title">{{ $t('register_title') }}</h2>
          <p class="subtitle">Únete a la comunidad y comienza tu viaje</p>
        </div>

        <form class="register-form" @submit.prevent="register">
          <div class="input-group">
            <label class="input-label">
              <span class="label-icon">👤</span>
              Nombre de usuario
            </label>
            <v-text-field
              v-model="name"
              type="text"
              :placeholder="$t('username_placeholder')"
              class="input"
              variant="outlined"
              hide-details
              density="comfortable"
            />
          </div>

          <div class="input-group">
            <label class="input-label">
              <span class="label-icon">📧</span>
              Correo electrónico
            </label>
            <v-text-field
              v-model="email"
              type="email"
              :placeholder="$t('email_placeholder')"
              class="input"
              variant="outlined"
              hide-details
              density="comfortable"
            />
          </div>

          <div class="input-group">
            <label class="input-label">
              <span class="label-icon">🔒</span>
              Contraseña
            </label>
            <v-text-field
              v-model="password"
              type="password"
              :placeholder="$t('password_placeholder')"
              class="input"
              variant="outlined"
              hide-details
              density="comfortable"
            />
          </div>

          <div class="input-group">
            <label class="input-label">
              <span class="label-icon">✓</span>
              Confirmar contraseña
            </label>
            <v-text-field
              v-model="confirmPassword"
              type="password"
              :placeholder="$t('confirm_password_placeholder')"
              class="input"
              variant="outlined"
              hide-details
              density="comfortable"
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <button type="submit" class="register-btn">
            <span class="btn-text">{{ $t('register_button') }}</span>
            <span class="btn-icon">→</span>
          </button>

          <div class="login-section">
            <p class="login-text">{{ $t('already_have_account') }}</p>
            <RouterLink to="/login" class="login-link">
              {{ $t('login_button') }}
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.register-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Patrick Hand', cursive;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Panel Izquierdo */
.left-panel {
  width: 45%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

.left-panel::before {
  content: "";
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.1) 0%, transparent 70%);
  top: -100px;
  left: -100px;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.logo-section {
  text-align: center;
  z-index: 1;
}

.logo {
  width: 80%;
  max-width: 300px;
  height: auto;
  margin-bottom: 2rem;
  filter: drop-shadow(0 10px 30px rgba(255, 193, 7, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.divider {
  width: 60%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #ffc107, transparent);
  margin: 0 auto 2rem;
  border-radius: 2px;
}

.slogan {
  font-size: 2rem;
  color: #ffc107;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
}

.stats-preview {
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  z-index: 1;
}

.stat-badge {
  background: rgba(255, 193, 7, 0.1);
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.stat-badge:hover {
  transform: translateY(-5px);
  background: rgba(255, 193, 7, 0.2);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-label {
  color: #ffc107;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Panel Derecho */
.right-panel {
  width: 55%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow-y: auto;
}

.right-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url('../assets/imgs/gimansio-fondo.jpg') center center / cover no-repeat;
  filter: blur(8px) brightness(0.4);
  z-index: 0;
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1a1a2e;
  font-size: 1.1rem;
  font-weight: bold;
}

.label-icon {
  font-size: 1.2rem;
}

.input {
  width: 100%;
}

.error-message {
  background: #ffe6e6;
  border-left: 4px solid #ff4444;
  color: #cc0000;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.error-icon {
  font-size: 1.3rem;
}

.register-btn {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
  font-family: 'Patrick Hand', cursive;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.6);
}

.register-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.register-btn:hover .btn-icon {
  transform: translateX(5px);
}

.login-section {
  text-align: center;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;
}

.login-text {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.login-link {
  color: #667eea;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .left-panel {
    width: 40%;
    padding: 2rem;
  }

  .right-panel {
    width: 60%;
  }

  .slogan {
    font-size: 1.6rem;
  }

  .stats-preview {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    min-height: 40vh;
    padding: 2rem 1rem;
  }

  .left-panel::before {
    width: 300px;
    height: 300px;
  }

  .logo {
    max-width: 200px;
    margin-bottom: 1rem;
  }

  .slogan {
    font-size: 1.4rem;
  }

  .stats-preview {
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .stat-badge {
    padding: 0.6rem 0.8rem;
  }

  .stat-icon {
    font-size: 1.2rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .right-panel {
    width: 100%;
    min-height: 60vh;
    padding: 1.5rem 1rem;
  }

  .form-container {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .register-form {
    gap: 1.2rem;
  }

  .input-label {
    font-size: 1rem;
  }

  .register-btn {
    font-size: 1.2rem;
    padding: 0.9rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .left-panel {
    padding: 1.5rem 1rem;
  }

  .logo {
    max-width: 150px;
  }

  .slogan {
    font-size: 1.2rem;
  }

  .divider {
    width: 80%;
    margin-bottom: 1.5rem;
  }

  .stats-preview {
    gap: 0.4rem;
  }

  .stat-badge {
    padding: 0.5rem 0.6rem;
  }

  .form-container {
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .input-label {
    font-size: 0.95rem;
  }

  .register-btn {
    font-size: 1.1rem;
  }

  .login-text {
    font-size: 1rem;
  }

  .login-link {
    font-size: 1.1rem;
  }
}
</style>