<template>
  <div class="day-item">
    <v-card
      :class="getDayCardClass"
      elevation="4"
      @click="handleClick"
    >
      <div class="day-card-inner">
        <!-- Day Header -->
        <div class="day-top">
          <span class="day-num">{{ day }}</span>
          <v-chip
            v-if="isToday"
            x-small
            color="purple"
            dark
            class="today-chip"
          >
            HOY
          </v-chip>
        </div>

        <!-- Day Content -->
        <div class="day-body">
          <!-- Has Workout -->
          <div v-if="routine" class="has-workout">
            <div class="workout-icon-container">
              <v-icon 
                :color="routine.completed ? 'green' : 'orange'"
                size="28"
              >
                {{ routine.completed ? 'mdi-check-circle' : 'mdi-dumbbell' }}
              </v-icon>
            </div>
            <p class="workout-name">{{ routine.name }}</p>
            
            <v-btn
              v-if="!routine.completed"
              small
              block
              color="purple"
              dark
              depressed
              class="complete-workout-btn"
              @click.stop="$emit('complete')"
            >
              <v-icon small left>mdi-check-bold</v-icon>
              Completar
            </v-btn>

            <div v-else class="completed-badge">
              <v-icon small color="green" class="mr-1">mdi-trophy</v-icon>
              <span>+{{ routine.xp }} XP</span>
            </div>
          </div>

          <!-- No Workout -->
          <div v-else class="no-workout">
            <div class="add-workout-icon">
              <v-icon size="40" color="grey lighten-1">mdi-plus</v-icon>
            </div>
            <p class="add-workout-text">Añadir</p>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'DayCard',
  props: {
    day: {
      type: Number,
      required: true
    },
    routine: {
      type: Object,
      default: null
    },
    isToday: {
      type: Boolean,
      default: false
    },
    currentDate: {
      type: Date,
      required: true
    },
    isPastDate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getDayCardClass() {
      return {
        'day-card': true,
        'day-card-today': this.isToday,
        'day-card-completed': this.routine?.completed,
        'day-card-pending': this.routine && !this.routine.completed,
        'day-card-empty': !this.routine
      };
    }
  },
  methods: {
    handleClick() {
      if (!this.routine) {
        this.$emit('click');
      }
    }
  }
};
</script>

<style scoped>
.day-item {
  aspect-ratio: 1;
  animation: fadeInUp 0.5s ease-out backwards;
}

.day-card {
  height: 100%;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid #e0e0e0;
  background: white;
}

.day-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}

.day-card-empty {
  border-style: dashed;
  border-color: #ccc;
}

.day-card-empty:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.03);
}

.day-card-today {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25) !important;
}

.day-card-completed {
  border-color: #4caf50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08), rgba(139, 195, 74, 0.08));
}

.day-card-pending {
  border-color: #ff9800;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.08), rgba(255, 193, 7, 0.08));
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    border-color: #ff9800;
    box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);
  }
  50% {
    border-color: #ffb74d;
    box-shadow: 0 4px 25px rgba(255, 152, 0, 0.4);
  }
}

.day-card-inner {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.day-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.day-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: #212121;
}

.today-chip {
  font-weight: 800;
  letter-spacing: 0.5px;
}

.day-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.has-workout {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.workout-icon-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.workout-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #424242;
  margin-bottom: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
}

.complete-workout-btn {
  font-weight: 700;
  text-transform: none;
  margin-top: auto;
}

.completed-badge {
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}

.no-workout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.day-card:hover .no-workout {
  opacity: 0.6;
}

.add-workout-icon {
  margin-bottom: 0.5rem;
}

.add-workout-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #9e9e9e;
  margin: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 960px) {
  .day-num {
    font-size: 1.4rem;
  }
  
  .workout-name {
    font-size: 0.8rem;
  }
  
  .workout-icon-container {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 600px) {
  .day-card-inner {
    padding: 0.5rem;
  }
  
  .day-num {
    font-size: 1.1rem;
  }
  
  .workout-name {
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
  }
  
  .workout-icon-container {
    width: 35px;
    height: 35px;
    margin-bottom: 0.5rem;
  }
  
  .workout-icon-container .v-icon {
    font-size: 20px !important;
  }
  
  .complete-workout-btn {
    font-size: 0.7rem;
    height: 28px !important;
  }
  
  .completed-badge {
    padding: 0.35rem 0.75rem;
    font-size: 0.7rem;
  }
  
  .add-workout-icon .v-icon {
    font-size: 28px !important;
  }
  
  .add-workout-text {
    font-size: 0.7rem;
  }
}
</style>