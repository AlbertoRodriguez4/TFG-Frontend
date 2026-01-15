<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { computed, ref } from 'vue'
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

const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <div class="header-wrapper">
    <div class="header-container">
      <header class="navbar">
        <div class="logo-section">
          <RouterLink :to="homeLink" class="logo-link">
            <div class="logo-badge">
              <img src="../assets/imgs/Logo.png" alt="TTH" class="logo-icon" />
            </div>
            <div class="brand-text">
              <span class="brand-name">TheTrainingHub</span>
              <span class="brand-tagline">Level Up Your Gains</span>
            </div>
          </RouterLink>
        </div>

        <nav class="nav-desktop">
          <RouterLink :to="homeLink" class="nav-link">
            <i class="nav-icon">🏠</i>
            <span class="nav-text">Home</span>
          </RouterLink>
          <RouterLink to="/room" class="nav-link" :class="{ disabled: !isLogged }">
            <i class="nav-icon">🚪</i>
            <span class="nav-text">{{ $t('rooms') }}</span>
          </RouterLink>
          <RouterLink to="/plan" class="nav-link" :class="{ disabled: !isLogged }">
            <i class="nav-icon">📋</i>
            <span class="nav-text">{{ $t('plans') }}</span>
          </RouterLink>
          <RouterLink to="/purchase" class="nav-link" :class="{ disabled: !isLogged }">
            <i class="nav-icon">🛒</i>
            <span class="nav-text">{{ $t('shop') }}</span>
          </RouterLink>
          <RouterLink to="/user" class="nav-link" :class="{ disabled: !isLogged }">
            <i class="nav-icon">👥</i>
            <span class="nav-text">{{ $t('users') }}</span>
          </RouterLink>
          <RouterLink to="/rutina" class="nav-link" :class="{ disabled: !isLogged }">
            <v-icon class="nav-icon">mdi-calendar</v-icon>
            <span class="nav-text">{{ $t('routines') }}</span>
          </RouterLink>
        </nav>

        <div class="header-actions">
          <div class="user-info" v-if="isLogged && store.loggedUser">
            <div class="user-stats">
              <div class="stat-item" title="Strength">
                <span class="stat-icon">⚡</span>
                <span class="stat-value">{{ store.loggedUser.strength || 0 }}</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item" title="Gold">
                <span class="stat-icon">🪙</span>
                <span class="stat-value">{{ store.loggedUser.gold || 0 }}</span>
              </div>
            </div>
            <div class="user-level">
              <span class="level-badge">LVL {{ store.loggedUser.level || 1 }}</span>
            </div>
          </div>

          <div class="language-selector">
            <select class="language-select" @change="changeLanguage" :value="locale">
              <option value="en">🇬🇧</option>
              <option value="es">🇪🇸</option>
              <option value="fr">🇫🇷</option>
            </select>
          </div>

          <button class="logout-btn" @click="store.logoutUser" v-if="isLogged">
            <span class="logout-icon">⚡</span>
            <span class="logout-text">{{ $t('logout') }}</span>
          </button>

          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <span class="hamburger-line" :class="{ active: mobileMenuOpen }"></span>
            <span class="hamburger-line" :class="{ active: mobileMenuOpen }"></span>
            <span class="hamburger-line" :class="{ active: mobileMenuOpen }"></span>
          </button>
        </div>
      </header>

      <Transition name="slide">
        <nav class="nav-mobile" v-if="mobileMenuOpen">
          <div class="mobile-user-summary" v-if="isLogged && store.loggedUser">
             <span class="mobile-level">LVL {{ store.loggedUser.level || 1 }}</span>
             <div class="mobile-stats">
                <span>⚡ {{ store.loggedUser.strength || 0 }}</span>
                <span>🪙 {{ store.loggedUser.gold || 0 }}</span>
             </div>
          </div>

          <RouterLink :to="homeLink" class="nav-link-mobile" @click="toggleMobileMenu">
            <i class="nav-icon">🏠</i>
            <span>Home</span>
          </RouterLink>
          <RouterLink to="/room" class="nav-link-mobile" :class="{ disabled: !isLogged }" @click="toggleMobileMenu">
            <i class="nav-icon">🚪</i>
            <span>{{ $t('rooms') }}</span>
          </RouterLink>
          <RouterLink to="/plan" class="nav-link-mobile" :class="{ disabled: !isLogged }" @click="toggleMobileMenu">
            <i class="nav-icon">📋</i>
            <span>{{ $t('plans') }}</span>
          </RouterLink>
          <RouterLink to="/purchase" class="nav-link-mobile" :class="{ disabled: !isLogged }" @click="toggleMobileMenu">
            <i class="nav-icon">🛒</i>
            <span>{{ $t('shop') }}</span>
          </RouterLink>
          <RouterLink to="/user" class="nav-link-mobile" :class="{ disabled: !isLogged }" @click="toggleMobileMenu">
            <i class="nav-icon">👥</i>
            <span>{{ $t('users') }}</span>
          </RouterLink>
           <RouterLink to="/rutina" class="nav-link-mobile" :class="{ disabled: !isLogged }" @click="toggleMobileMenu">
            <i class="nav-icon">📅</i>
            <span>{{ $t('routines') }}</span>
          </RouterLink>
        </nav>
      </Transition>

      <div class="status-bar" v-if="isLogged">
        <div class="status-pulse"></div>
        <span class="status-text">ONLINE</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reset básico para evitar desbordes */
* {
  box-sizing: border-box;
}

