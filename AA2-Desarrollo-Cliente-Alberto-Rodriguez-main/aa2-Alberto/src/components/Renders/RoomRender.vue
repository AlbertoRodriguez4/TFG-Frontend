<script setup lang="ts">
import { useRoomStore } from '@/stores/RoomStore'
import { ref, computed, onMounted } from 'vue'
import CreateRoomPopup from '../PopUps/RoomPopup.vue'
import { useUserStore } from '@/stores/userStore'
import EditRoomPopup from '../PopUps/EditRoomPopup.vue'
import type { Room } from '../Models/Room'

const store = useRoomStore()
const userStore = useUserStore()
const loggedUser = ref(userStore.loggedUser)

const sortField = ref<'level' | 'stats' | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const searchTerm = ref('')
const selectedRoom = defineModel<{ id: number; name: string; minlevel: number; minstats: number; minconsistency: number; } | null>('selectedItem')
const showRoomPopup = ref(false)
const isPopupVisible = ref(false)

onMounted(() => {
    store.fetchRoom()
})

function toggleSort(field: 'level' | 'stats') {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDirection.value = 'asc'
    }
}

const filteredRooms = computed(() => {
    const term = searchTerm.value.toLowerCase()

    let result = store.room.filter(room =>
        room.name.toLowerCase().includes(term)
    )

    if (sortField.value) {
        const field = sortField.value === 'level' ? 'minlevel' : 'minstats'
        result.sort((a, b) =>
            sortDirection.value === 'asc' ? a[field] - b[field] : b[field] - a[field]
        )
    }

    return result
})

function showPopup() {
    isPopupVisible.value = true
}

function closePopup() {
    isPopupVisible.value = false
}

function handleCreateRoom(newRoom: { name: string; minlevel: number; minstats: number; minconsistency: number; }) {
    store.createRoom(newRoom, loggedUser.value?.id ?? 0)
    closePopup()
}

const openPopup = (room: { id: number; name: string; minlevel: number; minstats: number; minconsistency: number; }) => {
    selectedRoom.value = room;
    showRoomPopup.value = true
}

const closeRoomPopup = () => {
    showRoomPopup.value = false;
}

const getRoomDifficulty = (level: number) => {
    if (level >= 50) return 'legendary'
    if (level >= 30) return 'epic'
    if (level >= 15) return 'rare'
    return 'common'
}

const getRoomIcon = (level: number) => {
    if (level >= 50) return '👑'
    if (level >= 30) return '🔥'
    if (level >= 15) return '⚡'
    return '🏋️'
}
</script>

