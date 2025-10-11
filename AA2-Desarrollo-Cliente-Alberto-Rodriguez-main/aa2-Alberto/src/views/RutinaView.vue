<template>
  <v-app>
    <v-main class="workout-hub">
      <!-- Hero Header Section -->
      <HeroSection :user-level="userLevel" :user-xp="userXP" :xp-to-next-level="xpToNextLevel" :coins="coins"
        :completed-routines="completedRoutines" :streak="streak" :xp-progress="xpProgress"
        @create-routine="openCreateModal" />

      <!-- Calendar Section -->
      <CalendarSection :current-date="currentDate" :month-name="monthName" :days-of-week="daysOfWeek"
        :days-in-month="daysInMonth" :starting-day-of-week="startingDayOfWeek" :routines="routines"
        :completed-routines="completedRoutines" :user-xp="userXP" :xp-progress="xpProgress" :streak="streak"
        @previous-month="previousMonth" @next-month="nextMonth" @day-click="handleDayClick"
        @complete-routine="completeRoutine" />

      <!-- Create Routine Dialog -->
      <CreateRoutineDialog v-model="showCreateModal" :selected-day="selectedDay" :month-name="monthName"
        :routine-name.sync="routineName" :routine-exercises.sync="routineExercises" @create="createRoutine"
        @close="closeModal" />

      <!-- Level Up Dialog -->
      <LevelUpDialog v-model="showLevelUp" :user-level="userLevel" />

      <!-- Success Snackbar -->
      <SuccessSnackbar v-model="showCompleted" />
    </v-main>
  </v-app>
</template>

<script>
import HeroSection from '../components/Calendar/HeroSection.vue';
import CalendarSection from '../components/Calendar/CalendarSection.vue';
import CreateRoutineDialog from '../components/Calendar/CreateRoutineDialog.vue';
import LevelUpDialog from '../components/Calendar/LevelUpDialog.vue';
import SuccessSnackbar from '../components/Calendar/SuccessSnackbar.vue';



