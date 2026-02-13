<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { computed, onMounted, watch } from 'vue'

const store = useUserStore()
const loggedUser = computed(() => store.loggedUser)

onMounted(() => {
  if (loggedUser.value?.email && loggedUser.value?.passwordhash) {
    store.getItems()
  }
})

watch(loggedUser, (newUser) => {
  if (newUser?.email && newUser?.passwordhash) {
    store.getItems()
  }
})

// Computed: Filtrar items por tipo
const strengthItems = computed(() => {
  return store.purchasedItems?.filter(item => 
    item.itemType.toLowerCase() === 'strength' || 
    item.itemType.toLowerCase() === 'fuerza'
  ) || []
})

const enduranceItems = computed(() => {
  return store.purchasedItems?.filter(item => 
    item.itemType.toLowerCase() === 'endurance' || 
    item.itemType.toLowerCase() === 'resistencia'
  ) || []
})

const totalItems = computed(() => store.purchasedItems?.length || 0)

// Verificar si un item está equipado
const isItemEquipped = (itemId: number, itemType: string) => {
  if (!loggedUser.value) return false
  
  const typeLower = itemType.toLowerCase()
  if (typeLower === 'strength' || typeLower === 'fuerza') {
    return loggedUser.value.equippedStrengthItemId === itemId
  }
  if (typeLower === 'endurance' || typeLower === 'resistencia') {
    return loggedUser.value.equippedEnduranceItemId === itemId
  }
  return false
}

// Manejar equipar/desequipar
const handleItemClick = async (item: any) => {
  const typeLower = item.itemType.toLowerCase()
  const isEquipped = isItemEquipped(item.itemId, item.itemType)
  
  if (isEquipped) {
    // Desequipar
    await store.unequipItem(typeLower === 'strength' || typeLower === 'fuerza' ? 'strength' : 'endurance')
  } else {
    // Equipar
    await store.equipItem(item.itemId)
  }
}

const getItemRarity = (bonus: number) => {
  if (bonus >= 50) return 'legendary'
  if (bonus >= 30) return 'epic'
  if (bonus >= 15) return 'rare'
  return 'common'
}

const getItemIcon = (type: string) => {
  const icons: Record<string, string> = {
    'fuerza': '💪',
    'strength': '💪',
    'resistencia': '🏃',
    'endurance': '🏃',
    'velocidad': '⚡',
    'defensa': '🛡️',
    'agilidad': '🦅',
    'poder': '⭐',
    'default': '🎁'
  }
  return icons[type.toLowerCase()] || icons.default
}

const getItemTypeClass = (type: string) => {
  const typeLower = type.toLowerCase()
  if (typeLower === 'strength' || typeLower === 'fuerza') return 'type-strength'
  if (typeLower === 'endurance' || typeLower === 'resistencia') return 'type-endurance'
  return ''
}

// Función para manejar errores de carga de imagen
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const fallbackIcon = img.nextElementSibling as HTMLElement
  if (fallbackIcon) {
    fallbackIcon.style.display = 'flex'
  }
}
</script>

