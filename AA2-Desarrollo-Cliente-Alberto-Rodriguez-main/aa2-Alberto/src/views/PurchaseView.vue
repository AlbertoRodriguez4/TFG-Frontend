<script setup lang="ts">
import HeaderView from './HeaderView.vue';
import FooterView from './FooterView.vue';
import ItemRender from '../components/Renders/ItemRender.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, watchEffect } from 'vue';

const store = useUserStore()
const loggedUser = ref(store.loggedUser)

watchEffect(() => {
  loggedUser.value = store.loggedUser
})
</script>

<template>
  <v-app>
    <v-main class="shop-main">
      <!-- Overlay oscuro para mejorar legibilidad -->
      <div class="overlay"></div>
      
      <v-container class="shop-container fill-height d-flex flex-column pa-6">
        <!-- Header de la tienda -->
        <v-row class="w-100 justify-center mb-8">
          <v-col cols="12" md="10" lg="8">
            <div class="shop-header">
              <div class="header-content">
                <div class="shop-icon">
                  <v-icon size="48" color="#FFD700">mdi-store</v-icon>
                </div>
                <div class="shop-title-section">
                  <h1 class="shop-title">
                    {{ $t('tienda') }}
                  </h1>
                  <p class="shop-subtitle">{{ $t('mejora tus atributos con objetos únicos') }}</p>
                </div>
              </div>
              
              <!-- Badge de oro del usuario -->
              <div class="gold-badge">
                <v-icon class="gold-icon" size="28" color="#FFD700">mdi-currency-usd</v-icon>
                <div class="gold-info">
                  <span class="gold-label">{{ $t('tu oro') }}</span>
                  <span class="gold-amount">{{ loggedUser?.gold || 0 }}</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Contenido de la tienda -->
        <v-row class="w-100 justify-center flex-grow-1">
          <v-col cols="12" md="10" lg="8">
            <div class="items-wrapper">
              <ItemRender />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.shop-main {
  position: relative;
  min-height: 100vh;
  background-image: url('../assets/imgs/gimansio-fondo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(13, 27, 42, 0.85) 50%,
    rgba(0, 0, 0, 0.75) 100%
  );
  z-index: 1;
}

.shop-container {
  position: relative;
  z-index: 2;
}

.shop-header {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.shop-icon {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
}

.shop-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.shop-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #FFD700;
  margin: 0;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(255, 215, 0, 0.3);
  letter-spacing: 1px;
}

.shop-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 400;
}

.gold-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.15) 100%);
  padding: 1rem 1.5rem;
  border-radius: 50px;
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
}

.gold-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
  border-color: rgba(255, 215, 0, 0.6);
}

.gold-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.gold-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.gold-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.gold-amount {
  font-size: 1.75rem;
  font-weight: 800;
  color: #FFD700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.items-wrapper {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 960px) {
  .shop-header {
    flex-direction: column;
    text-align: center;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .shop-title {
    font-size: 2rem;
  }

  .gold-badge {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .shop-title {
    font-size: 1.75rem;
  }

  .shop-header {
    padding: 1.5rem;
  }

  .gold-amount {
    font-size: 1.5rem;
  }
}
</style>