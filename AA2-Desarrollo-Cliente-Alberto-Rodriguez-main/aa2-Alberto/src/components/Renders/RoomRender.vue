<script setup lang="ts">
import { useRoomStore } from '@/stores/RoomStore'
import { useUserRoomStore } from '@/stores/UsersRoomStore'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import CreateRoomPopup from '../PopUps/RoomPopup.vue'
import { useUserStore } from '@/stores/userStore'
import EditRoomPopup from '../PopUps/EditRoomPopup.vue'

const store = useRoomStore()
const userRoomStore = useUserRoomStore()
const userStore = useUserStore()
const router = useRouter()
const loggedUser = ref(userStore.loggedUser)

const sortField = ref<'level' | 'stats' | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const searchTerm = ref('')
const selectedRoom = defineModel<{ id: number; name: string; minlevel: number; minstats: number; minconsistency: number; description: string; date: string; localization: string } | null>('selectedItem')
const showRoomPopup = ref(false)
const isPopupVisible = ref(false)

// Paginación
const currentPage = ref(1)
const itemsPerPage = 3

// Mapa para almacenar el conteo de miembros por sala
const roomMemberCounts = ref<Map<number, number>>(new Map())

onMounted(async () => {
  await store.fetchRoom()
  await loadRoomMemberCounts()
})

// Resetear a la primera página cuando cambie el filtro de búsqueda
watch(searchTerm, () => {
  currentPage.value = 1
})

async function loadRoomMemberCounts() {
  for (const room of store.room) {
    try {
      await userRoomStore.fetchMembersByRoomId(room.id)
      roomMemberCounts.value.set(room.id, userRoomStore.memberCount)
    } catch (error) {
      console.error(`Error loading members for room ${room.id}:`, error)
      roomMemberCounts.value.set(room.id, 0)
    }
  }
}

function getMemberCount(roomId: number): number {
  return roomMemberCounts.value.get(roomId) || 0
}

function toggleSort(field: 'level' | 'stats') {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 1 // Resetear a la primera página al ordenar
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

// Calcular el total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredRooms.value.length / itemsPerPage)
})

// Obtener las salas para la página actual
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRooms.value.slice(start, end)
})

// Funciones de navegación
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Generar array de números de página para mostrar
const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5 // Máximo de números de página visibles
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages.value)
    }
  }
  
  return pages
})

function showPopup() {
  isPopupVisible.value = true
}

function closePopup() {
  isPopupVisible.value = false
}

async function handleCreateRoom(newRoom: { name: string; minlevel: number; minstats: number; minconsistency: number; description: string; date: string; localization: string }) {
  await store.createRoom(newRoom, loggedUser.value?.id ?? 0)
  await loadRoomMemberCounts()
  closePopup()
}

const openPopup = (room: { id: number; name: string; minlevel: number; minstats: number; minconsistency: number; description: string; date: string; localization: string }) => {
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

const goToRoom = (room: any) => {
  router.push({
    name: 'sala',
    params: { id: room.id },
    query: {
      id: room.id,
      name: room.name,
      minlevel: room.minlevel,
      minstats: room.minstats,
      minconsistency: room.minconsistency,
      description: room.description,
      date: room.date,
      localization: room.localization
    }
  })
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

      <!-- Rooms Grid (con paginación) -->
      <div v-else class="rooms-grid">
        <div
          v-for="room in paginatedRooms"
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
            <div class="room-header-info">
              <h3 class="room-name">{{ room.name }}</h3>
              <div class="members-badge">
                <span class="members-icon">👥</span>
                <span class="members-count">{{ getMemberCount(room.id) }}</span>
              </div>
            </div>
            
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

              <!-- Descripción -->
              <div class="description-item">
                <div class="desc-header">
                  <span class="desc-icon">📝</span>
                  <span class="desc-title">{{ $t('descripcion') || 'Descripción' }}</span>
                </div>
                <p class="desc-text">{{ room.description || 'Sin descripción disponible' }}</p>
              </div>

              <!-- Ubicación -->
              <div class="location-item">
                <span class="location-icon">📍</span>
                <div class="location-content">
                  <span class="location-label">{{ $t('ubicacion') || 'Ubicación' }}</span>
                  <span class="location-value">{{ room.localization || 'No especificada' }}</span>
                </div>
              </div>

              <!-- Fecha de Creación -->
              <div class="date-item">
                <span class="date-icon">📅</span>
                <div class="date-content">
                  <span class="date-label">{{ $t('fecha_creacion') || 'Creada el' }}</span>
                  <span class="date-value">{{ room.date}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <button
              v-if="loggedUser?.role === 'userStaff'"
              class="edit-btn"
              @click="openPopup({ ...room, localization: room.localization ?? '' })"
            >
              <span class="btn-icon">✏️</span>
              <span>{{ $t('editar') || 'Editar' }}</span>
            </button>
            <button class="join-btn" @click="goToRoom(room)">
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

      <!-- Paginador -->
      <div v-if="filteredRooms.length > 0 && totalPages > 1" class="pagination">
        <button 
          class="pagination-btn prev-btn"
          :disabled="currentPage === 1"
          @click="previousPage"
        >
          <span class="pagination-icon">←</span>
          <span class="pagination-text">{{ $t('anterior') || 'Anterior' }}</span>
        </button>

        <div class="pagination-numbers">
          <button
            v-for="(page, index) in pageNumbers"
            :key="index"
            class="pagination-number"
            :class="{ 
              active: page === currentPage,
              ellipsis: page === '...'
            }"
            :disabled="page === '...'"
            @click="typeof page === 'number' ? goToPage(page) : null"
          >
            {{ page }}
          </button>
        </div>

        <button 
          class="pagination-btn next-btn"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          <span class="pagination-text">{{ $t('siguiente') || 'Siguiente' }}</span>
          <span class="pagination-icon">→</span>
        </button>
      </div>

      <!-- Información de paginación -->
      <div v-if="filteredRooms.length > 0" class="pagination-info">
        {{ $t('mostrando') || 'Mostrando' }} 
        {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredRooms.length) }}
        {{ $t('de') || 'de' }} {{ filteredRooms.length }}
        {{ $t('salas') || 'salas' }}
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
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

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
}