<template>
  <v-container
    v-if="loggedUser?.role !== 'userMaster'"
    class="inventory-wrapper"
    fluid
  >
    <div class="inventory-header">
      <div class="header-decoration"></div>
      <h2 class="inventory-title">
        <span class="title-icon">🎒</span>
        {{ $t('inventario') }}
        <span class="item-count">{{ totalItems }}</span>
      </h2>
      <div class="header-decoration"></div>
    </div>

    <div v-if="totalItems === 0" class="empty-inventory">
      <div class="empty-icon">📦</div>
      <p class="empty-text">{{ $t('inventario_vacio') || 'Tu inventario está vacío' }}</p>
      <p class="empty-subtext">{{ $t('compra_items') || '¡Completa retos para conseguir items!' }}</p>
    </div>

    <div v-else class="inventory-sections">
      <!-- Sección de Fuerza -->
      <div class="section-container">
        <div class="section-header strength-header">
          <div class="section-icon">💪</div>
          <h3 class="section-title">{{ $t('items_fuerza') || 'Items de Fuerza' }}</h3>
          <span class="section-count">{{ strengthItems.length }}</span>
        </div>

        <div v-if="strengthItems.length === 0" class="empty-section">
          <p>{{ $t('no_items_fuerza') || 'No tienes items de fuerza' }}</p>
        </div>

        <v-row v-else justify="start" class="items-grid">
          <v-col
            v-for="item in strengthItems"
            :key="item.purchaseId"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <div 
              class="item-card"
              :class="[
                `rarity-${getItemRarity(item.itemBonus)}`, 
                getItemTypeClass(item.itemType),
                { 'equipped': isItemEquipped(item.itemId, item.itemType) }
              ]"
              @click="handleItemClick(item)"
            >
              <!-- Efectos de equipado -->
              <div v-if="isItemEquipped(item.itemId, item.itemType)" class="equipped-effects">
                <div class="equipped-border-animation"></div>
                <div class="equipped-particles">
                  <span class="particle">✨</span>
                  <span class="particle">⭐</span>
                  <span class="particle">✨</span>
                  <span class="particle">⭐</span>
                </div>
              </div>
              
              <div class="item-shine"></div>
              <div class="item-glow"></div>
              
              <!-- Badge de equipado renovado -->
              <div v-if="isItemEquipped(item.itemId, item.itemType)" class="equipped-badge">
                <div class="badge-glow"></div>
                <span class="equipped-icon">⚔️</span>
              </div>
              
              <!-- Bonus destacado -->
              <div class="bonus-badge">
                <span class="bonus-sign">+</span>
                <span class="bonus-number">{{ item.itemBonus }}</span>
              </div>
              
              <div class="item-icon-wrapper">
                <!-- Imagen del item -->
                <img 
                  v-if="item.imageUrl"
                  :src="item.imageUrl" 
                  :alt="item.itemName"
                  class="item-image"
                  @error="handleImageError"
                />
                <!-- Fallback al icono emoji si la imagen no carga -->
                <div class="item-icon item-icon-fallback" style="display: none;">
                  {{ getItemIcon(item.itemType) }}
                </div>
                <div v-if="isItemEquipped(item.itemId, item.itemType)" class="icon-ring"></div>
              </div>
              
              <div class="item-content">
                <div class="item-name">{{ item.itemName }}</div>
                <div class="item-type-badge">
                  <span class="type-icon">💪</span>
                  {{ item.itemType }}
                </div>
              </div>

              <!-- Nuevo sistema de acción -->
              <div class="equip-action-container">
                <button 
                  v-if="isItemEquipped(item.itemId, item.itemType)" 
                  class="equip-button unequip"
                >
                  <span class="button-icon">🔓</span>
                  <span class="button-text">Desequipar</span>
                </button>
                <button 
                  v-else 
                  class="equip-button equip"
                >
                  <span class="button-icon">⚡</span>
                  <span class="button-text">Equipar</span>
                </button>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Sección de Resistencia -->
      <div class="section-container">
        <div class="section-header endurance-header">
          <div class="section-icon">🏃</div>
          <h3 class="section-title">{{ $t('items_resistencia') || 'Items de Resistencia' }}</h3>
          <span class="section-count">{{ enduranceItems.length }}</span>
        </div>

        <div v-if="enduranceItems.length === 0" class="empty-section">
          <p>{{ $t('no_items_resistencia') || 'No tienes items de resistencia' }}</p>
        </div>

        <v-row v-else justify="start" class="items-grid">
          <v-col
            v-for="item in enduranceItems"
            :key="item.purchaseId"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <div 
              class="item-card"
              :class="[
                `rarity-${getItemRarity(item.itemBonus)}`, 
                getItemTypeClass(item.itemType),
                { 'equipped': isItemEquipped(item.itemId, item.itemType) }
              ]"
              @click="handleItemClick(item)"
            >
              <!-- Efectos de equipado -->
              <div v-if="isItemEquipped(item.itemId, item.itemType)" class="equipped-effects">
                <div class="equipped-border-animation"></div>
                <div class="equipped-particles">
                  <span class="particle">✨</span>
                  <span class="particle">⭐</span>
                  <span class="particle">✨</span>
                  <span class="particle">⭐</span>
                </div>
              </div>
              
              <div class="item-shine"></div>
              <div class="item-glow"></div>
              
              <!-- Badge de equipado renovado -->
              <div v-if="isItemEquipped(item.itemId, item.itemType)" class="equipped-badge">
                <div class="badge-glow"></div>
                <span class="equipped-icon">⚔️</span>
              </div>
              
              <!-- Bonus destacado -->
              <div class="bonus-badge">
                <span class="bonus-sign">+</span>
                <span class="bonus-number">{{ item.itemBonus }}</span>
              </div>
              
              <div class="item-icon-wrapper">
                <!-- Imagen del item -->
                <img 
                  v-if="item.imageUrl"
                  :src="item.imageUrl" 
                  :alt="item.itemName"
                  class="item-image"
                  @error="handleImageError"
                />
                <!-- Fallback al icono emoji si la imagen no carga -->
                <div class="item-icon item-icon-fallback" style="display: none;">
                  {{ getItemIcon(item.itemType) }}
                </div>
                <div v-if="isItemEquipped(item.itemId, item.itemType)" class="icon-ring"></div>
              </div>
              
              <div class="item-content">
                <div class="item-name">{{ item.itemName }}</div>
                <div class="item-type-badge">
                  <span class="type-icon">🏃</span>
                  {{ item.itemType }}
                </div>
              </div>

              <!-- Nuevo sistema de acción -->
              <div class="equip-action-container">
                <button 
                  v-if="isItemEquipped(item.itemId, item.itemType)" 
                  class="equip-button unequip"
                >
                  <span class="button-icon">🔓</span>
                  <span class="button-text">Desequipar</span>
                </button>
                <button 
                  v-else 
                  class="equip-button equip"
                >
                  <span class="button-icon">⚡</span>
                  <span class="button-text">Equipar</span>
                </button>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.inventory-wrapper {
  margin: 2rem auto;
  padding: 2rem;
  max-width: 1400px;
  position: relative;
}