.header-container {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: linear-gradient(180deg, 
    rgba(0, 0, 0, 0.95) 0%, 
    rgba(10, 10, 10, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 204, 0, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
}

/* Navbar Principal */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Distribuye espacio */
  padding: 0.8rem 1.5rem; /* Reducido un poco para laptops */
  max-width: 1920px; /* Permitir más ancho en pantallas grandes */
  margin: 0 auto;
  gap: 1rem; /* Gap reducido para evitar cortes */
  height: 80px;
}

/* Logo Section */
.logo-section {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-badge {
  width: 45px; /* Ligeramente más pequeño */
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
  padding: 3px;
  box-shadow: 0 4px 20px rgba(255, 204, 0, 0.4);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-badge::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.logo-icon {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.brand-name {
  font-size: 1.3rem;
  font-weight: 900;
  color: #ffcc00;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(255, 204, 0, 0.5);
  white-space: nowrap; /* Evita que el texto salte de línea */
}

.brand-tagline {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
}

/* Desktop Navigation */
.nav-desktop {
  display: flex;
  gap: 0.3rem; /* Menos espacio entre items */
  align-items: center;
  flex-grow: 1;
  justify-content: center;
  flex-wrap: nowrap; /* Fuerza una línea */
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.8rem; /* Padding más ajustado */
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #ffcc00;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-link:hover {
  color: #ffcc00;
  background: rgba(255, 204, 0, 0.1);
}

.nav-link:hover::before {
  transform: scaleX(1);
}

.nav-link.router-link-active {
  color: #ffcc00;
  background: rgba(255, 204, 0, 0.15);
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.2);
}

.nav-link.router-link-active::before {
  transform: scaleX(1);
}

.nav-link.disabled {
  pointer-events: none;
  opacity: 0.3;
}

.nav-icon {
  font-size: 1.1rem;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-shrink: 0; /* Evita que esta sección se aplaste */
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 204, 0, 0.1);
  border: 1px solid rgba(255, 204, 0, 0.3);
  border-radius: 12px;
  padding: 0.4rem 0.8rem;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stat-value {
  font-weight: 800;
  color: #ffcc00;
  font-size: 0.9rem;
}

.stat-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 204, 0, 0.3);
}

.user-level {
  background: linear-gradient(135deg, #ffcc00, #ff9900);
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(255, 204, 0, 0.3);
}

.level-badge {
  font-weight: 900;
  color: #000;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* Language Selector */
.language-selector {
  position: relative;
}

.language-select {
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid rgba(255, 204, 0, 0.3);
  color: #fff;
  padding: 0.5rem;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
}

/* Logout Button */
.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ff4444, #cc0000);
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
  white-space: nowrap;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 68, 68, 0.5);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none; /* Oculto por defecto en pantallas grandes */
  flex-direction: column;
  gap: 0.3rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background: #ffcc00;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translateY(10px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translateY(-10px);
}

/* Mobile Navigation */
.nav-mobile {
  display: flex; /* Flex para poder ocultarlo con v-if */
  flex-direction: column;
  background: rgba(0, 0, 0, 0.98);
  border-top: 1px solid rgba(255, 204, 0, 0.3);
  padding: 1rem 0;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  position: absolute;
  width: 100%;
  left: 0;
}

.mobile-user-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(255, 204, 0, 0.1);
  border-bottom: 1px solid rgba(255, 204, 0, 0.2);
  margin-bottom: 1rem;
}

.mobile-level {
  font-weight: 900;
  color: #ffcc00;
}

.mobile-stats {
  display: flex;
  gap: 1rem;
  color: white;
  font-weight: bold;
}

.nav-link-mobile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link-mobile:hover, .nav-link-mobile.router-link-active {
  color: #ffcc00;
  background: rgba(255, 204, 0, 0.1);
  border-left-color: #ffcc00;
}

/* Status Bar */
.status-bar {
  position: fixed; /* Fixed para no afectar el flujo del header */
  top: 90px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.4);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  z-index: 900;
}

.status-pulse {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
  50% { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
}

.status-text {
  font-size: 0.7rem;
  font-weight: 800;
  color: #4ade80;
  letter-spacing: 1px;
}

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }

/* --- RESPONSIVE LOGIC --- */

/* Laptops pequeños y Tablets Horizontales (Menos de 1280px) */
@media (max-width: 1280px) {
  /* Ocultar elementos decorativos para ahorrar espacio */
  .brand-tagline {
    display: none;
  }
  
  .logout-text {
    display: none; /* Dejar solo el icono de rayo */
  }

  /* Reducir paddings drásticamente */
  .nav-link {
    padding: 0.5rem 0.5rem; 
    font-size: 0.85rem;
  }
  
  .navbar {
    padding: 0.8rem 1rem;
    gap: 0.5rem;
  }
}

/* Tablets Verticales y Laptops con mucho zoom (Menos de 1024px) */
/* AQUÍ ACTIVAMOS EL MODO MÓVIL ANTES QUE EN TU VERSIÓN ORIGINAL */
@media (max-width: 1024px) {
  .nav-desktop {
    display: none; /* Ocultar menú escritorio */
  }
  
  .user-info {
    display: none; /* Las stats pasan al menú móvil */
  }

  .mobile-menu-btn {
    display: flex; /* Mostrar hamburguesa */
  }

  .status-bar {
    display: none;
  }
  
  /* Asegurar que el logo no sea enorme */
  .brand-name {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .brand-text {
    display: none; /* En móviles muy pequeños, solo logo icono */
  }
  
  .language-selector {
    display: none;
  }
}
</style>