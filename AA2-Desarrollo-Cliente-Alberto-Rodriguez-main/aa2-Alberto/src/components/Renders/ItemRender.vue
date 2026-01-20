<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useItemStore } from '@/stores/itemStore'
import { useUserStore } from '@/stores/userStore'
import { usePurchaseStore } from '@/stores/PurchaseStore'
import type { Item } from '@/components/Models/Item'

const itemStore = useItemStore()
const userStore = useUserStore()
const purchaseStore = usePurchaseStore()

const loggedUser = ref(userStore.loggedUser)
watchEffect(() => {
  loggedUser.value = userStore.loggedUser
})

onMounted(() => {
  itemStore.fetchDailyStrengthItems()
  itemStore.fetchDailyEnduranceItems()
  itemStore.fetchDailyGeneralItems()
})

const dailyRotation = computed(() => itemStore.generalItems)
const strengthItems = computed(() => itemStore.strengthItems)
const enduranceItems = computed(() => itemStore.enduranceItems)

const showDialog = ref(false)
const selectedItem = ref<Item | null>(null)

const openPopup = (item: Item) => {
  selectedItem.value = item
  showDialog.value = true
}

const closePopup = () => {
  showDialog.value = false
  selectedItem.value = null
}

const handleBuy = async () => {
  const userId = loggedUser.value?.id
  const item = selectedItem.value
  if (!userId || !item) return

  try {
    console.log(userId + " " + item.id + " " + item.price)
    const purchase = await purchaseStore.addPurchase(userId, item.id, item.price)
    if (purchase && purchase.id) {
      alert("Compra realizada correctamente")
      await userStore.refreshLoggedUser()
      closePopup()
    } else {
      throw new Error("Respuesta inválida del servidor")
    }
  } catch (error: any) {
    const message = error?.data?.message
    if (message?.includes("no tiene suficiente oro")) {
      alert("No tienes suficiente oro para realizar esta compra.")
    } else {
      alert(message || "Hubo un problema al realizar la compra.")
    }
    closePopup()
  }
}

const canAfford = (price: number) => {
  return (loggedUser.value?.gold || 0) >= price
}

const getItemIcon = (type: string) => {
  if (type === 'Strength') return 'mdi-dumbbell'
  if (type === 'Endurance') return 'mdi-run-fast'
  return 'mdi-star-circle'
}

const getItemColor = (type: string) => {
  if (type === 'Strength') return '#FF4757'
  if (type === 'Endurance') return '#00D2FF'
  return '#FFD700'
}
</script>

