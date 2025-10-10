<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const store = useUserStore()
const isLogged = computed(() => !!store.loggedUser?.email)
const homeLink = computed(() =>
  isLogged.value ? { name: 'homeLogged' } : { name: 'home' }
)

const { locale } = useI18n()
const changeLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  locale.value = target.value
}
</script>

<template>
  <div class="header-container">
    <!-- Fondo degradado animado -->
    <div class="gradient-bg"></div>
    
    <header class="navbar">
      <nav class="nav-links">
        <RouterLink :to="homeLink" class="nav-item">
          <span class="nav-text">Home</span>
          <span class="nav-glow"></span>
        </RouterLink>
        <RouterLink to="/room" class="nav-item" :class="{ disabled: !isLogged }">
          <span class="nav-text">{{ $t('rooms') }}</span>
          <span class="nav-glow"></span>
        </RouterLink>
        <RouterLink to="/plan" class="nav-item" :class="{ disabled: !isLogged }">
          <span class="nav-text">{{ $t('plans') }}</span>
          <span class="nav-glow"></span>
        </RouterLink>
        <RouterLink to="/purchase" class="nav-item" :class="{ disabled: !isLogged }">
          <span class="nav-text">{{ $t('shop') }}</span>
          <span class="nav-glow"></span>
        </RouterLink>
        <RouterLink to="/user" class="nav-item" :class="{ disabled: !isLogged }">
          <span class="nav-text">{{ $t('users') }}</span>
          <span class="nav-glow"></span>
        </RouterLink>
      </nav>

      <div class="header-actions">
        <select class="language-select" @change="changeLanguage" :value="locale">
          <option value="en">🇬🇧 EN</option>
          <option value="es">🇪🇸 ES</option>
          <option value="fr">🇫🇷 FR</option>
        </select>

        <button class="logout-button" @click="store.logoutUser" v-if="isLogged">
          <span class="logout-icon">🚪</span>
          <span>{{ $t('logout') }}</span>
        </button>
      </div>
    </header>

    <div class="floating-logo">
      <div class="logo-ring"></div>
      <div class="logo-wrapper">
        <img src="../assets/imgs/Logo.png" alt="The Training Hub" class="logo-img" />
      </div>
      <div class="logo-pulse"></div>
    </div>

    <!-- Indicador de estado -->
    <div class="status-indicator" v-if="isLogged">
      <div class="status-dot"></div>
      <span class="status-text">Online</span>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  position: relative;
  width: 100%;
  height: 13%;
  min-height: 80px;
  overflow: visible;
}

/* Fondo degradado animado */
.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%, 
    #f093fb 50%, 
    #4facfe 75%, 
    #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  opacity: 0.9;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Navbar con glassmorphism */
.navbar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 2rem;
  padding: 0 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-item {
  position: relative;
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.nav-text {
  position: relative;
  z-index: 2;
}

.nav-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.nav-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.nav-item:hover .nav-glow {
  opacity: 1;
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.nav-item.disabled {
  pointer-events: none;
  opacity: 0.4;
  filter: grayscale(1);
}

/* Acciones del header */
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-left: auto;
}

.language-select {
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.language-select:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.language-select option {
  background: #764ba2;
  color: white;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
  background: linear-gradient(135deg, #ee5a6f, #ff6b6b);
}

.logout-icon {
  font-size: 1.2rem;
}

/* Logo flotante mejorado */
.floating-logo {
  position: absolute;
  top: 145px;
  left: 10%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 20;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(-50%); }
  50% { transform: translateX(-50%) translateY(-60px); }
}

.logo-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 8px;
  box-shadow: 
    0 10px 40px rgba(102, 126, 234, 0.5),
    0 0 60px rgba(118, 75, 162, 0.3);
  animation: logoGlow 2s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% { box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5), 0 0 60px rgba(118, 75, 162, 0.3); }
  50% { box-shadow: 0 15px 60px rgba(102, 126, 234, 0.8), 0 0 80px rgba(118, 75, 162, 0.6); }
}

.logo-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
}

.logo-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 230px;
  height: 230px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent);
  animation: pulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.4; }
}

/* Indicador de estado */
.status-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 15;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 10px #4ade80;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-links {
    gap: 1rem;
  }
  
  .nav-item {
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
  }
  
  .floating-logo {
    left: 8%;
    top: 130px;
  }
  
  .logo-wrapper {
    width: 150px;
    height: 150px;
  }
  
  .logo-ring {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .header-actions {
    margin-left: 0;
  }
  
  .floating-logo {
    display: none;
  }
  
  .status-indicator {
    top: 10px;
    right: 10px;
  }
}
</style>