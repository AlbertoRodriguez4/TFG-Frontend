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
//En éste codigo, si no estas logueado te lleva al home, si estas logueado te lleva al homeLogged, se comprueba mediante los datos del usuario del looggedUser, si no existen datos, no aparece
</script>

<template>
  <div class="header-container">
    <header class="navbar">
      <nav class="nav-links">
        <RouterLink :to="homeLink" class="nav-item">Home</RouterLink>
        <RouterLink to="/room" class="nav-item" :class="{ disabled: !isLogged }">{{ $t('rooms') }}</RouterLink>
        <RouterLink to="/plan" class="nav-item" :class="{ disabled: !isLogged }">{{ $t('plans') }}</RouterLink>
        <RouterLink to="/purchase" class="nav-item" :class="{ disabled: !isLogged }">{{ $t('shop') }}</RouterLink>
        <RouterLink to="/user" class="nav-item" :class="{ disabled: !isLogged }">{{ $t('users') }}</RouterLink>
      </nav>

      <select class="language-select" @change="changeLanguage" :value="locale">
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="fr">FR</option>
      </select>

      <button class="logout-button" @click="store.logoutUser" v-if="isLogged">{{ $t('logout') }}</button> <!-- Boton de cerrar sesion, si exsiste informacion del usuario, si no, no aparece -->
    </header>

    <div class="floating-logo">
      <img src="../assets/imgs/Logo.png" alt="The Training Hub" class="logo-img" />
    </div>
  </div>
</template>

<style scoped>
.header-container {
  position: relative;
  width: 100%;
  height: 13%;
}
.nav-item.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: white;
  height: 100%;
  gap: 1.5rem;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
}
.nav-item {
  color: #0D6EFD;
  text-decoration: none;
  font-size: 1.75rem;
  font-weight: bold;
  transition: color 0.3s;
}
.nav-item:hover {
  color: #ffcc00;
}
.floating-logo {
  position: absolute;
  top: 145px;
  left: 10%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 50%;
}
.logo-img {
  width: 200px;
  height: 200px;
}
.logout-button {
  background-color: transparent;
  border: none;
  color: #0D6EFD;
  font-size: 1.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
}
.logout-button:hover {
  color: #ff0000;
}
.language-select {
  font-size: 1.2rem;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  margin-left: 1rem;
}
</style>
