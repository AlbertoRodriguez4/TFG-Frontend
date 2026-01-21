<template>
  <v-app>
    <v-main class="workout-hub">
      <!-- Hero Header Section -->
      <HeroSection :user-level="userLevel" :user-x-p="userXP" :xp-to-next-level="xpToNextLevel" :coins="coins"
        :completed-routines="completedRoutines" :streak="streak" :xp-progress="xpProgress"
        @create-routine="openCreateModal" />

      <!-- Calendar Section -->
      <CalendarSection :current-date="currentDate" :month-name="monthName" :days-of-week="daysOfWeek"
        :days-in-month="daysInMonth" :starting-day-of-week="startingDayOfWeek"
        :routines="routineStore.routines.map(r => ({ ...r, createdat: r.createdat ?? r.createdat }))"
        :completed-routines="completedRoutines" :user-x-p="userXP" :xp-progress="xpProgress" :streak="streak"
        @previous-month="previousMonth" @next-month="nextMonth" @day-click="handleDayClick"
        @complete-routine="completeRoutine" />

      <!-- Create Routine Dialog -->
      <CreateRoutineDialog v-model="showCreateModal" :selected-day="selectedDay" :month-name="monthName"
        :user-id="userStore.loggedUser?.id || 0" @create="handleCreateRoutine" @close="closeModal" />

      <!-- Routine Detail Dialog -->
      <RoutineDetailDialog v-model="showDetailModal" :routine="selectedRoutine" @close="closeDetailModal"
        @complete="handleCompleteFromDetail" />

      <!-- Level Up Dialog -->
      <LevelUpDialog v-model="showLevelUp" :user-level="userLevel" />

      <!-- Success Snackbar -->
      <SuccessSnackbar v-model="showCompleted" />

      <!-- Snackbar para notificaciones -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" top>
        {{ snackbar.message }}
        <template v-slot:actions>
          <v-btn text @click="snackbar.show = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue';
import { useRoutineStore } from '@/stores/RoutineStore';
import { useUserStore } from '@/stores/userStore';
import type { Routines } from '@/components/Models/Routines';

import HeroSection from '../components/Calendar/HeroSection.vue';
import CalendarSection from '../components/Calendar/CalendarSection.vue';
import CreateRoutineDialog from '../components/Calendar/CreateRoutineDialog.vue';
import RoutineDetailDialog from '../components/Calendar/RoutineDetailDialog.vue';
import LevelUpDialog from '../components/Calendar/LevelUpDialog.vue';
import SuccessSnackbar from '../components/Calendar/SuccessSnackbar.vue';

// Stores
const routineStore = useRoutineStore();
const userStore = useUserStore();

// Estado del usuario
const userXP = ref(0);
const userLevel = ref(1);
const coins = ref(0);
const streak = ref(0);
const xpToNextLevel = ref(1000);

// Estado del calendario
const currentDate = ref(new Date());
const selectedDay = ref<number | null>(null);

// Estado de modales y notificaciones
const showCreateModal = ref(false);
const showDetailModal = ref(false);
const showLevelUp = ref(false);
const showCompleted = ref(false);

// Estado de la rutina seleccionada
const selectedRoutine = ref<Routines | null>(null);

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
});

// Configuración estática
const daysOfWeek: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const monthNames: string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Computed Properties

const monthName = computed(() => {
  return monthNames[currentDate.value.getMonth()];
});

const daysInMonth = computed(() => {
  return new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    0
  ).getDate();
});

const startingDayOfWeek = computed(() => {
  return new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    1
  ).getDay();
});

const xpProgress = computed(() => {
  return (userXP.value / xpToNextLevel.value) * 100;
});

const completedRoutines = computed(() => {
  return routineStore.routines.filter(r => r.iscompleted).length;
});

// Methods

const previousMonth = (): void => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = (): void => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const getRoutineForDay = (day: number): Routines | null => {
  const targetDate = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day
  );
  targetDate.setHours(0, 0, 0, 0);

  return routineStore.routines.find(routine => {
    const routineDate = new Date(routine.createdat);
    routineDate.setHours(0, 0, 0, 0);
    return routineDate.getTime() === targetDate.getTime();
  }) || null;
};

const handleDayClick = (day: number): void => {
  console.log('🖱️ Click en día:', day);
  const routine = getRoutineForDay(day);
  console.log('📋 Rutina encontrada:', routine);

  if (routine) {
    // Si hay rutina, mostrar el modal de detalle
    selectedRoutine.value = routine;
    showDetailModal.value = true;
    console.log('✅ Abriendo modal de detalle');
  } else {
    // Si no hay rutina, abrir modal de crear
    selectedDay.value = day;
    showCreateModal.value = true;
    console.log('➕ Abriendo modal de crear');
  }
};

