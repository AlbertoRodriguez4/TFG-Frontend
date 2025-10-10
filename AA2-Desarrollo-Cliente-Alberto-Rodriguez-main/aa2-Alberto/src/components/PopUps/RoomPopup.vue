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
  dialogVisible.value = false
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
  <v-dialog 
    v-model="dialogVisible" 
    max-width="600" 
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="create-room-card">
      <!-- Header con gradiente -->
      <div class="card-header">
        <div class="header-icon">
          <v-icon size="40" color="#00ff88">mdi-plus-circle</v-icon>
        </div>
        <h2 class="card-title">{{ $t('crear') }}</h2>
        <p class="card-subtitle">Configura tu nueva sala de entrenamiento</p>
        
        <v-btn
          icon
          class="close-btn"
          @click="closePopup"
          size="small"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="card-content">
        <v-form @submit.prevent="createRoom" ref="formRef">
          <!-- Error Alert -->
          <v-alert 
            v-if="error" 
            type="error" 
            class="error-alert mb-6"
            closable
            @click:close="error = ''"
          >
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-alert-circle</v-icon>
              {{ error }}
            </div>
          </v-alert>

          <!-- Room Name -->
          <div class="form-field">
            <label class="field-label">
              <v-icon size="20" class="mr-2">mdi-door-open</v-icon>
              {{ $t('nombre de la sala') }}
            </label>
            <v-text-field
              v-model="roomName"
              :placeholder="$t('insertar nombre de la sala')"
              required
              variant="outlined"
              density="comfortable"
              class="custom-field"
              bg-color="rgba(255, 255, 255, 0.05)"
            >
              <template v-slot:prepend-inner>
                <v-icon color="#00ff88">mdi-format-text</v-icon>
              </template>
            </v-text-field>
          </div>

          <!-- Requirements Section -->
          <div class="requirements-section">
            <div class="section-header">
              <v-icon color="#ffcc00" class="mr-2">mdi-shield-lock</v-icon>
              <span class="section-title">Requisitos de Acceso</span>
            </div>

            <div class="requirements-grid">
              <!-- Min Level -->
              <div class="form-field">
                <label class="field-label">
                  <v-icon size="18" class="mr-1">mdi-chevron-triple-up</v-icon>
                  {{ $t('nivel minimo') }}
                </label>
                <v-text-field
                  v-model.number="minLevel"
                  type="number"
                  min="1"
                  required
                  variant="outlined"
                  density="comfortable"
                  class="custom-field"
                  bg-color="rgba(255, 255, 255, 0.05)"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="#00d9ff">mdi-numeric</v-icon>
                  </template>
                </v-text-field>
              </div>

              <!-- Min Stats -->
              <div class="form-field">
                <label class="field-label">
                  <v-icon size="18" class="mr-1">mdi-chart-line</v-icon>
                  {{ $t('Stats Minimas') }}
                </label>
                <v-text-field
                  v-model.number="minStats"
                  type="number"
                  min="0"
                  required
                  variant="outlined"
                  density="comfortable"
                  class="custom-field"
                  bg-color="rgba(255, 255, 255, 0.05)"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="#ff6b9d">mdi-numeric</v-icon>
                  </template>
                </v-text-field>
              </div>

              <!-- Min Consistency -->
              <div class="form-field full-width">
                <label class="field-label">
                  <v-icon size="18" class="mr-1">mdi-calendar-check</v-icon>
                  Consistencia Mínima
                </label>
                <v-text-field
                  v-model.number="minConsistency"
                  type="number"
                  min="0"
                  variant="outlined"
                  density="comfortable"
                  class="custom-field"
                  bg-color="rgba(255, 255, 255, 0.05)"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="#ffcc00">mdi-numeric</v-icon>
                  </template>
                </v-text-field>
              </div>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <!-- Action Buttons -->
      <v-card-actions class="card-actions">
        <v-btn
          color="secondary"
          @click="closePopup"
          variant="outlined"
          size="large"
          class="cancel-button"
        >
          <v-icon class="mr-2">mdi-close-circle</v-icon>
          {{ $t('cancelar') }}
        </v-btn>
        
        <v-btn
          @click="createRoom"
          size="large"
          class="create-button"
        >
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          {{ $t('creacion') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.create-room-card {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%) !important;
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

/* Header */
.card-header {
  position: relative;
  padding: 2.5rem 2rem 2rem;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.header-icon {
  display: inline-flex;
  padding: 1rem;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 2px solid rgba(0, 255, 136, 0.3);
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(0, 255, 136, 0);
  }
}

.card-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
  font-weight: 300;
}

.close-btn {
  position: absolute !important;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 107, 157, 0.2) !important;
  border-color: rgba(255, 107, 157, 0.5);
  transform: rotate(90deg);
}

/* Content */
.card-content {
  padding: 2rem !important;
}

/* Error Alert */
.error-alert {
  border-left: 4px solid #ff6b9d !important;
  background: rgba(255, 107, 157, 0.1) !important;
  border-radius: 12px !important;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* Form Fields */
.form-field {
  margin-bottom: 1.5rem;
}

.field-label {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.custom-field :deep(.v-field) {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.custom-field :deep(.v-field:hover) {
  border-color: rgba(0, 255, 136, 0.4);
  background: rgba(255, 255, 255, 0.08) !important;
}

.custom-field :deep(.v-field--focused) {
  border-color: #00ff88;
  box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
  background: rgba(255, 255, 255, 0.08) !important;
}

.custom-field :deep(input) {
  color: #fff;
  font-weight: 500;
}

.custom-field :deep(.v-field__outline) {
  display: none;
}

/* Requirements Section */
.requirements-section {
  background: rgba(255, 204, 0, 0.05);
  border: 1px solid rgba(255, 204, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #ffcc00;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.requirements-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.requirements-grid .full-width {
  grid-column: 1 / -1;
}

/* Action Buttons */
.card-actions {
  padding: 1.5rem 2rem !important;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-button {
  flex: 1;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  border-color: rgba(255, 107, 157, 0.5) !important;
  background: rgba(255, 107, 157, 0.1) !important;
  color: #ff6b9d !important;
}

.create-button {
  flex: 1;
  background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%) !important;
  color: #000 !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.4);
  transition: all 0.3s ease;
}

.create-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 255, 136, 0.6);
}

.create-button:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 600px) {
  .card-header {
    padding: 2rem 1.5rem 1.5rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-content {
    padding: 1.5rem !important;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
    padding: 1rem 1.5rem !important;
  }

  .cancel-button,
  .create-button {
    width: 100%;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.create-room-card {
  animation: fadeIn 0.3s ease-out;
}
</style>