/* Header */
.inventory-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  position: relative;
}

.header-decoration {
  height: 3px;
  width: 80px;
  background: linear-gradient(90deg, transparent, #0D6EFD, transparent);
  border-radius: 2px;
}

.inventory-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #0D6EFD 0%, #0a58ca 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(13, 110, 253, 0.2);
}

.title-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.item-count {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

/* Empty State */
.empty-inventory {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 24px;
  border: 2px dashed #dee2e6;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

.empty-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #495057;
  margin-bottom: 0.5rem;
}

.empty-subtext {
  font-size: 1rem;
  color: #6c757d;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Inventory Sections */
.inventory-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.section-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid;
}

.strength-header {
  border-bottom-color: #dc3545;
}

.endurance-header {
  border-bottom-color: #0dcaf0;
}

.section-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.section-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.strength-header .section-title {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.endurance-header .section-title {
  background: linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-count {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
  min-width: 50px;
  text-align: center;
}

.strength-header .section-count {
  background: linear-gradient(135deg, #dc3545, #c82333);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.endurance-header .section-count {
  background: linear-gradient(135deg, #0dcaf0, #0aa2c0);
  box-shadow: 0 4px 12px rgba(13, 202, 240, 0.3);
}

/* Empty Section */
.empty-section {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 2px dashed #dee2e6;
}

.empty-section p {
  font-size: 1.125rem;
  color: #6c757d;
  margin: 0;
  font-weight: 600;
}

/* Items Grid */
.items-grid {
  gap: 2rem;
}

/* Item Card - MEJORADO */
.item-card {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 1.5rem;
  padding-bottom: 4rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 3px solid #e9ecef;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  min-height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.item-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}

/* ========== EFECTOS DE EQUIPADO ========== */

/* Estado equipado mejorado */
.item-card.equipped {
  border: 4px solid transparent;
  background: 
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(135deg, #ffd700, #ffed4e, #ffd700, #ffb700) border-box;
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.6),
    0 8px 24px rgba(255, 215, 0, 0.4),
    inset 0 0 20px rgba(255, 215, 0, 0.1);
  animation: equipped-pulse 3s ease-in-out infinite;
}

.item-card.equipped:hover {
  box-shadow: 
    0 0 40px rgba(255, 215, 0, 0.8),
    0 16px 40px rgba(255, 215, 0, 0.6),
    inset 0 0 30px rgba(255, 215, 0, 0.15);
  transform: translateY(-12px) scale(1.05);
}

@keyframes equipped-pulse {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(255, 215, 0, 0.6),
      0 8px 24px rgba(255, 215, 0, 0.4),
      inset 0 0 20px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 
      0 0 45px rgba(255, 215, 0, 0.8),
      0 12px 32px rgba(255, 215, 0, 0.6),
      inset 0 0 30px rgba(255, 215, 0, 0.2);
  }
}

/* Borde animado para items equipados */
.equipped-border-animation {
  position: absolute;
  inset: -4px;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700, #ffb700);
  background-size: 300% 300%;
  animation: gradient-rotate 4s ease infinite;
  z-index: -1;
  opacity: 0.8;
}

@keyframes gradient-rotate {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Partículas flotantes */
.equipped-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  font-size: 1.2rem;
  animation: float-particle 3s ease-in-out infinite;
  opacity: 0;
}

.particle:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  top: 60%;
  right: 15%;
  animation-delay: 0.7s;
}

.particle:nth-child(3) {
  bottom: 30%;
  left: 20%;
  animation-delay: 1.4s;
}

.particle:nth-child(4) {
  top: 40%;
  right: 20%;
  animation-delay: 2.1s;
}

@keyframes float-particle {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
}

/* Badge de equipado renovado */
.equipped-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  color: #8b6914;
  padding: 0.6rem 1rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 6px 20px rgba(255, 215, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  z-index: 15;
  animation: badge-glow 2s ease-in-out infinite;
  overflow: hidden;
}

.badge-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  animation: badge-shine 3s linear infinite;
}

@keyframes badge-shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

@keyframes badge-glow {
  0%, 100% {
    box-shadow: 
      0 6px 20px rgba(255, 215, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }
  50% {
    box-shadow: 
      0 8px 30px rgba(255, 215, 0, 0.9),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
}

.equipped-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.equipped-text {
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Anillo alrededor del icono para items equipados */
.icon-ring {
  position: absolute;
  inset: -15px;
  border: 3px solid #ffd700;
  border-radius: 50%;
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.6),
    inset 0 0 20px rgba(255, 215, 0, 0.3);
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* Bonus Badge */
.bonus-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.5rem 0.9rem;
  border-radius: 16px;
  box-shadow: 
    0 4px 12px rgba(16, 185, 129, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  font-weight: 900;
  z-index: 10;
  transform: rotate(5deg);
  transition: all 0.3s ease;
}

.item-card:hover .bonus-badge {
  transform: rotate(0deg) scale(1.1);
  box-shadow: 
    0 6px 20px rgba(16, 185, 129, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.bonus-sign {
  font-size: 1.1rem;
  opacity: 0.9;
}

.bonus-number {
  font-size: 1.6rem;
  line-height: 1;
  font-family: 'Courier New', monospace;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* ========== SISTEMA DE BOTONES DE EQUIPAR ========== */

.equip-action-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.equip-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.equip-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.equip-button:hover::before {
  width: 300px;
  height: 300px;
}

.button-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s;
}

.equip-button:hover .button-icon {
  transform: scale(1.2) rotate(10deg);
}

.button-text {
  position: relative;
  z-index: 1;
}

/* Botón Equipar */
.equip-button.equip {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 
    0 4px 15px rgba(16, 185, 129, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.equip-button.equip:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 
    0 6px 25px rgba(16, 185, 129, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.equip-button.equip:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 10px rgba(16, 185, 129, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Botón Desequipar */
.equip-button.unequip {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 
    0 4px 15px rgba(239, 68, 68, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation: unequip-pulse 2s ease-in-out infinite;
}

.equip-button.unequip:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 
    0 6px 25px rgba(239, 68, 68, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  animation: none;
}

.equip-button.unequip:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 10px rgba(239, 68, 68, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

@keyframes unequip-pulse {
  0%, 100% {
    box-shadow: 
      0 4px 15px rgba(239, 68, 68, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 
      0 6px 20px rgba(239, 68, 68, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

/* ========== FIN SISTEMA DE BOTONES ========== */

/* Type-specific Styles */
.type-strength {
  border-color: #dc3545 !important;
  background: linear-gradient(135deg, #ffffff 0%, #ffe5e8 100%) !important;
}

.type-strength:hover {
  border-color: #c82333 !important;
  box-shadow: 0 16px 40px rgba(220, 53, 69, 0.4) !important;
}

.type-strength.equipped {
  border-color: #ffd700 !important;
  background: linear-gradient(135deg, #fffef0 0%, #ffe5e8 100%) !important;
}

.type-strength .item-type-badge {
  background: linear-gradient(135deg, #dc3545, #c82333) !important;
  box-shadow: 0 3px 10px rgba(220, 53, 69, 0.4) !important;
}

.type-strength .item-glow {
  background: linear-gradient(135deg, #dc3545, #c82333) !important;
}

.type-endurance {
  border-color: #0dcaf0 !important;
  background: linear-gradient(135deg, #ffffff 0%, #e5f8fc 100%) !important;
}

.type-endurance:hover {
  border-color: #0aa2c0 !important;
  box-shadow: 0 16px 40px rgba(13, 202, 240, 0.4) !important;
}

.type-endurance.equipped {
  border-color: #ffd700 !important;
  background: linear-gradient(135deg, #fffef0 0%, #e5f8fc 100%) !important;
}

.type-endurance .item-type-badge {
  background: linear-gradient(135deg, #0dcaf0, #0aa2c0) !important;
  box-shadow: 0 3px 10px rgba(13, 202, 240, 0.4) !important;
}

.type-endurance .item-glow {
  background: linear-gradient(135deg, #0dcaf0, #0aa2c0) !important;
}

/* Rarity Styles */
.rarity-common {
  border-color: #adb5bd;
}

.rarity-common:hover {
  border-color: #868e96;
  box-shadow: 0 16px 40px rgba(173, 181, 189, 0.35);
}

.rarity-rare {
  border-color: #0D6EFD;
  background: linear-gradient(135deg, #ffffff 0%, #e7f1ff 100%);
}

.rarity-rare:hover {
  border-color: #0a58ca;
  box-shadow: 0 16px 40px rgba(13, 110, 253, 0.45);
}

.rarity-epic {
  border-color: #9b59b6;
  background: linear-gradient(135deg, #ffffff 0%, #f3e5f5 100%);
}

.rarity-epic:hover {
  border-color: #8e44ad;
  box-shadow: 0 16px 40px rgba(155, 89, 182, 0.45);
}

.rarity-legendary {
  border-color: #f39c12;
  background: linear-gradient(135deg, #ffffff 0%, #fff8e1 100%);
  animation: legendary-pulse 2s ease-in-out infinite;
}

.rarity-legendary:hover {
  border-color: #e67e22;
  box-shadow: 0 16px 40px rgba(243, 156, 18, 0.55);
}

.rarity-legendary .bonus-badge {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  animation: bonus-pulse 2s ease-in-out infinite;
}

@keyframes legendary-pulse {
  0%, 100% { box-shadow: 0 6px 16px rgba(243, 156, 18, 0.3); }
  50% { box-shadow: 0 6px 28px rgba(243, 156, 18, 0.55); }
}

@keyframes bonus-pulse {
  0%, 100% { 
    box-shadow: 
      0 4px 12px rgba(243, 156, 18, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% { 
    box-shadow: 
      0 6px 20px rgba(243, 156, 18, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

/* Item Effects */
.item-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s;
}

.item-card:hover .item-shine {
  opacity: 1;
  animation: shine 0.8s ease-in-out;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.item-glow {
  position: absolute;
  inset: -3px;
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.item-card:hover .item-glow {
  opacity: 1;
  filter: blur(15px);
}

.rarity-rare:hover .item-glow {
  opacity: 1;
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  filter: blur(15px);
}

.rarity-epic:hover .item-glow {
  opacity: 1;
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  filter: blur(15px);
}

.rarity-legendary:hover .item-glow {
  opacity: 1;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  filter: blur(15px);
}

/* ========== MEJORAS EN EL CONTENEDOR DE IMAGEN ========== */

.item-icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 180px;
  aspect-ratio: 1;
  margin: 1rem auto;
  padding: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9));
  border-radius: 16px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.item-card:hover .item-icon-wrapper {
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.15),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
  transition: all 0.3s ease;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
  transition: all 0.3s ease;
  border-radius: 12px;
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}

.item-card:hover .item-image {
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
  transform: scale(1.08) rotate(2deg);
}

/* Items equipados - imagen con brillo especial */
.item-card.equipped .item-icon-wrapper {
  background: linear-gradient(135deg, rgba(255, 247, 205, 0.95), rgba(255, 237, 160, 0.95));
  box-shadow: 
    0 0 25px rgba(255, 215, 0, 0.4),
    0 6px 16px rgba(255, 215, 0, 0.3),
    inset 0 2px 6px rgba(255, 255, 255, 0.9);
}

.item-card.equipped:hover .item-icon-wrapper {
  box-shadow: 
    0 0 35px rgba(255, 215, 0, 0.6),
    0 10px 24px rgba(255, 215, 0, 0.5),
    inset 0 2px 6px rgba(255, 255, 255, 0.9);
}

.item-card.equipped .item-image {
  filter: drop-shadow(0 6px 12px rgba(255, 215, 0, 0.3));
}

.item-card.equipped:hover .item-image {
  filter: drop-shadow(0 10px 20px rgba(255, 215, 0, 0.5));
}

/* Fallback icon emoji */
.item-icon {
  font-size: 4rem;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15));
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon-fallback {
  display: none;
}

.item-card:hover .item-icon {
  transform: scale(1.15) rotate(8deg);
}

/* ========== FIN MEJORAS IMAGEN ========== */

/* Item Content */
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;
}

.item-name {
  font-weight: 800;
  font-size: 1.1rem;
  color: #212529;
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
  min-height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 3px 10px rgba(13, 110, 253, 0.3);
}

.type-icon {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 960px) {
  .item-icon-wrapper {
    max-width: 140px;
  }
  
  .item-card {
    min-height: 350px;
  }
}

@media (max-width: 600px) {
  .inventory-wrapper {
    padding: 1rem;
  }
  
  .inventory-header {
    margin-bottom: 2rem;
  }
  
  .header-decoration {
    width: 40px;
  }

  .inventory-sections {
    gap: 2rem;
  }

  .section-container {
    padding: 1.5rem;
  }

  .section-header {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .section-icon {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
    flex-basis: 100%;
  }

  .section-count {
    font-size: 1rem;
    padding: 0.35rem 0.75rem;
  }

  .items-grid {
    gap: 1.5rem;
  }
  
  .item-card {
    padding: 1.25rem;
    padding-bottom: 3.5rem;
    min-height: 340px;
  }

  .equipped-badge {
    top: 6px;
    left: 6px;
    padding: 0.4rem 0.7rem;
    font-size: 0.7rem;
    gap: 0.35rem;
  }

  .equipped-icon {
    font-size: 1rem;
  }

  .bonus-badge {
    top: 8px;
    right: 8px;
    padding: 0.4rem 0.75rem;
  }

  .bonus-sign {
    font-size: 1rem;
  }

  .bonus-number {
    font-size: 1.4rem;
  }

  .item-icon-wrapper {
    max-width: 120px;
    margin: 0.75rem auto;
    padding: 6px;
  }
  
  .item-icon {
    font-size: 3rem;
  }

  .icon-ring {
    inset: -12px;
    border-width: 2px;
  }
  
  .item-name {
    font-size: 0.95rem;
    min-height: 2.1rem;
  }

  .item-type-badge {
    padding: 0.4rem 0.85rem;
    font-size: 0.75rem;
  }

  .equip-button {
    padding: 0.6rem 0.85rem;
    font-size: 0.75rem;
  }

  .button-icon {
    font-size: 1rem;
  }

  .particle {
    font-size: 1rem;
  }

  .empty-section {
    padding: 2rem 1rem;
  }

  .empty-section p {
    font-size: 1rem;
  }
}
</style>