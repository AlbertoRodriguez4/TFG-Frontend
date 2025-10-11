<template>
  <div class="calendar-container mt-8">
    <!-- Week Headers -->
    <div class="week-headers">
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="week-day-header"
      >
        <div class="week-day-circle">
          <span>{{ day.charAt(0) }}</span>
        </div>
        <span class="week-day-full">{{ day }}</span>
      </div>
    </div>

    <!-- Days Grid -->
    <div class="days-grid">
      <!-- Empty days -->
      <div
        v-for="i in startingDayOfWeek"
        :key="'empty-' + i"
        class="day-item empty-day"
      ></div>

      <!-- Active days -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="day-item-wrapper"
      >
        <DayCard
          :day="day"
          :routine="getRoutine(day)"
          :is-today="isToday(day)"
          :current-date="currentDate"
          @click="$emit('day-click', day)"
          @complete="$emit('complete-routine', day)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DayCard from './DayCard.vue';

export default {
  name: 'CalendarGrid',
  components: {
    DayCard
  },
  props: {
    daysOfWeek: {
      type: Array,
      required: true
    },
    startingDayOfWeek: {
      type: Number,
      required: true
    },
    daysInMonth: {
      type: Number,
      required: true
    },
    currentDate: {
      type: Date,
      required: true
    },
    routines: {
      type: Object,
      required: true
    }
  },
  methods: {
    getRoutineKey(day) {
      return `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${day}`;
    },
    getRoutine(day) {
      return this.routines[this.getRoutineKey(day)];
    },
    isToday(day) {
      const today = new Date();
      return day === today.getDate() && 
             this.currentDate.getMonth() === today.getMonth() && 
             this.currentDate.getFullYear() === today.getFullYear();
    }
  }
};
</script>

<style scoped>
.calendar-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 100%;
  width: 100%;
}

.week-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.week-day-header {
  text-align: center;
}

.week-day-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
  margin: 0 auto 0.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.week-day-full {
  font-weight: 700;
  font-size: 0.9rem;
  color: #424242;
  display: block;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  /* CRÍTICO: Forzar todas las filas a la misma altura */
  grid-auto-rows: 1fr;
}

/* Wrapper para mantener la proporción y altura consistente */
.day-item-wrapper {
  position: relative;
  width: 100%;
  /* Altura mínima fija para evitar descuadres */
  min-height: 140px;
  height: 100%;
}

/* Asegurar que DayCard ocupe todo el espacio disponible */
.day-item-wrapper >>> .day-card {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-day {
  background: transparent;
  min-height: 140px;
}

@media (max-width: 960px) {
  .calendar-container {
    padding: 1rem;
  }
  
  .week-day-circle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .week-day-full {
    font-size: 0.75rem;
  }
  
  .days-grid {
    gap: 0.5rem;
  }
  
  .day-item-wrapper {
    min-height: 120px;
  }
  
  .empty-day {
    min-height: 120px;
  }
}

@media (max-width: 600px) {
  .calendar-container {
    padding: 0.75rem;
    border-radius: 16px;
  }
  
  .week-headers {
    gap: 0.35rem;
    margin-bottom: 1rem;
  }
  
  .week-day-circle {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .week-day-full {
    font-size: 0.65rem;
  }
  
  .days-grid {
    gap: 0.35rem;
  }
  
  .day-item-wrapper {
    min-height: 100px;
  }
  
  .empty-day {
    min-height: 100px;
  }
}
</style>