<template>
  <v-container fluid class="items-container pa-6">
    <!-- Sección: Rotación diaria -->
    <section class="shop-section mb-10">
      <div class="section-header">
        <div class="header-icon-wrapper daily">
          <v-icon size="32" color="black">mdi-clock-fast</v-icon>
        </div>
        <div>
          <h2 class="section-title">{{ $t('Rotacion Diaria') }}</h2>
          <p class="section-subtitle">{{ $t('Ofertas limitadas que cambian cada día') }}</p>
        </div>
        <div class="daily-badge">
          <v-icon size="20" color="#FFD700">mdi-timer-sand</v-icon>
          <span>24h</span>
        </div>
      </div>
      
      <v-row class="items-grid">
        <v-col
          v-for="item in dailyRotation"
          :key="item.id"
          cols="12"
          sm="6"
          md="6"
          lg="4"
        >
          <div class="item-card daily-item" @click="openPopup(item)">
            <div class="item-glow" :style="{ background: `radial-gradient(circle, ${getItemColor(item.type)}40 0%, transparent 70%)` }"></div>
            <div class="daily-ribbon">
              <span>DIARIO</span>
            </div>
            
            <div class="item-icon" :style="{ borderColor: getItemColor(item.type) }">
              <v-icon :color="getItemColor(item.type)" size="40">{{ getItemIcon(item.type) }}</v-icon>
            </div>
            
            <div class="item-content">
              <h3 class="item-name">{{ item.name }}</h3>
              
              <div class="item-stats">
                <div class="stat-badge" :style="{ background: `${getItemColor(item.type)}20`, borderColor: `${getItemColor(item.type)}60` }">
                  <v-icon :color="getItemColor(item.type)" size="18">{{ getItemIcon(item.type) }}</v-icon>
                  <span :style="{ color: getItemColor(item.type) }">+{{ item.bonus }}</span>
                </div>
              </div>
              
              <div class="item-price" :class="{ 'insufficient-gold': !canAfford(item.price) }">
                <v-icon size="20" color="#FFD700">mdi-currency-usd</v-icon>
                <span>{{ item.price }}</span>
              </div>
            </div>
            
            <v-btn
              v-if="loggedUser?.role !== 'userMaster'"
              :disabled="!canAfford(item.price)"
              class="buy-btn"
              :color="canAfford(item.price) ? 'primary' : 'grey'"
              variant="elevated"
              block
            >
              <v-icon left size="18">mdi-cart</v-icon>
              {{ canAfford(item.price) ? $t('comprar') : $t('oro insuficiente') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </section>

    <!-- Sección: Objetos de Fuerza -->
    <section class="shop-section mb-10">
      <div class="section-header">
        <div class="header-icon-wrapper strength">
          <v-icon size="32" color="black">mdi-arm-flex</v-icon>
        </div>
        <div>
          <h2 class="section-title strength-title">{{ $t('Objetos de fuerza') }}</h2>
          <p class="section-subtitle">{{ $t('Aumenta tu poder físico') }}</p>
        </div>
      </div>
      
      <v-row class="items-grid">
        <v-col
          v-for="item in strengthItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <div class="item-card strength-item" @click="openPopup(item)">
            <div class="item-glow" style="background: radial-gradient(circle, #FF475740 0%, transparent 70%)"></div>
            
            <div class="item-icon" style="border-color: #FF4757;">
              <v-icon color="#FF4757" size="40">mdi-dumbbell</v-icon>
            </div>
            
            <div class="item-content">
              <h3 class="item-name">{{ item.name }}</h3>
              
              <div class="item-stats">
                <div class="stat-badge" style="background: #FF475720; border-color: #FF475760;">
                  <v-icon color="#FF4757" size="18">mdi-dumbbell</v-icon>
                  <span style="color: #FF4757;">+{{ item.bonus }}</span>
                </div>
              </div>
              
              <div class="item-price" :class="{ 'insufficient-gold': !canAfford(item.price) }">
                <v-icon size="20" color="#FFD700">mdi-currency-usd</v-icon>
                <span>{{ item.price }}</span>
              </div>
            </div>
            
            <v-btn
              v-if="loggedUser?.role !== 'userMaster'"
              :disabled="!canAfford(item.price)"
              class="buy-btn"
              :color="canAfford(item.price) ? 'primary' : 'grey'"
              variant="elevated"
              block
            >
              <v-icon left size="18">mdi-cart</v-icon>
              {{ canAfford(item.price) ? $t('comprar') : $t('oro insuficiente') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </section>

    <!-- Sección: Objetos de Resistencia -->
    <section class="shop-section">
      <div class="section-header">
        <div class="header-icon-wrapper endurance">
          <v-icon size="32" color="black">mdi-lightning-bolt</v-icon>
        </div>
        <div>
          <h2 class="section-title endurance-title">{{ $t('Objetos de resistencia') }}</h2>
          <p class="section-subtitle">{{ $t('Mejora tu aguante') }}</p>
        </div>
      </div>
      
      <v-row class="items-grid">
        <v-col
          v-for="item in enduranceItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <div class="item-card endurance-item" @click="openPopup(item)">
            <div class="item-glow" style="background: radial-gradient(circle, #00D2FF40 0%, transparent 70%)"></div>
            
            <div class="item-icon" style="border-color: #00D2FF;">
              <v-icon color="#00D2FF" size="40">mdi-run-fast</v-icon>
            </div>
            
            <div class="item-content">
              <h3 class="item-name">{{ item.name }}</h3>
              
              <div class="item-stats">
                <div class="stat-badge" style="background: #00D2FF20; border-color: #00D2FF60;">
                  <v-icon color="#00D2FF" size="18">mdi-run-fast</v-icon>
                  <span style="color: #00D2FF;">+{{ item.bonus }}</span>
                </div>
              </div>
              
              <div class="item-price" :class="{ 'insufficient-gold': !canAfford(item.price) }">
                <v-icon size="20" color="#FFD700">mdi-currency-usd</v-icon>
                <span>{{ item.price }}</span>
              </div>
            </div>
            
            <v-btn
              v-if="loggedUser?.role !== 'userMaster'"
              :disabled="!canAfford(item.price)"
              class="buy-btn"
              :color="canAfford(item.price) ? 'primary' : 'grey'"
              variant="elevated"
              block
            >
              <v-icon left size="18">mdi-cart</v-icon>
              {{ canAfford(item.price) ? $t('comprar') : $t('oro insuficiente') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </section>

    <!-- Diálogo de Compra Mejorado -->
    <v-dialog v-model="showDialog" max-width="450px">
      <v-card class="purchase-dialog">
        <div class="dialog-header" :style="{ background: `linear-gradient(135deg, ${getItemColor(selectedItem?.type || '')}30 0%, transparent 100%)` }">
          <div class="dialog-icon" :style="{ background: `linear-gradient(135deg, ${getItemColor(selectedItem?.type || '')} 0%, ${getItemColor(selectedItem?.type || '')}80 100%)` }">
            <v-icon color="white" size="32">{{ getItemIcon(selectedItem?.type || '') }}</v-icon>
          </div>
          <h3 class="dialog-title">{{ selectedItem?.name }}</h3>
        </div>

        <v-card-text class="dialog-content">
          <div class="purchase-info">
            <div class="info-row">
              <span class="info-label">{{ $t('Precio') }}:</span>
              <div class="info-value gold-value">
                <v-icon size="20" color="#FFD700">mdi-currency-usd</v-icon>
                <strong>{{ selectedItem?.price }}</strong>
              </div>
            </div>
            
            <div class="info-row">
              <span class="info-label">{{ $t('Bonificación') }}:</span>
              <div class="info-value">
                <v-icon :color="getItemColor(selectedItem?.type || '')" size="20">{{ getItemIcon(selectedItem?.type || '') }}</v-icon>
                <strong :style="{ color: getItemColor(selectedItem?.type || '') }">+{{ selectedItem?.bonus }}</strong>
                <span v-if="selectedItem?.type === 'Strength'">{{ $t('fuerza') }}</span>
                <span v-else-if="selectedItem?.type === 'Endurance'">{{ $t('resistencia') }}</span>
              </div>
            </div>

            <div class="info-row balance-row" :class="{ 'insufficient': !canAfford(selectedItem?.price || 0) }">
              <span class="info-label">{{ $t('Tu oro') }}:</span>
              <div class="info-value">
                <strong>{{ loggedUser?.gold || 0 }}</strong>
              </div>
            </div>
          </div>

          <v-alert
            v-if="!canAfford(selectedItem?.price || 0)"
            type="warning"
            variant="tonal"
            class="mt-4"
          >
            {{ $t('No tienes suficiente oro para esta compra') }}
          </v-alert>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-btn color="grey-darken-1" variant="text" @click="closePopup">
            {{ $t('cancelar') }}
          </v-btn>
          <v-spacer />
          <v-btn
            :disabled="!canAfford(selectedItem?.price || 0)"
            color="primary"
            variant="elevated"
            @click="handleBuy"
          >
            <v-icon left size="18">mdi-cart-check</v-icon>
            {{ $t('confirmar compra') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.items-container {
  max-width: 100%;
}

.shop-section {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.header-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.header-icon-wrapper.daily {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.header-icon-wrapper.strength {
  background: linear-gradient(135deg, #FF4757 0%, #FF6348 100%);
}

.header-icon-wrapper.endurance {
  background: linear-gradient(135deg, #00D2FF 0%, #3A7BD5 100%);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.section-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.25rem 0 0 0;
}

.daily-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 215, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: #FFD700;
  font-weight: 700;
  margin-left: auto;
}

.items-grid {
  gap: 1.5rem;
}

.item-card {
  position: relative;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.item-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.item-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(255, 255, 255, 0.1);
}

.item-card:hover::before {
  opacity: 1;
}

.item-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.item-card:hover .item-glow {
  opacity: 1;
}

.daily-ribbon {
  position: absolute;
  top: 12px;
  right: -30px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #000;
  padding: 0.25rem 2.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  transform: rotate(45deg);
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
  letter-spacing: 1px;
}

.item-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 3px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.item-card:hover .item-icon {
  transform: scale(1.1) rotate(5deg);
}

.item-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin: 0;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-stats {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid;
  font-weight: 700;
  font-size: 0.95rem;
}

.item-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 800;
  color: #FFD700;
  margin: 0.5rem 0;
  padding: 0.75rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.item-price.insufficient-gold {
  color: #FF4757;
  border-color: rgba(255, 71, 87, 0.3);
  background: rgba(255, 71, 87, 0.1);
}

.item-price.insufficient-gold .v-icon {
  color: #FF4757 !important;
}

.buy-btn {
  margin-top: auto;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-radius: 12px !important;
  height: auto !important;
  min-height: 52px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Contenedor interno del botón */
.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.75rem 1.25rem;
  position: relative;
  z-index: 1;
  width: 100%;
}

.btn-icon {
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-text {
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  font-weight: 700;
  line-height: 1.2;
}

/* Estado: Puede comprar */
.btn-can-afford {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%) !important;
  color: #1a1a1a !important;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-can-afford::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-can-afford:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 8px 25px rgba(255, 215, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.6);
}

.btn-can-afford:hover::before {
  opacity: 1;
}

.btn-can-afford:hover .btn-icon {
  transform: scale(1.15) rotate(5deg);
  animation: cartBounce 0.6s ease;
}

.btn-can-afford:active {
  transform: translateY(-1px) scale(0.98);
  box-shadow: 
    0 4px 15px rgba(255, 215, 0, 0.4),
    0 0 20px rgba(255, 215, 0, 0.2);
}

/* Efecto de brillo animado */
.btn-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes cartBounce {
  0%, 100% {
    transform: scale(1.15) rotate(5deg) translateY(0);
  }
  50% {
    transform: scale(1.15) rotate(5deg) translateY(-5px);
  }
}

/* Estado: Oro insuficiente */
.btn-insufficient {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%) !important;
  color: rgba(255, 255, 255, 0.5) !important;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-insufficient::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0, 0, 0, 0.1) 10px,
    rgba(0, 0, 0, 0.1) 20px
  );
  pointer-events: none;
}

.btn-insufficient .btn-icon {
  opacity: 0.6;
  animation: shake 2s ease-in-out infinite;
}

.btn-insufficient .btn-text {
  opacity: 0.7;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .buy-btn {
    min-height: 48px !important;
  }

  .btn-content {
    gap: 0.5rem;
    padding: 0.65rem 1rem;
  }

  .btn-icon {
    font-size: 18px !important;
  }

  .btn-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .buy-btn {
    min-height: 44px !important;
    letter-spacing: 0.8px;
  }

  .btn-content {
    gap: 0.4rem;
    padding: 0.6rem 0.85rem;
  }

  .btn-text {
    font-size: 0.8rem;
  }
}

/* Mejoras para dispositivos táctiles */
@media (hover: none) and (pointer: coarse) {
  .buy-btn {
    min-height: 52px !important;
  }

  .btn-can-afford:active {
    transform: scale(0.97);
  }
}

/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.buy-btn {
  animation: fadeInUp 0.4s ease-out;
}

/* Estados de focus para accesibilidad */
.buy-btn:focus-visible {
  outline: 3px solid rgba(255, 215, 0, 0.5);
  outline-offset: 2px;
}

.btn-insufficient:focus-visible {
  outline-color: rgba(255, 255, 255, 0.3);
}

/* Estilos del diálogo */
.purchase-dialog {
  background: linear-gradient(145deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.dialog-header {
  padding: 2rem;
  text-align: center;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.dialog-content {
  padding: 2rem !important;
}

.purchase-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-row.balance-row {
  border: 2px solid rgba(76, 175, 80, 0.5);
  background: rgba(76, 175, 80, 0.1);
}

.info-row.balance-row.insufficient {
  border-color: rgba(255, 71, 87, 0.5);
  background: rgba(255, 71, 87, 0.1);
}

.info-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.info-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #fff;
  font-weight: 700;
}

.gold-value {
  color: #FFD700;
}

.dialog-actions {
  padding: 1.5rem 2rem !important;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 960px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .daily-badge {
    margin-left: 0;
  }

  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .shop-section {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .header-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .item-card {
    padding: 1.25rem;
  }

  .item-icon {
    width: 70px;
    height: 70px;
  }

  .item-name {
    font-size: 1rem;
  }

  .dialog-header {
    padding: 1.5rem;
  }

  .dialog-content {
    padding: 1.5rem !important;
  }

  .dialog-icon {
    width: 60px;
    height: 60px;
  }

  .dialog-title {
    font-size: 1.25rem;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .info-value {
    align-self: flex-end;
  }
}

/* Animaciones adicionales */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.daily-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 215, 0, 0.2),
    transparent
  );
  animation: shimmer 3s infinite;
}

/* Efectos de hover mejorados */
.strength-item:hover {
  border-color: rgba(255, 71, 87, 0.6);
  box-shadow: 
    0 12px 40px rgba(255, 71, 87, 0.3),
    0 0 40px rgba(255, 71, 87, 0.2);
}

.endurance-item:hover {
  border-color: rgba(0, 210, 255, 0.6);
  box-shadow: 
    0 12px 40px rgba(0, 210, 255, 0.3),
    0 0 40px rgba(0, 210, 255, 0.2);
}

.daily-item:hover {
  border-color: rgba(255, 215, 0, 0.6);
  box-shadow: 
    0 12px 40px rgba(255, 215, 0, 0.3),
    0 0 40px rgba(255, 215, 0, 0.2);
}

/* Scroll personalizado */
.items-container::-webkit-scrollbar {
  width: 8px;
}

.items-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.items-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #0D6EFD 0%, #0a58ca 100%);
  border-radius: 10px;
}

.items-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #0a58ca 0%, #084298 100%);
}
</style>