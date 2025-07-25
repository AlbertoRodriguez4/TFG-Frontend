<script setup lang="ts">
import { defineProps, defineEmits, watch, reactive, ref } from 'vue'
import type { Item } from '@/components/Models/Item'
import { useItemStore } from '@/stores/itemStore'

const store = useItemStore()

const props = defineProps<{
  item: Item
  visible: boolean
}>()

const emit = defineEmits(['close', 'edit', 'delete'])

const dialogVisible = ref(props.visible)
watch(() => props.visible, val => dialogVisible.value = val)
watch(dialogVisible, val => { if (!val) emit('close') })

const errorMessage = ref('')

const editedItem = reactive<Item>({
  id: 0,
  name: '',
  type: 'Strength',
  bonus: 0,
  price: 0
})

watch(() => props.item, (newItem) => {
  if (newItem) Object.assign(editedItem, { ...newItem })
}, { immediate: true })

function closePopup() {
  dialogVisible.value = false
}

const handleEdit = async () => {
  errorMessage.value = ''

  if (!editedItem.name || editedItem.name.trim().length < 3) {
    errorMessage.value = 'El nombre debe tener al menos 3 caracteres.'
    return
  }

  const validTypes = ['Strength', 'Endurance']
  if (!validTypes.includes(editedItem.type)) {
    errorMessage.value = 'El tipo seleccionado no es válido.'
    return
  }

  if (editedItem.bonus < 0 || editedItem.price < 0) {
    errorMessage.value = 'Bono y precio no pueden ser negativos.'
    return
  }

  try {
    const updatedItem = {
      ...editedItem,
      name: editedItem.name.trim()
    }
    const result = await store.editItem(updatedItem.id, updatedItem)
    if (result != null) {
      alert("Ítem editado correctamente")
      emit('edit')
      closePopup()
    } else {
      errorMessage.value = "Hubo un problema al editar el ítem."
    }
  } catch (error: any) {
    const message = error?.data?.message
    errorMessage.value = message || "Hubo un problema al editar el ítem."
    console.error("Error al editar el ítem:", error)
  }
}

const handleDelete = async () => {
  const result = await store.deleteItem(editedItem.id)
  if (result !== null) {
    alert("Ítem eliminado correctamente")
    emit('delete')
    closePopup()
  } else {
    errorMessage.value = "Hubo un problema al eliminar el ítem."
  }
}
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Editar Ítem</v-card-title>

      <v-card-text>
        <v-alert v-if="errorMessage" type="error" dense class="mb-4">
          {{ errorMessage }}
        </v-alert>

        <v-text-field
          v-model="editedItem.name"
          label="Nombre"
          required
          outlined
          dense
          class="mb-3"
        />

        <v-select
          v-model="editedItem.type"
          :items="['Strength', 'Endurance']"
          label="Tipo"
          required
          outlined
          dense
          class="mb-3"
        />

        <v-text-field
          v-model.number="editedItem.bonus"
          label="Bono"
          type="number"
          min="0"
          required
          outlined
          dense
          class="mb-3"
        />

        <v-text-field
          v-model.number="editedItem.price"
          label="Precio"
          type="number"
          min="0"
          required
          outlined
          dense
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="error" variant="outlined" @click="handleDelete">
          Eliminar
        </v-btn>
        <v-spacer />
        <v-btn color="secondary" variant="outlined" @click="closePopup">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="handleEdit">
          Guardar
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
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}

.popup-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  position: relative;
  font-family: Arial, sans-serif;
  animation: fadeIn 0.3s ease-in-out;
}

.popup-content h2 {
  text-align: center;
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-details label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #444;
}

.item-details input,
.item-details select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 4px;
  transition: border-color 0.2s ease;
}

.item-details input:focus,
.item-details select:focus {
  border-color: #4a90e2;
  outline: none;
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.buttons button {
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.buttons button:first-child {
  background-color: #4caf50;
  color: white;
}

.buttons button:first-child:hover {
  background-color: #43a047;
}

.delete-btn {
  background-color: #e53935;
  color: white;
}

.delete-btn:hover {
  background-color: #c62828;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #000;
}

@keyframes fadeIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>