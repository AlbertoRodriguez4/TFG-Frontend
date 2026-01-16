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

const dialogVisible = ref(props.isVisible)

watch(() => props.isVisible, (val) => {
  dialogVisible.value = val
})

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
      emit('edit')
    } else {
      alert("Hubo un problema al editar la sala.")
    }
  } catch (error) {
    console.error('Error editing room:', error)
  }
}
</script>

<template>
  <Transition name="popup">
    <div v-if="dialogVisible" class="popup-overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
        <!-- Header con icono -->
        <div class="popup-header">
          <div class="header-icon-wrapper">
            <div class="header-icon">✏️</div>
            <div class="icon-glow"></div>
          </div>
          <h2 class="popup-title">Editar Sala</h2>
          <button @click="closePopup" class="close-btn" type="button">
            <span>✕</span>
          </button>
        </div>

        <!-- Body del formulario -->
        <div class="popup-body">
          <form @submit.prevent="handleEdit">
            <!-- Campo Nombre -->
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🏷️</span>
                <span>Nombre de la sala</span>
              </label>
              <input
                v-model="editedRoom.name"
                type="text"
                class="form-input"
                placeholder="Ej: Gimnasio Elite"
                required
              />
            </div>

            <!-- Campo Nivel Mínimo -->
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">📊</span>
                <span>Nivel mínimo</span>
              </label>
              <input
                v-model.number="editedRoom.minlevel"
                type="number"
                min="1"
                class="form-input"
                placeholder="Ej: 10"
                required
              />
            </div>

            <!-- Campo Stats Mínimas -->
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">💪</span>
                <span>Stats mínimas</span>
              </label>
              <input
                v-model.number="editedRoom.minstats"
                type="number"
                min="0"
                class="form-input"
                placeholder="Ej: 50"
                required
              />
            </div>

            <!-- Campo Consistencia Mínima -->
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🎯</span>
                <span>Consistencia mínima (%)</span>
              </label>
              <input
                v-model.number="editedRoom.minconsistency"
                type="number"
                min="0"
                max="100"
                class="form-input"
                placeholder="Ej: 80"
                required
              />
            </div>
          </form>
        </div>

        <!-- Footer con botones -->
        <div class="popup-footer">
          <button @click="closePopup" class="btn btn-cancel" type="button">
            <span class="btn-icon">✕</span>
            <span>Cancelar</span>
          </button>
          <button @click="handleEdit" class="btn btn-save" type="button">
            <span class="btn-icon">💾</span>
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Overlay */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

/* Contenedor principal */
.popup-content {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

/* Header */
.popup-header {
  position: relative;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 2rem;
  z-index: 2;
  position: relative;
}

.icon-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.popup-title {
  flex: 1;
  font-size: 1.75rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  transform: rotate(90deg);
}

/* Body */
.popup-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.75rem;
}

.label-icon {
  font-size: 1.2rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  outline: none;
}

.form-input::placeholder {
  color: #64748b;
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-input:hover:not(:focus) {
  border-color: rgba(255, 255, 255, 0.2);
}

/* Remove spinner for number inputs */
.form-input[type="number"]::-webkit-inner-spin-button,
.form-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-input[type="number"] {
  -moz-appearance: textfield;
}

/* Footer */
.popup-footer {
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.btn-save {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: 2px solid transparent;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
}

.btn-save:active {
  transform: translateY(0);
}

/* Transitions */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-from .popup-content,
.popup-leave-to .popup-content {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 640px) {
  .popup-content {
    border-radius: 20px;
  }

  .popup-header {
    padding: 1.5rem;
  }

  .popup-title {
    font-size: 1.5rem;
  }

  .popup-body {
    padding: 1.5rem;
  }

  .popup-footer {
    grid-template-columns: 1fr;
    padding: 1.25rem 1.5rem;
  }

  .btn-cancel {
    order: 2;
  }

  .btn-save {
    order: 1;
  }
}
</style>