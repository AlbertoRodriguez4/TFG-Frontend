<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { computed, reactive, ref, watch } from 'vue';
import type { User } from '../Models/User';

const store = useUserStore();
const loggedUser = computed(() => store.loggedUser);

const props = defineProps<{
  user: User;
  visible: boolean;
}>();

const emit = defineEmits(['close', 'edit', 'delete']);

const errorMessage = ref('');

const editedUser = reactive<User>({
  id: 0,
  name: '',
  passwordhash: '',
  email: '',
  level: 0,
  strength: 0,
  endurance: 0,
  consistencystreak: 0,
  gold: 0,
  role: ''
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    Object.assign(editedUser, { ...newUser });
  }
}, { immediate: true });

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleEdit = async () => {
  errorMessage.value = '';

  if (!editedUser.name || editedUser.name.trim().length < 3) {
    errorMessage.value = 'El nombre debe tener al menos 3 caracteres.';
    return;
  }

  if (!editedUser.email || !emailRegex.test(editedUser.email.trim())) {
    errorMessage.value = 'Introduce un correo electrónico válido.';
    return;
  }

  if (
    editedUser.level < 0 ||
    editedUser.strength < 0 ||
    editedUser.endurance < 0 ||
    editedUser.gold < 0
  ) {
    errorMessage.value = 'Los valores numéricos no pueden ser negativos.';
    return;
  }

  try {
    const updatedUser = {
      id: props.user.id,
      name: editedUser.name.trim(),
      passwordhash: editedUser.passwordhash,
      email: editedUser.email.trim(),
      level: editedUser.level,
      strength: editedUser.strength,
      endurance: editedUser.endurance,
      gold: editedUser.gold,
      consistencystreak: editedUser.consistencystreak,
      role: loggedUser.value?.role || 'userNormal'
    };

    const result = await store.editUser(updatedUser.id, updatedUser);

    if (result != null) {
      alert("Usuario editado correctamente");
      emit('close');
    } else {
      errorMessage.value = "Hubo un problema al editar el usuario.";
    }
  } catch (error: any) {
    const message = error?.data?.message;
    errorMessage.value = message || "Error inesperado al editar el usuario.";
    console.error("Error al editar el usuario:", error);
  }
};

const handleDelete = async () => {
  const userId = props.user.id;

  const result = await store.DeleteUser(userId);

  if (result != null) {
    alert("Usuario eliminado correctamente");
    emit('close');
  } else {
    errorMessage.value = "Hubo un problema al eliminar el usuario.";
  }
};
const internalVisible = ref(props.visible);

watch(() => props.visible, (val) => {
  internalVisible.value = val;
});
watch(internalVisible, (val) => {
  if (!val) emit('close');
});
</script>

<template>
  <v-dialog v-model="internalVisible" max-width="600">
    <v-card>
      <v-card-title class="text-h6">
        Editar Usuario
      </v-card-title>
      <v-card-text>
        <v-alert v-if="errorMessage" type="error" class="mb-4">
          {{ errorMessage }}
        </v-alert>

        <v-text-field v-model="editedUser.name" label="Nombre" />
        <v-text-field v-model="editedUser.email" label="Correo" />
        <v-text-field v-model="editedUser.passwordhash" label="Contraseña" type="password" />

        <v-text-field v-model.number="editedUser.level" label="Nivel" type="number" />
        <v-text-field v-model.number="editedUser.strength" label="Fuerza" type="number" />
        <v-text-field v-model.number="editedUser.endurance" label="Resistencia" type="number" />
        <v-text-field v-model.number="editedUser.gold" label="Oro" type="number" />
        <v-text-field v-model.number="editedUser.consistencystreak" label="Racha de consistencia" type="number" />

      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="emit('close')">Cancelar</v-btn>
        <v-btn color="red" @click="handleDelete">Eliminar</v-btn>
        <v-btn color="green" @click="handleEdit">Guardar</v-btn>
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
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}
.popup-content {
    background: #1e1e1e;
    color: #fff;
    padding: 2rem;
    border-radius: 1rem;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    position: relative;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    color: #fff;
    font-size: 1.5rem;
    border: none;
    cursor: pointer;
}

h2 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    text-align: center;
}

.form label {
    display: block;
    margin-bottom: 1rem;
}

input,
select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.3rem;
    border-radius: 0.5rem;
    border: none;
    background-color: #2c2c2c;
    color: white;
}

.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
}

.save-btn {
    background-color: #4caf50;
    color: white;
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
}

.delete-btn {
    background-color: #e53935;
    color: white;
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
}
</style>