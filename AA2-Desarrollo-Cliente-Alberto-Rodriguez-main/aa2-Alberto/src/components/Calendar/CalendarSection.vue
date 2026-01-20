<template>
  <section class="calendar-section">
    <v-container>
      <!-- Month Navigation -->
      <MonthNavigation :month-name="monthName" :year="currentDate.getFullYear()" @previous="$emit('previous-month')"
        @next="$emit('next-month')" />

      <!-- Calendar Grid -->
      <CalendarGrid :days-of-week="daysOfWeek" :starting-day-of-week="startingDayOfWeek" :days-in-month="daysInMonth"
        :current-date="currentDate" :routines="routines" @day-click="$emit('day-click', $event)"
        @complete-routine="$emit('complete-routine', $event)" />

      <!-- Weekly Summary -->
      <WeeklySummary :completed-routines="completedRoutines" :user-xp="userXP" :streak="streak"
        :xp-progress="xpProgress" />
    </v-container>
  </section>
</template>

<script>
import MonthNavigation from './MonthNavigation.vue';
import CalendarGrid from './CalendarGrid.vue';
import WeeklySummary from './WeeklySummary.vue';

export default {
  name: 'CalendarSection',

  components: {
    MonthNavigation,
    CalendarGrid,
    WeeklySummary
  },

  props: {
    /**
     * Fecha actual del calendario
     */
    currentDate: {
      type: Date,
      required: true
    },

    /**
     * Nombre del mes actual (ej: "Octubre")
     */
    monthName: {
      type: String,
      required: true
    },

    /**
     * Array con los nombres de los días de la semana
     * Ej: ['Domingo', 'Lunes', 'Martes', ...]
     */
    daysOfWeek: {
      type: Array,
      required: true,
      validator: (value) => value.length === 7
    },

    /**
     * Número total de días en el mes actual
     */
    daysInMonth: {
      type: Number,
      required: true,
      validator: (value) => value >= 28 && value <= 31
    },

    /**
     * Día de la semana del primer día del mes
     * 0 = Domingo, 1 = Lunes, ... 6 = Sábado
     */
    startingDayOfWeek: {
      type: Number,
      required: true,
      validator: (value) => value >= 0 && value <= 6
    },

    /**
     * Objeto con todas las rutinas del usuario
     * Key: fecha en formato 'YYYY-M-D'
     * Value: { name, exercises, completed, xp }
     */
    routines: {
      type: Object,
      required: true
    },

    /**
     * Número de rutinas completadas este mes
     */
    completedRoutines: {
      type: Number,
      required: true
    },

    /**
     * XP actual del usuario
     */
    userXP: {
      type: Number,
      required: true
    },

    /**
     * Porcentaje de progreso hacia el siguiente nivel
     */
    xpProgress: {
      type: Number,
      required: true
    },

    /**
     * Días consecutivos de racha
     */
    streak: {
      type: Number,
      required: true
    }
  },

  methods: {
    /**
     * Emite evento cuando se hace click en el mes anterior
     */
    handlePreviousMonth() {
      this.$emit('previous-month');
    },

    /**
     * Emite evento cuando se hace click en el mes siguiente
     */
    handleNextMonth() {
      this.$emit('next-month');
    },

    /**
     * Emite evento cuando se hace click en un día del calendario
     * @param {Number} day - Día clickeado
     */
    handleDayClick(day) {
      this.$emit('day-click', day);
    },

    /**
     * Emite evento cuando se completa una rutina
     * @param {Number} day - Día de la rutina completada
     */
    handleCompleteRoutine(day) {
      this.$emit('complete-routine', day);
    }
  }
};
</script>

<style scoped>
/* Sección del calendario */
.calendar-section {
  margin-top: -3rem;
  /* Se superpone ligeramente con el hero */
  padding: 0 0 4rem;
  position: relative;
  z-index: 2;
}

/* Responsive Design */
@media (max-width: 600px) {
  .calendar-section {
    margin-top: -2rem;
    padding: 0 0 3rem;
  }
}
</style>