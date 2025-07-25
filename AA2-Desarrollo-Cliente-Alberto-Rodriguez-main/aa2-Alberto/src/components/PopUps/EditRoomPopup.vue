<script setup lang="ts">
import { defineProps, defineEmits, ref, reactive, watch } from 'vue';
import { useRoomStore } from '@/stores/RoomStore';

const store = useRoomStore()

const props = defineProps({
  isVisible: Boolean,
  room: {
    type: Object as () => {
      id: number
      name: string
      minlevel: number
      minstats: number
      minconsistency: number
    },
    required: true
  }
})

const emit = defineEmits(['close', 'edit'])

// 👇 Dialog reactivo y sincronizado con la prop
const dialogVisible = ref(props.isVisible)

// Sincroniza prop externa con estado interno
watch(() => props.isVisible, (val) => {
  dialogVisible.value = val
})

// Cuando el popup se cierra internamente, avisa al padre
watch(dialogVisible, (val) => {
  if (!val) emit('close')
})

function closePopup() {
  dialogVisible.value = false
}

const editedRoom = reactive({
  id: 0,
  name: '',
  minlevel: 0,
  minstats: 0,
  minconsistency: 0
})

// Actualiza datos internos cuando cambian desde el padre
watch(() => props.room, (newRoom) => {
  if (newRoom) {
    editedRoom.id = newRoom.id
    editedRoom.name = newRoom.name
    editedRoom.minlevel = newRoom.minlevel
    editedRoom.minstats = newRoom.minstats
    editedRoom.minconsistency = newRoom.minconsistency
  }
}, { immediate: true })

const handleEdit = async () => {
  try {
    const updatedRoom = {
      id: editedRoom.id,
      name: editedRoom.name,
      minlevel: editedRoom.minlevel,
      minstats: editedRoom.minstats,
      minconsistency: editedRoom.minconsistency
    }

    const response = await store.editRoom(editedRoom.id, updatedRoom)

    if (response !== null) {
      alert("Sala editada correctamente")
      closePopup()
      emit('edit') // Opcional: notifica que se editó correctamente
    } else {
      alert("Hubo un problema al editar la sala.")
    }
  } catch (error) {
    console.error('Error editing room:', error)
  }
}
</script>


<template>
  <v-dialog v-model="dialogVisible" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h6">
        Editar Sala
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleEdit">
          <v-text-field
            v-model="editedRoom.name"
            label="Nombre de la sala"
            required
            outlined
            dense
            class="mb-3"
          />
          <v-text-field
            v-model.number="editedRoom.minlevel"
            label="Nivel mínimo"
            type="number"
            min="1"
            required
            outlined
            dense
            class="mb-3"
          />
          <v-text-field
            v-model.number="editedRoom.minstats"
            label="Stats mínimas"
            type="number"
            min="0"
            required
            outlined
            dense
            class="mb-3"
          />
          <v-text-field
            v-model.number="editedRoom.minconsistency"
            label="Consistencia mínima"
            type="number"
            min="0"
            required
            outlined
            dense
            class="mb-3"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="handleEdit">Guardar</v-btn>
        <v-btn color="secondary" @click="closePopup" variant="outlined">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style scoped>
.edit-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.edit-popup {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

h2 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #333;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
}

input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

input:focus {
    border-color: #007bff;
    outline: none;
}

.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}

.cancel-btn,
.save-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    border: none;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
}

.cancel-btn:hover {
    background-color: #e53935;
}

.save-btn {
    background-color: #4caf50;
    color: white;
}

.save-btn:hover {
    background-color: #388e3c;
}
</style>