/* Room Card - Diseño moderno y premium */
.room-card {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 0;
  border: 3px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

.room-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #0D6EFD, #0a58ca);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.room-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(0, 0, 0, 0.08);
}

.room-card:hover::before {
  opacity: 1;
}

/* Difficulty Variants */
.difficulty-common::before {
  background: linear-gradient(90deg, #adb5bd, #868e96);
}

.difficulty-rare::before {
  background: linear-gradient(90deg, #0D6EFD, #0a58ca);
}

.difficulty-epic::before {
  background: linear-gradient(90deg, #9b59b6, #8e44ad);
}

.difficulty-legendary::before {
  background: linear-gradient(90deg, #f39c12, #e67e22);
  opacity: 1;
  animation: legendary-glow 2s ease-in-out infinite;
}

@keyframes legendary-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(243, 156, 18, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(243, 156, 18, 0.8);
  }
}

/* Card Effects */
.card-glow {
  position: absolute;
  inset: -3px;
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s;
  z-index: -1;
  filter: blur(20px);
}

.difficulty-rare:hover .card-glow {
  opacity: 0.6;
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
}

.difficulty-epic:hover .card-glow {
  opacity: 0.6;
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.difficulty-legendary:hover .card-glow {
  opacity: 0.8;
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.room-card:hover .card-shine {
  opacity: 1;
  animation: shine 1s ease-in-out;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* Corner Decorations - Más sutiles */
.corner-decoration {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid #e9ecef;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.room-card:hover .corner-decoration {
  opacity: 0.6;
}

.corner-decoration.tl {
  top: 12px;
  left: 12px;
  border-right: none;
  border-bottom: none;
}

.corner-decoration.tr {
  top: 12px;
  right: 12px;
  border-left: none;
  border-bottom: none;
}

.corner-decoration.bl {
  bottom: 12px;
  left: 12px;
  border-right: none;
  border-top: none;
}

.corner-decoration.br {
  bottom: 12px;
  right: 12px;
  border-left: none;
  border-top: none;
}

/* Card Header - Rediseñado */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  background: linear-gradient(180deg, rgba(13, 110, 253, 0.03) 0%, transparent 100%);
}

.room-avatar {
  position: relative;
  width: 80px;
  height: 80px;
}

.avatar-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-radius: 20px;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.1),
    inset 0 -2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
  position: relative;
  border: 3px solid white;
}

.room-card:hover .avatar-icon {
  transform: scale(1.15) rotate(10deg);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.15),
    inset 0 -2px 12px rgba(0, 0, 0, 0.08);
}

.avatar-ring {
  position: absolute;
  inset: -6px;
  border-radius: 22px;
  border: 3px solid currentColor;
  opacity: 0.2;
  animation: pulse-ring 2.5s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.05;
  }
}

.difficulty-badge {
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 1.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.room-card:hover .difficulty-badge {
  transform: translateY(-2px) scale(1.05);
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
  animation: legendary-badge 2s ease-in-out infinite;
}

@keyframes legendary-badge {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.4);
  }
  50% {
    box-shadow: 0 6px 20px rgba(243, 156, 18, 0.7);
  }
}

/* Card Content - Más espacioso */
.card-content {
  padding: 0 1.5rem 1.5rem;
}

.room-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  gap: 1rem;
}

.room-name {
  font-size: 1.625rem;
  font-weight: 900;
  color: #212529;
  margin: 0;
  line-height: 1.2;
  flex: 1;
  letter-spacing: -0.5px;
}

.members-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.members-badge:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.members-icon {
  font-size: 1.125rem;
}

.members-count {
  font-size: 0.9375rem;
  font-weight: 900;
  color: white;
  font-family: 'Courier New', monospace;
  min-width: 1.75rem;
  text-align: center;
}