<template>
  <div class="rooms-wrapper">
    <div class="rooms-container">
      <!-- Header Section -->
      <div class="rooms-header">
        <div class="header-title">
          <div class="title-icon">🏛️</div>
          <h2 class="title-text">{{ $t('salas_entrenamiento') || 'Salas de Entrenamiento' }}</h2>
          <div class="rooms-count">{{ filteredRooms.length }}</div>
        </div>
        <div class="header-decoration"></div>
      </div>

      <!-- Controls Bar -->
      <div class="controls-bar">
        <!-- Search -->
        <div class="search-wrapper">
          <div class="search-icon">🔍</div>
          <input 
            v-model="searchTerm"
            type="text"
            :placeholder="$t('buscar') || 'Buscar sala...'"
            class="search-input"
          />
        </div>

        <!-- Filters -->
        <div class="filters-group">
          <button
            @click="toggleSort('level')"
            class="filter-btn"
            :class="{ active: sortField === 'level' }"
          >
            <span class="filter-icon">📊</span>
            <span class="filter-text">{{ $t('nivel') || 'Nivel' }}</span>
            <span class="filter-arrow" v-if="sortField === 'level'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </button>

          <button
            @click="toggleSort('stats')"
            class="filter-btn"
            :class="{ active: sortField === 'stats' }"
          >
            <span class="filter-icon">💪</span>
            <span class="filter-text">{{ $t('stats') || 'Stats' }}</span>
            <span class="filter-arrow" v-if="sortField === 'stats'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </button>

          <button @click="showPopup" class="create-btn">
            <span class="create-icon">✨</span>
            <span class="create-text">{{ $t('crear') || 'Crear Sala' }}</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredRooms.length === 0" class="empty-state">
        <div class="empty-icon">🏋️‍♂️</div>
        <p class="empty-title">{{ $t('no_salas') || 'No se encontraron salas' }}</p>
        <p class="empty-subtitle">{{ $t('intenta_busqueda') || 'Intenta ajustar tu búsqueda o crea una nueva sala' }}</p>
      </div>

      <!-- Rooms Grid -->
      <div v-else class="rooms-grid">
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          class="room-card"
          :class="`difficulty-${getRoomDifficulty(room.minlevel)}`"
        >
          <div class="card-glow"></div>
          <div class="card-shine"></div>

          <!-- Card Header -->
          <div class="card-header">
            <div class="room-avatar">
              <div class="avatar-icon">{{ getRoomIcon(room.minlevel) }}</div>
              <div class="avatar-ring"></div>
            </div>
            <div class="difficulty-badge" :class="`badge-${getRoomDifficulty(room.minlevel)}`">
              {{ getRoomDifficulty(room.minlevel).toUpperCase() }}
            </div>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <h3 class="room-name">{{ room.name }}</h3>
            
            <div class="requirements-section">
              <div class="requirement-item">
                <div class="req-label">
                  <span class="req-icon">📊</span>
                  <span>{{ $t('nivel_minimo') || 'Nivel Mínimo' }}</span>
                </div>
                <div class="req-value level-value">{{ room.minlevel }}</div>
              </div>

              <div class="requirement-item">
                <div class="req-label">
                  <span class="req-icon">💪</span>
                  <span>{{ $t('stats_minimas') || 'Stats Mínimas' }}</span>
                </div>
                <div class="req-value stats-value">{{ room.minstats }}</div>
              </div>

              <div class="requirement-item">
                <div class="req-label">
                  <span class="req-icon">🎯</span>
                  <span>{{ $t('consistencia') || 'Consistencia' }}</span>
                </div>
                <div class="req-value consistency-value">{{ room.minconsistency }}%</div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <button
              v-if="loggedUser?.role === 'userStaff'"
              class="edit-btn"
              @click="openPopup(room)"
            >
              <span class="btn-icon">✏️</span>
              <span>{{ $t('editar') || 'Editar' }}</span>
            </button>
            <button class="join-btn">
              <span class="btn-icon">🚀</span>
              <span>{{ $t('unirse') || 'Unirse' }}</span>
            </button>
          </div>

          <!-- Corner Decorations -->
          <div class="corner-decoration tl"></div>
          <div class="corner-decoration tr"></div>
          <div class="corner-decoration bl"></div>
          <div class="corner-decoration br"></div>
        </div>
      </div>
    </div>

    <!-- Popups -->
    <CreateRoomPopup :isVisible="isPopupVisible" @close="closePopup" @create="handleCreateRoom" />
    <EditRoomPopup
      v-if="selectedRoom"
      :isVisible="showRoomPopup"
      :room="selectedRoom"
      @close="closeRoomPopup"
      @edit="(room) => console.log('Editando', room)"
    />
  </div>
</template>

<style scoped>
.rooms-wrapper {
  width: 100%;
  padding: 1rem;
}

.rooms-container {
  max-width: 1600px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(13, 110, 253, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(13, 110, 253, 0.2);
  position: relative;
  overflow: hidden;
}

.rooms-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(13, 110, 253, 0.05) 0%, transparent 70%);
  animation: rotate-bg 30s linear infinite;
  pointer-events: none;
}

@keyframes rotate-bg {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Header */
.rooms-header {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.title-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 12px rgba(13, 110, 253, 0.4));
  animation: bounce-icon 2s ease-in-out infinite;
}

