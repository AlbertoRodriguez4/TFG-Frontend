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
              :class="[`rarity-${getItemRarity(item.itemBonus)}`, getItemTypeClass(item.itemType)]"
            >
              <div class="item-shine"></div>
              <div class="item-glow"></div>
              
              <!-- Bonus destacado en la parte superior -->
              <div class="bonus-badge">
                <span class="bonus-sign">+</span>
                <span class="bonus-number">{{ item.itemBonus }}</span>
              </div>
              
              <div class="item-icon-wrapper">
                <div class="item-icon">{{ getItemIcon(item.itemType) }}</div>
              </div>
              
              <div class="item-content">
                <div class="item-name">{{ item.itemName }}</div>
                <div class="item-type-badge">
                  <span class="type-icon">💪</span>
                  {{ item.itemType }}
                </div>
              </div>
              
              <div class="item-corner tl"></div>
              <div class="item-corner tr"></div>
              <div class="item-corner bl"></div>
              <div class="item-corner br"></div>
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
              :class="[`rarity-${getItemRarity(item.itemBonus)}`, getItemTypeClass(item.itemType)]"
            >
              <div class="item-shine"></div>
              <div class="item-glow"></div>
              
              <!-- Bonus destacado en la parte superior -->
              <div class="bonus-badge">
                <span class="bonus-sign">+</span>
                <span class="bonus-number">{{ item.itemBonus }}</span>
              </div>
              
              <div class="item-icon-wrapper">
                <div class="item-icon">{{ getItemIcon(item.itemType) }}</div>
              </div>
              
              <div class="item-content">
                <div class="item-name">{{ item.itemName }}</div>
                <div class="item-type-badge">
                  <span class="type-icon">🏃</span>
                  {{ item.itemType }}
                </div>
              </div>
              
              <div class="item-corner tl"></div>
              <div class="item-corner tr"></div>
              <div class="item-corner bl"></div>
              <div class="item-corner br"></div>
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

/* Item Card - REESTRUCTURADO */
.item-card {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 1.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 3px solid #e9ecef;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.item-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}

/* Bonus Badge - DESTACADO EN LA PARTE SUPERIOR */
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

/* Type-specific Styles */
.type-strength {
  border-color: #dc3545 !important;
  background: linear-gradient(135deg, #ffffff 0%, #ffe5e8 100%) !important;
}

.type-strength:hover {
  border-color: #c82333 !important;
  box-shadow: 0 16px 40px rgba(220, 53, 69, 0.4) !important;
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

/* Corners */
.item-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.item-card:hover .item-corner {
  opacity: 0.8;
}

.item-corner.tl {
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
}

.item-corner.tr {
  top: 8px;
  right: 8px;
  border-left: none;
  border-bottom: none;
}

.item-corner.bl {
  bottom: 8px;
  left: 8px;
  border-right: none;
  border-top: none;
}

.item-corner.br {
  bottom: 8px;
  right: 8px;
  border-left: none;
  border-top: none;
}

/* Item Icon */
.item-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.item-icon {
  font-size: 3.5rem;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15));
  transition: transform 0.3s ease;
}

.item-card:hover .item-icon {
  transform: scale(1.2) rotate(8deg);
}

/* Item Content */
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
}

.item-name {
  font-weight: 800;
  font-size: 1.15rem;
  color: #212529;
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
  min-height: 2.6rem;
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
    padding: 1.5rem;
    min-height: 260px;
  }

  .bonus-badge {
    top: 10px;
    right: 10px;
    padding: 0.4rem 0.75rem;
  }

  .bonus-sign {
    font-size: 1rem;
  }

  .bonus-number {
    font-size: 1.4rem;
  }
  
  .item-icon {
    font-size: 3rem;
  }
  
  .item-name {
    font-size: 1rem;
    min-height: 2.2rem;
  }

  .item-type-badge {
    padding: 0.4rem 0.85rem;
    font-size: 0.75rem;
  }

  .empty-section {
    padding: 2rem 1rem;
  }

  .empty-section p {
    font-size: 1rem;
  }
}
</style>