const openCreateModal = (): void => {
  selectedDay.value = new Date().getDate();
  showCreateModal.value = true;
};

const handleCreateRoutine = async (routine: Routines): Promise<void> => {
  try {
    console.log('📝 Creando rutina:', routine);

    // Llamar al store para crear la rutina en la API
    await routineStore.createRoutine(routine);

    console.log('✅ Rutina creada exitosamente');

    // Cerrar el modal
    closeModal();

    // Mostrar notificación de éxito
    snackbar.message = '🎉 ¡Rutina creada exitosamente!';
    snackbar.color = 'success';
    snackbar.show = true;

    // Recargar las rutinas del usuario para actualizar el calendario
    if (userStore.loggedUser?.id) {
      await routineStore.getRoutineByUserId(userStore.loggedUser.id);
      console.log('🔄 Rutinas recargadas');
    }

  } catch (error) {
    console.error('❌ Error al crear la rutina:', error);
    snackbar.message = '❌ Error al crear la rutina. Intenta de nuevo.';
    snackbar.color = 'error';
    snackbar.show = true;
  }
};

/**
 * FUNCIÓN PRINCIPAL: Completa una rutina llamando a la API
 * Se ejecuta cuando el usuario confirma en el modal de detalle
 */
const handleCompleteFromDetail = async (routineId: number): Promise<void> => {
  try {
    const routine = routineStore.routines.find(r => r.id === routineId);

    if (!routine) {
      console.error('❌ Rutina no encontrada');
      return;
    }

    if (routine.iscompleted) {
      console.warn('⚠️ La rutina ya está completada');
      snackbar.message = '⚠️ Esta rutina ya está completada';
      snackbar.color = 'warning';
      snackbar.show = true;
      return;
    }

    console.log(`📋 Completando rutina ${routineId}...`);

    // 🎯 AQUÍ SE LLAMA A LA FUNCIÓN DEL STORE
    await routineStore.completeTask(routineId);

    console.log('✅ Rutina marcada como completada en la API');

    // Calcula nuevo XP
    const newXP = userXP.value + routine.reward;

    // Otorga recompensas
    coins.value += 50; // +50 monedas por rutina
    streak.value += 1; // +1 día de racha

    // Verifica si sube de nivel
    if (newXP >= xpToNextLevel.value) {
      userLevel.value += 1;
      userXP.value = newXP - xpToNextLevel.value; // XP sobrante para el nuevo nivel
      xpToNextLevel.value = calculateNextLevelXP(userLevel.value); // Recalcula XP necesario
      showLevelUp.value = true;
      console.log(`🎊 ¡Subiste al nivel ${userLevel.value}!`);
    } else {
      userXP.value = newXP;
    }

    // Cierra el modal de detalle
    closeDetailModal();

    // Muestra notificación de éxito
    showCompleted.value = true;

    // Mensaje en snackbar
    snackbar.message = `✅ ¡Rutina completada! +${routine.reward} XP, +50 monedas`;
    snackbar.color = 'success';
    snackbar.show = true;

    console.log('✅ Rutina completada exitosamente');

    // Opcional: Recargar rutinas para asegurar sincronización
    if (userStore.loggedUser?.id) {
      await routineStore.getRoutineByUserId(userStore.loggedUser.id);
    }

  } catch (error) {
    console.error('❌ Error al completar rutina:', error);
    snackbar.message = '❌ Error al completar la rutina. Intenta de nuevo.';
    snackbar.color = 'error';
    snackbar.show = true;
  }
};

const completeRoutine = async (day: number, routineId: number): Promise<void> => {
  await handleCompleteFromDetail(routineId);
};

const calculateNextLevelXP = (level: number): number => {
  return level * 300 + 1000;
};

const closeModal = (): void => {
  showCreateModal.value = false;
  selectedDay.value = null;
};

const closeDetailModal = (): void => {
  showDetailModal.value = false;
  selectedRoutine.value = null;
};

const loadUserData = async (): Promise<void> => {
  try {
    if (userStore.loggedUser?.id) {
      console.log('🔄 Cargando rutinas del usuario:', userStore.loggedUser.id);

      // Cargar rutinas del usuario
      await routineStore.getRoutineByUserId(userStore.loggedUser.id);

      console.log('✅ Rutinas cargadas:', routineStore.routines.length);

    } else {
      console.warn('⚠️ No hay usuario logueado');
    }
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    snackbar.message = 'Error al cargar los datos';
    snackbar.color = 'error';
    snackbar.show = true;
  }
};

onMounted(() => {
  loadUserData();
  console.log('✅ RutinaView montada correctamente');
});

onBeforeUnmount(() => {
  console.log('👋 RutinaView desmontada');
});
</script>

<style scoped>
.workout-hub {
  background: #f8f9fa;
  min-height: 100vh;
  width: 100%;
}

.v-application {
  min-height: 100vh;
}
</style>