<template>
  <v-app>
    <v-main class="workout-hub">
      <!-- Hero Header Section -->
      <HeroSection 
        :user-level="userLevel" 
        :user-xp="userXP" 
        :xp-to-next-level="xpToNextLevel" 
        :coins="coins"
        :completed-routines="completedRoutines" 
        :streak="streak" 
        :xp-progress="xpProgress"
        @create-routine="openCreateModal" 
      />

      <!-- Calendar Section -->
      <CalendarSection 
        :current-date="currentDate" 
        :month-name="monthName" 
        :days-of-week="daysOfWeek"
        :days-in-month="daysInMonth" 
        :starting-day-of-week="startingDayOfWeek" 
        :routines="routinesMap"
        :completed-routines="completedRoutines" 
        :user-xp="userXP" 
        :xp-progress="xpProgress" 
        :streak="streak"
        @previous-month="previousMonth" 
        @next-month="nextMonth" 
        @day-click="handleDayClick"
        @complete-routine="completeRoutine" 
      />

      <!-- Create Routine Dialog -->
      <CreateRoutineDialog 
        v-model="showCreateModal" 
        :selected-day="selectedDay" 
        :month-name="monthName"
        :user-id="userStore.loggedUser?.id || 0"
        @create="handleCreateRoutine"
        @close="closeModal" 
      />

      <!-- Level Up Dialog -->
      <LevelUpDialog v-model="showLevelUp" :user-level="userLevel" />

      <!-- Success Snackbar -->
      <SuccessSnackbar v-model="showCompleted" />

      <!-- Snackbar para notificaciones -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
        top
      >
        {{ snackbar.message }}
        <template v-slot:actions>
          <v-btn
            text
            @click="snackbar.show = false"
          >
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
import LevelUpDialog from '../components/Calendar/LevelUpDialog.vue';
import SuccessSnackbar from '../components/Calendar/SuccessSnackbar.vue';

// Types
interface RoutineData {
  name: string;
  exercises: string;
  completed: boolean;
  xp: number;
}

interface RoutinesMap {
  [key: string]: RoutineData;
}

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
const showLevelUp = ref(false);
const showCompleted = ref(false);

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

/**
 * Nombre del mes actual
 */
const monthName = computed(() => {
  return monthNames[currentDate.value.getMonth()];
});

/**
 * Número de días en el mes actual
 */
const daysInMonth = computed(() => {
  return new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    0
  ).getDate();
});

/**
 * Día de la semana del primer día del mes (0 = Domingo, 6 = Sábado)
 */
const startingDayOfWeek = computed(() => {
  return new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    1
  ).getDay();
});

/**
 * Porcentaje de progreso hacia el siguiente nivel
 */
const xpProgress = computed(() => {
  return (userXP.value / xpToNextLevel.value) * 100;
});

/**
 * Número total de rutinas completadas
 */
const completedRoutines = computed(() => {
  return routineStore.routines.filter(r => r.iscompleted).length;
});

/**
 * Convertir rutinas del store a formato RoutinesMap
 */
const routinesMap = computed(() => {
  const map: RoutinesMap = {};
  routineStore.routines.forEach(routine => {
    const date = new Date(routine.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    map[key] = {
      name: routine.name,
      exercises: routine.description,
      completed: routine.iscompleted,
      xp: routine.reward
    };
  });
  return map;
});

// Methods

/**
 * Navega al mes anterior
 */
const previousMonth = (): void => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

/**
 * Navega al mes siguiente
 */
const nextMonth = (): void => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

/**
 * Genera la clave única para una rutina basada en la fecha
 * @param day - Día del mes
 * @returns Clave en formato 'YYYY-M-D'
 */
const getRoutineKey = (day: number): string => {
  return `${currentDate.value.getFullYear()}-${currentDate.value.getMonth() + 1}-${day}`;
};

/**
 * Maneja el click en un día del calendario
 * Solo abre el modal si el día no tiene rutina asignada
 * @param day - Día clickeado
 */
const handleDayClick = (day: number): void => {
  const routine = routinesMap.value[getRoutineKey(day)];
  if (!routine) {
    selectedDay.value = day;
    showCreateModal.value = true;
  }
};

/**
 * Abre el modal de crear rutina con el día actual seleccionado
 */
const openCreateModal = (): void => {
  selectedDay.value = new Date().getDate();
  showCreateModal.value = true;
};

/**
 * Crea una nueva rutina para el día seleccionado
 * Llama al store de Pinia para persistir en la API
 */
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
 * Completa una rutina y otorga recompensas al usuario
 * @param day - Día de la rutina a completar
 */
const completeRoutine = async (day: number): Promise<void> => {
  const key = getRoutineKey(day);
  const routine = routinesMap.value[key];

  if (routine && !routine.completed) {
    // Marca la rutina como completada
    routine.completed = true;

    // Calcula nuevo XP
    const newXP = userXP.value + routine.xp;

    // Otorga recompensas
    coins.value += 50; // +50 monedas por rutina
    streak.value += 1; // +1 día de racha

    // Verifica si sube de nivel
    if (newXP >= xpToNextLevel.value) {
      userLevel.value += 1;
      userXP.value = newXP - xpToNextLevel.value; // XP sobrante para el nuevo nivel
      xpToNextLevel.value = calculateNextLevelXP(userLevel.value); // Recalcula XP necesario
      showLevelUp.value = true;
    } else {
      userXP.value = newXP;
    }

    // Muestra notificación de éxito
    showCompleted.value = true;

    // TODO: Implementar updateRoutine en el store para marcar como completada
    // await routineStore.updateRoutine(routineId, { iscompleted: true });
  }
};

/**
 * Calcula el XP necesario para alcanzar el siguiente nivel
 * Fórmula progresiva: nivel * 300 + 1000
 * @param level - Nivel actual del usuario
 * @returns XP necesario para el siguiente nivel
 */
const calculateNextLevelXP = (level: number): number => {
  return level * 300 + 1000;
};

/**
 * Cierra el modal de crear rutina y limpia los campos
 */
const closeModal = (): void => {
  showCreateModal.value = false;
  selectedDay.value = null;
};

/**
 * Carga los datos iniciales del usuario
 */
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