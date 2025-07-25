<script setup lang="ts">
import { useUserStore } from "@/stores/userStore"
import { useRoomStore } from "@/stores/RoomStore"
import { ref, defineProps, watch } from "vue"

const props = defineProps({
  isVisible: Boolean,
})
const emit = defineEmits(['close'])

const dialogVisible = ref(props.isVisible)

// 🔄 Sincroniza visibilidad con la prop
watch(() => props.isVisible, (val) => {
  dialogVisible.value = val
})

// 🔄 Notifica al padre si el popup se cierra desde dentro
watch(dialogVisible, (val) => {
  if (!val) emit('close')
})

const store = useUserStore()
const roomStore = useRoomStore()
const loggedUser = ref(store.loggedUser)

const roomName = ref('')
const minLevel = ref<number | null>(1)
const minStats = ref<number | null>(10)
const minConsistency = ref<number | null>(0)
const error = ref<string>('')

function closePopup() {
  dialogVisible.value = false // Esto activa el `watch` que emite 'close'
  resetForm()
}

function resetForm() {
  roomName.value = ''
  minLevel.value = 1
  minStats.value = 10
  minConsistency.value = 0
  error.value = ''
}

function validateInputs(): boolean {
  if (!roomName.value.trim()) {
    error.value = "El nombre de la sala es obligatorio."
    return false
  }
  if (minLevel.value === null || isNaN(minLevel.value) || minLevel.value < 1) {
    error.value = "El nivel mínimo debe ser un número mayor o igual a 1."
    return false
  }
  if (minStats.value === null || isNaN(minStats.value) || minStats.value < 0) {
    error.value = "Las estadísticas mínimas deben ser un número válido."
    return false
  }
  return true
}

async function createRoom() {
  error.value = ''

  if (!validateInputs()) return

  if (!loggedUser.value?.id) {
    error.value = "Usuario no logueado."
    console.error(error.value)
    return
  }

  const newRoom = {
    name: roomName.value.trim(),
    minlevel: minLevel.value as number,
    minstats: minStats.value as number,
    minconsistency: minConsistency.value as number,
  }

  try {
    await roomStore.createRoom(newRoom, loggedUser.value.id)
    alert("Sala creada correctamente")
    closePopup()
  } catch (e) {
    error.value = "Error al crear la sala."
    console.error(e)
  }
}
</script>

<template>
<v-dialog v-model="dialogVisible" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h6">
        {{ $t('crear') }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="createRoom" ref="formRef">
          <v-alert v-if="error" type="error" dense class="mb-4">
            {{ error }}
          </v-alert>

          <v-text-field
            v-model="roomName"
            :label="$t('nombre de la sala')"
            :placeholder="$t('insertar nombre de la sala')"
            required
            outlined
            dense
            class="mb-3"
          />

          <v-text-field
            v-model.number="minLevel"
            :label="$t('nivel minimo')"
            type="number"
            min="1"
            required
            outlined
            dense
            class="mb-3"
          />

          <v-text-field
            v-model.number="minStats"
            :label="$t('Stats Minimas')"
            type="number"
            min="0"
            required
            outlined
            dense
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="createRoom">
          {{ $t('creacion') }}
        </v-btn>
        <v-btn color="secondary" @click="closePopup" variant="outlined">
          {{ $t('cancelar') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.popup-overlay {
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

.error-message {
  color: red;
  margin-bottom: 10px;
}

.popup {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input {
  width: 80%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #333;
}

.cancel-btn:hover {
  background-color: #e2e6ea;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>