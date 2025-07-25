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
};
const closeRoomPopup = () => {
    showRoomPopup.value = false;
};
</script>

<template>
  <v-container fluid class="pa-4 salas-container" style="border: 10px solid #0D6EFD; border-radius: 10px; background-color: white; color: black;">
    <v-row class="mb-4" align="center" justify="space-between" no-gutters>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchTerm"
          :label="$t('buscar')"
          prepend-inner-icon="mdi-magnify"
          hide-details
          dense
          outlined
          color="primary"
          class="bg-grey-lighten-3"
        />
      </v-col>

      <v-col cols="auto">
        <v-btn
          @click="toggleSort('level')"
          :variant="sortField === 'level' ? 'tonal' : 'outlined'"
          color="primary"
          class="me-2"
        >
          {{ $t('nivel') }}
          <v-icon size="18" v-if="sortField === 'level'">
            {{ sortDirection === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
          </v-icon>
        </v-btn>

        <v-btn
          @click="toggleSort('stats')"
          :variant="sortField === 'stats' ? 'tonal' : 'outlined'"
          color="primary"
          class="me-2"
        >
          {{ $t('stats') }}
          <v-icon size="18" v-if="sortField === 'stats'">
            {{ sortDirection === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
          </v-icon>
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn color="warning" variant="outlined" @click="showPopup">
          {{ $t('crear') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        v-for="room in filteredRooms"
        :key="room.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card outlined class="pa-3 d-flex flex-row align-start">
          <v-avatar
            size="64"
            class="me-4"
            color="grey-lighten-3"
            style="border: 2px solid black"
          >
            <v-icon size="36">mdi-account</v-icon>
          </v-avatar>

          <div class="flex-grow-1">
            <div class="text-subtitle-1 font-weight-bold mb-2">
              {{ $t('room') }}: {{ room.name }}
            </div>

            <div class="text-body-2 mb-2">
              <strong>{{ $t('Requerimientos') }}:</strong><br />
              {{ $t('Stats Minimas') }}: {{ room.minstats }}
            </div>

            <div class="text-body-2 mb-2">
              LVL: {{ room.minlevel }}
            </div>

            <v-btn
              v-if="loggedUser?.role === 'userStaff'"
              color="primary"
              variant="tonal"
              size="small"
              @click="openPopup(room)"
            >
              {{ $t('editarSala') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Popups -->
    <CreateRoomPopup :isVisible="isPopupVisible" @close="closePopup" @create="handleCreateRoom" />
    <EditRoomPopup
      v-if="selectedRoom"
      :isVisible="showRoomPopup"
      :room="selectedRoom"
      @close="closeRoomPopup"
      @edit="(room) => console.log('Editando', room)"
    />
  </v-container>
</template>

<style scoped>
.editar-sala {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.
}

.salas {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 500px;
}

.salas-container {
    background: white;
    border: 10px solid #0D6EFD;
    border-radius: 10px;
    padding: 1rem;
    width: 85%;
    /* Aumentamos de 60% a 85% */
    height: 700px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: black;
    box-sizing: border-box;
    height: 92%;
    overflow-y: auto;
}

.salas-header {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: space-around;
    align-items: center;
    margin-top: 1rem;
}

.search-box {
    display: flex;
    border: 2px solid #0D6EFD;
    border-radius: 5px;
    overflow: hidden;
    width: 60%;
    background-color: #D9D9D9;
}

.search-box input {
    border: none;
    padding: 0.5rem;
    outline: none;
    background-color: #D9D9D9;
    height: 30px;
    flex: 1;
}

.search-box button {
    background-color: #D9D9D9;
    border: none;
    padding: 0.5rem;
    color: #0D6EFD;
    font-size: 1rem;
    cursor: pointer;
}

.filter-nivel {
    padding: 0.5rem;
    border: 2px solid #0D6EFD;
    border-radius: 5px;
    background-color: #D9D9D9;
    color: #0D6EFD;
    cursor: pointer;
}

.filter-nivel button {
    background-color: #D9D9D9;
    border: none;
    padding: 0.5rem;
    color: #0D6EFD;
    font-size: 1rem;
    cursor: pointer;
}

.filter-nivel button span {
    margin-left: 0.5rem;
    font-size: 1.2rem;
}

.filter-nivel button.active {
    font-weight: bold;
    color: #0d6efd;
}

.crear-sala {
    padding: 0.5rem 1rem;
    background-color: white;
    border: 2px solid #FFC107;
    border-radius: 5px;
    color: #FFC107;
    font-weight: bold;
    cursor: pointer;
    height: 100%;
}

.salas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    width: 100%;
}

.user-card-search {
    display: flex;
    flex-direction: row;
    background-color: white;
    border: 3px solid #0D6EFD;
    border-radius: 16px;
    padding: 1rem;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: black;
    gap: 1rem;
    box-sizing: border-box;
}

.left-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    justify-content: center;
}

.avatar {
    width: 70px;
    height: 70px;
    border: 2px solid black;
    border-radius: 50%;
    background-color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
}

.level-progress p {
    margin: 0;
    font-weight: bold;
    font-size: 0.85rem;
}

.right-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: space-between;
    align-items: flex-start;
}

.card-header {
    font-weight: bold;
    font-size: 1rem;
    color: black;
}

.description p,
.requirements p {
    margin: 0;
    font-size: 0.85rem;
    text-align: left;
}

.requirements p strong {
    display: block;
    margin-bottom: 0.3rem;
}
</style>