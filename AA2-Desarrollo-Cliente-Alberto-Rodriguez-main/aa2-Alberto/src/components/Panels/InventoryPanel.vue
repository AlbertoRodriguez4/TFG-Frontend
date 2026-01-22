<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { computed, onMounted, watch } from 'vue'

const store = useUserStore()
const loggedUser = computed(() => store.loggedUser)

onMounted(() => {
  if (loggedUser.value?.email && loggedUser.value?.passwordhash) {
    store.getItems(loggedUser.value.email, loggedUser.value.passwordhash)
  }
})

watch(loggedUser, (newUser) => {
  if (newUser?.email && newUser?.passwordhash) {
    store.getItems(newUser.email, newUser.passwordhash)
  }
})

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
        <span class="item-count">{{ store.purchasedItems?.length || 0 }}</span>
      </h2>
      <div class="header-decoration"></div>
    </div>

    <div v-if="!store.purchasedItems || store.purchasedItems.length === 0" class="empty-inventory">
      <div class="empty-icon">📦</div>
      <p class="empty-text">{{ $t('inventario_vacio') || 'Tu inventario está vacío' }}</p>
      <p class="empty-subtext">{{ $t('compra_items') || '¡Completa retos para conseguir items!' }}</p>
    </div>

    <v-row v-else justify="center" class="items-grid">
      <v-col
        v-for="item in store.purchasedItems"
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
          
          <div class="item-icon-wrapper">
            <div class="item-icon">{{ getItemIcon(item.itemType) }}</div>
          </div>
          
          <div class="item-content">
            <div class="item-name">{{ item.itemName }}</div>
            <div class="item-type-badge">
              <span class="type-icon">⚔️</span>
              {{ item.itemType }}
            </div>
          </div>
          
          <div class="item-bonus-section">
            <div class="bonus-label">Bonus</div>
            <div class="bonus-value">+{{ item.itemBonus }}</div>
          </div>
          
          <div class="item-corner tl"></div>
          <div class="item-corner tr"></div>
          <div class="item-corner bl"></div>
          <div class="item-corner br"></div>
        </div>
      </v-col>
    </v-row>
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

/* Items Grid */
.items-grid {
  gap: 1.5rem;
}

/* Item Card */
.item-card {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  aspect-ratio: 3/4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* Type-specific Styles */
.type-strength {
  border-color: #dc3545 !important;
  background: linear-gradient(135deg, #ffffff 0%, #ffe5e8 100%) !important;
}

.type-strength:hover {
  border-color: #c82333 !important;
  box-shadow: 0 12px 32px rgba(220, 53, 69, 0.4) !important;
}

.type-strength .item-type-badge {
  background: linear-gradient(135deg, #dc3545, #c82333) !important;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3) !important;
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
  box-shadow: 0 12px 32px rgba(13, 202, 240, 0.4) !important;
}

.type-endurance .item-type-badge {
  background: linear-gradient(135deg, #0dcaf0, #0aa2c0) !important;
  box-shadow: 0 2px 8px rgba(13, 202, 240, 0.3) !important;
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
  box-shadow: 0 12px 32px rgba(173, 181, 189, 0.3);
}

.rarity-rare {
  border-color: #0D6EFD;
  background: linear-gradient(135deg, #ffffff 0%, #e7f1ff 100%);
}

.rarity-rare:hover {
  border-color: #0a58ca;
  box-shadow: 0 12px 32px rgba(13, 110, 253, 0.4);
}

.rarity-epic {
  border-color: #9b59b6;
  background: linear-gradient(135deg, #ffffff 0%, #f3e5f5 100%);
}

.rarity-epic:hover {
  border-color: #8e44ad;
  box-shadow: 0 12px 32px rgba(155, 89, 182, 0.4);
}

.rarity-legendary {
  border-color: #f39c12;
  background: linear-gradient(135deg, #ffffff 0%, #fff8e1 100%);
  animation: legendary-pulse 2s ease-in-out infinite;
}

.rarity-legendary:hover {
  border-color: #e67e22;
  box-shadow: 0 12px 32px rgba(243, 156, 18, 0.5);
}

@keyframes legendary-pulse {
  0%, 100% { box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3); }
  50% { box-shadow: 0 4px 24px rgba(243, 156, 18, 0.5); }
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
  inset: -2px;
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.item-card:hover .item-glow {
  opacity: 1;
  filter: blur(12px);
}

.rarity-rare:hover .item-glow {
  opacity: 1;
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  filter: blur(12px);
}

.rarity-epic:hover .item-glow {
  opacity: 1;
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  filter: blur(12px);
}

.rarity-legendary:hover .item-glow {
  opacity: 1;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  filter: blur(12px);
}

/* Corners */
.item-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  opacity: 0.6;
}

.item-corner.tl {
  top: 6px;
  left: 6px;
  border-right: none;
  border-bottom: none;
}

.item-corner.tr {
  top: 6px;
  right: 6px;
  border-left: none;
  border-bottom: none;
}

.item-corner.bl {
  bottom: 6px;
  left: 6px;
  border-right: none;
  border-top: none;
}

.item-corner.br {
  bottom: 6px;
  right: 6px;
  border-left: none;
  border-top: none;
}

/* Item Icon */
.item-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.item-icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s;
}

.item-card:hover .item-icon {
  transform: scale(1.15) rotate(5deg);
}

/* Item Content */
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-weight: 800;
  font-size: 1rem;
  color: #212529;
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
}

.item-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
}

.type-icon {
  font-size: 0.875rem;
}

/* Bonus Section */
.item-bonus-section {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
  text-align: center;
}

.bonus-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6c757d;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.bonus-value {
  font-size: 1.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  font-family: 'Courier New', monospace;
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
  
  .item-card {
    padding: 1rem;
  }
  
  .item-icon {
    font-size: 2.5rem;
  }
  
  .item-name {
    font-size: 0.875rem;
  }
  
  .bonus-value {
    font-size: 1.5rem;
  }
}
</style>