export default {
  name: 'RutinaView',

  components: {
    HeroSection,
    CalendarSection,
    CreateRoutineDialog,
    LevelUpDialog,
    SuccessSnackbar
  },

  data() {
    return {
      // Estado del usuario
      userXP: 3450,
      userLevel: 12,
      coins: 2850,
      streak: 7,
      xpToNextLevel: 4000,

      // Estado del calendario
      currentDate: new Date(2025, 9, 11), // Octubre 2025
      selectedDay: null,

      // Estado de modales y notificaciones
      showCreateModal: false,
      showLevelUp: false,
      showCompleted: false,

      // Datos del formulario
      routineName: '',
      routineExercises: '',

      // Configuración estática
      daysOfWeek: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],

      routines: {
        '2025-10-8': { name: 'Día de Pierna', exercises: 'Sentadillas, Prensa, Zancadas', completed: true, xp: 150 },
        '2025-10-9': { name: 'Pecho y Tríceps', exercises: 'Press banca, Fondos, Aperturas', completed: true, xp: 150 },
        '2025-10-10': { name: 'Espalda y Bíceps', exercises: 'Dominadas, Remo, Curl', completed: true, xp: 150 },
        '2025-10-11': { name: 'Cardio HIIT', exercises: 'Sprints, Burpees, Mountain climbers', completed: false, xp: 100 },
        '2025-10-15': { name: 'Full Body', exercises: 'Circuito completo', completed: false, xp: 200 },
      }
    };
  },

  computed: {
    /**
     * Nombre del mes actual
     */
    monthName() {
      return this.monthNames[this.currentDate.getMonth()];
    },

    /**
     * Número de días en el mes actual
     */
    daysInMonth() {
      return new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        0
      ).getDate();
    },

    /**
     * Día de la semana del primer día del mes (0 = Domingo, 6 = Sábado)
     */
    startingDayOfWeek() {
      return new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      ).getDay();
    },

    /**
     * Porcentaje de progreso hacia el siguiente nivel
     */
    xpProgress() {
      return (this.userXP / this.xpToNextLevel) * 100;
    },

    /**
     * Número total de rutinas completadas
     */
    completedRoutines() {
      return Object.values(this.routines).filter(r => r.completed).length;
    }
  },

  methods: {
    /**
     * Navega al mes anterior
     */
    previousMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    },

    /**
     * Navega al mes siguiente
     */
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    },

    /**
     * Genera la clave única para una rutina basada en la fecha
     * @param {Number} day - Día del mes
     * @returns {String} Clave en formato 'YYYY-M-D'
     */
    getRoutineKey(day) {
      return `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${day}`;
    },

    /**
     * Maneja el click en un día del calendario
     * Solo abre el modal si el día no tiene rutina asignada
     * @param {Number} day - Día clickeado
     */
    handleDayClick(day) {
      const routine = this.routines[this.getRoutineKey(day)];
      if (!routine) {
        this.selectedDay = day;
        this.showCreateModal = true;
      }
    },

    /**
     * Abre el modal de crear rutina con el día actual seleccionado
     */
    openCreateModal() {
      this.selectedDay = new Date().getDate();
      this.showCreateModal = true;
    },

    /**
     * Crea una nueva rutina para el día seleccionado
     * En producción, esto haría una llamada a la API
     */
    createRoutine() {
      if (this.routineName && this.routineExercises && this.selectedDay) {
        const key = this.getRoutineKey(this.selectedDay);

        // Añade la rutina al objeto de rutinas
        this.$set(this.routines, key, {
          name: this.routineName,
          exercises: this.routineExercises,
          completed: false,
          xp: 150 // XP base por rutina
        });

        // TODO: En producción, llamar a la API
        // await this.$store.dispatch('routines/createRoutine', { ... })

        this.closeModal();
      }
    },

    /**
     * Completa una rutina y otorga recompensas al usuario
     * @param {Number} day - Día de la rutina a completar
     */
    completeRoutine(day) {
      const key = this.getRoutineKey(day);
      const routine = this.routines[key];

      if (routine && !routine.completed) {
        // Marca la rutina como completada
        routine.completed = true;

        // Calcula nuevo XP
        const newXP = this.userXP + routine.xp;

        // Otorga recompensas
        this.coins += 50; // +50 monedas por rutina
        this.streak += 1; // +1 día de racha

        // Verifica si sube de nivel
        if (newXP >= this.xpToNextLevel) {
          this.userLevel += 1;
          this.userXP = newXP - this.xpToNextLevel; // XP sobrante para el nuevo nivel
          this.xpToNextLevel = this.calculateNextLevelXP(this.userLevel); // Recalcula XP necesario
          this.showLevelUp = true;
        } else {
          this.userXP = newXP;
        }

        // Muestra notificación de éxito
        this.showCompleted = true;

        // TODO: En producción, sincronizar con la API
        // await this.$store.dispatch('routines/completeRoutine', { day, key })
        // await this.$store.dispatch('user/updateProgress', { xp, coins, streak })
      }
    },

    /**
     * Calcula el XP necesario para alcanzar el siguiente nivel
     * Fórmula progresiva: nivel * 300 + 1000
     * @param {Number} level - Nivel actual del usuario
     * @returns {Number} XP necesario para el siguiente nivel
     */
    calculateNextLevelXP(level) {
      return level * 300 + 1000;
    },

    /**
     * Cierra el modal de crear rutina y limpia los campos
     */
    closeModal() {
      this.showCreateModal = false;
      this.selectedDay = null;
      this.routineName = '';
      this.routineExercises = '';
    }
  },

  /**
   * Lifecycle hook: Se ejecuta cuando el componente se monta
   * Aquí puedes cargar datos iniciales desde la API
   */
  mounted() {
    // TODO: Cargar datos del usuario y rutinas desde la API
    // await this.$store.dispatch('user/fetchProfile')
    // await this.$store.dispatch('routines/fetchRoutines', { month: this.currentDate })

    console.log('RutinaView montada correctamente ✅');
  },

  /**
   * Lifecycle hook: Se ejecuta antes de destruir el componente
   * Limpia listeners o guarda estado si es necesario
   */
  beforeDestroy() {
    // TODO: Guardar estado o limpiar recursos si es necesario
  }
};
</script>

<style scoped>
.workout-hub {
  background: #f8f9fa;
  min-height: 100vh;
  width: 100%;
}

/* Asegura que el v-app ocupe toda la altura */
.v-application {
  min-height: 100vh;
}
</style>