@keyframes bounce-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.title-text {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 900;
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rooms-count {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.header-decoration {
  height: 3px;
  background: linear-gradient(90deg, #0D6EFD, transparent);
  border-radius: 2px;
}

/* Controls Bar */
.controls-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  z-index: 1;
}

.search-wrapper {
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-wrapper:focus-within {
  border-color: #0D6EFD;
  box-shadow: 0 4px 16px rgba(13, 110, 253, 0.2);
  transform: translateY(-2px);
}

.search-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #212529;
  font-weight: 500;
}

.search-input::placeholder {
  color: #adb5bd;
}

/* Filters */
.filters-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #495057;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-btn:hover {
  border-color: #0D6EFD;
  color: #0D6EFD;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  border-color: #0D6EFD;
  box-shadow: 0 4px 16px rgba(13, 110, 253, 0.4);
}

.filter-icon {
  font-size: 1.125rem;
}

.filter-arrow {
  font-size: 1.25rem;
  font-weight: bold;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 16px rgba(255, 193, 7, 0.4);
}

.create-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 24px rgba(255, 193, 7, 0.5);
}

.create-icon {
  font-size: 1.125rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  border: 2px dashed #dee2e6;
  margin-top: 2rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #495057;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 1rem;
  color: #6c757d;
}

/* Rooms Grid */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

/* Room Card */
.room-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.room-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* Difficulty Variants */
.difficulty-common {
  border-color: #adb5bd;
}

.difficulty-common:hover {
  border-color: #868e96;
}

.difficulty-rare {
  border-color: #0D6EFD;
}

.difficulty-rare:hover {
  border-color: #0a58ca;
}

.difficulty-epic {
  border-color: #9b59b6;
}

.difficulty-epic:hover {
  border-color: #8e44ad;
}

.difficulty-legendary {
  border-color: #f39c12;
  animation: legendary-pulse 2s ease-in-out infinite;
}

.difficulty-legendary:hover {
  border-color: #e67e22;
}

@keyframes legendary-pulse {
  0%, 100% { box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3); }
  50% { box-shadow: 0 4px 24px rgba(243, 156, 18, 0.5); }
}

/* Card Effects */
.card-glow {
  position: absolute;
  inset: -2px;
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
  filter: blur(12px);
}

.difficulty-rare:hover .card-glow {
  opacity: 1;
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
}

.difficulty-epic:hover .card-glow {
  opacity: 1;
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.difficulty-legendary:hover .card-glow {
  opacity: 1;
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.card-shine {
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

.room-card:hover .card-shine {
  opacity: 1;
  animation: shine 0.8s ease-in-out;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

/* Corner Decorations */
.corner-decoration {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  opacity: 0.4;
}

.corner-decoration.tl {
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
}

.corner-decoration.tr {
  top: 8px;
  right: 8px;
  border-left: none;
  border-bottom: none;
}

.corner-decoration.bl {
  bottom: 8px;
  left: 8px;
  border-right: none;
  border-top: none;
}

.corner-decoration.br {
  bottom: 8px;
  right: 8px;
  border-left: none;
  border-top: none;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.room-avatar {
  position: relative;
  width: 70px;
  height: 70px;
}

.avatar-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  z-index: 1;
  position: relative;
}

.room-card:hover .avatar-icon {
  transform: scale(1.1) rotate(5deg);
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 3px solid currentColor;
  opacity: 0.3;
  animation: pulse-ring 2s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
}

.difficulty-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.badge-common {
  background: linear-gradient(135deg, #adb5bd, #868e96);
  color: white;
}

.badge-rare {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
}

.badge-epic {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
}

.badge-legendary {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

/* Card Content */
.card-content {
  margin-bottom: 1.5rem;
}

.room-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #212529;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.requirements-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.requirement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  transition: all 0.2s;
}

.requirement-item:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  transform: translateX(4px);
}

.req-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
}

.req-icon {
  font-size: 1.125rem;
}

.req-value {
  font-size: 1.125rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
}

.level-value {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
}

.stats-value {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.consistency-value {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  box-shadow: 0 2px 8px rgba(243, 156, 18, 0.3);
}

/* Card Footer */
.card-footer {
  display: flex;
  gap: 0.75rem;
}

.edit-btn,
.join-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
}

.join-btn {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
}

.join-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 16px rgba(13, 110, 253, 0.5);
}

.btn-icon {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .rooms-container {
    padding: 1rem;
  }

  .controls-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    min-width: 100%;
  }

  .filters-group {
    justify-content: space-between;
  }

  .rooms-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .card-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .title-text {
    font-size: 1.25rem;
  }

  .room-name {
    font-size: 1.25rem;
  }

  .filter-btn,
  .create-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>