.requirements-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.requirement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.125rem;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-radius: 16px;
  border: 2px solid #f1f3f5;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.requirement-item:hover {
  background: linear-gradient(135deg, #e9ecef, #f8f9fa);
  border-color: #dee2e6;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.req-label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #495057;
}

.req-icon {
  font-size: 1.25rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.req-value {
  font-size: 1.25rem;
  font-weight: 900;
  padding: 0.375rem 1rem;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.level-value {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.stats-value {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.consistency-value {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

/* Description Item - Estilo mejorado */
.description-item {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.05), rgba(13, 110, 253, 0.08));
  border: 2px solid rgba(13, 110, 253, 0.15);
  border-radius: 16px;
  padding: 1.125rem;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.08);
}

.description-item:hover {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.08), rgba(13, 110, 253, 0.12));
  border-color: rgba(13, 110, 253, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 110, 253, 0.15);
}

.desc-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.625rem;
}

.desc-icon {
  font-size: 1.375rem;
  filter: drop-shadow(0 2px 4px rgba(13, 110, 253, 0.3));
}

.desc-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #0D6EFD;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.desc-text {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #495057;
  font-style: italic;
  padding-left: 2rem;
  font-weight: 500;
}

/* Location Item - Nuevo estilo */
.location-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.12));
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
}

.location-item:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.18));
  border-color: rgba(16, 185, 129, 0.35);
  transform: translateX(6px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.2);
}

.location-icon {
  font-size: 1.625rem;
  filter: drop-shadow(0 2px 6px rgba(16, 185, 129, 0.4));
}

.location-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.location-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #065f46;
  text-transform: uppercase;
  letter-spacing: 0.75px;
}

.location-value {
  font-size: 1rem;
  font-weight: 800;
  color: #10b981;
  letter-spacing: 0.25px;
  word-break: break-word;
}

/* Date Item - Estilo mejorado */
.date-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.12));
  border: 2px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
}

.date-item:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.18));
  border-color: rgba(245, 158, 11, 0.35);
  transform: translateX(6px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.2);
}

.date-icon {
  font-size: 1.625rem;
  filter: drop-shadow(0 2px 6px rgba(245, 158, 11, 0.4));
}

.date-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.75px;
}

.date-value {
  font-size: 1rem;
  font-weight: 800;
  color: #f59e0b;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

/* Card Footer - Rediseñado */
.card-footer {
  display: flex;
  gap: 0.875rem;
  padding: 0 1.5rem 1.5rem;
}

.edit-btn,
.join-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.125rem;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.edit-btn::before,
.join-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.edit-btn:hover::before,
.join-btn:hover::before {
  left: 100%;
}

.edit-btn {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.edit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(108, 117, 125, 0.4);
  background: linear-gradient(135deg, #5a6268, #3d4349);
}

.join-btn {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  color: white;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4);
}

.join-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(13, 110, 253, 0.5);
  background: linear-gradient(135deg, #0a58ca, #0845a7);
}

.btn-icon {
  font-size: 1.125rem;
}

/* Pagination Styles - Actualizado para mantener colores */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 3rem;
  padding: 1.75rem;
  background: white;
  border-radius: 20px;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0a58ca, #0845a7);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: linear-gradient(135deg, #adb5bd, #868e96);
  box-shadow: none;
}

.pagination-icon {
  font-size: 1.125rem;
}

.pagination-text {
  font-size: 0.9375rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pagination-numbers {
  display: flex;
  gap: 0.625rem;
  align-items: center;
}

.pagination-number {
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  color: #495057;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.pagination-number:hover:not(:disabled):not(.ellipsis) {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(10, 88, 202, 0.1));
  border-color: #0D6EFD;
  color: #0D6EFD;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
}

.pagination-number.active {
  background: linear-gradient(135deg, #0D6EFD, #0a58ca);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 16px rgba(13, 110, 253, 0.4);
  transform: scale(1.1);
}

.pagination-number.ellipsis {
  cursor: default;
  background: transparent;
  border: none;
  color: #adb5bd;
  font-weight: 900;
}

.pagination-info {
  text-align: center;
  margin-top: 1.25rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 16px;
  color: #495057;
  font-size: 0.9375rem;
  font-weight: 700;
  border: 2px solid #e9ecef;
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
    gap: 1.5rem;
  }

  .card-footer {
    flex-direction: column;
  }

  .pagination {
    gap: 0.625rem;
    padding: 1.25rem;
  }

  .pagination-btn {
    padding: 0.75rem 1.125rem;
    font-size: 0.875rem;
  }

  .pagination-text {
    display: none;
  }

  .pagination-icon {
    font-size: 1.375rem;
  }

  .pagination-number {
    min-width: 38px;
    height: 38px;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .title-text {
    font-size: 1.375rem;
  }

  .room-name {
    font-size: 1.375rem;
  }

  .filter-btn,
  .create-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }

  .rooms-grid {
    grid-template-columns: 1fr;
  }
}
</style>