<template>
  <v-card class="weekly-summary-card mt-8" elevation="4" rounded="xl">
    <v-card-text class="pa-6">
      <h3 class="text-h5 font-weight-bold mb-4">
        <v-icon color="purple" class="mr-2">mdi-calendar-week</v-icon>
        Resumen Semanal
      </h3>
      <v-row>
        <v-col cols="6" md="3">
          <div class="summary-item">
            <v-icon size="40" color="purple">mdi-calendar-check</v-icon>
            <div class="summary-value">{{ completedRoutines }}</div>
            <div class="summary-label">Entrenamientos</div>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="summary-item">
            <v-icon size="40" color="amber">mdi-lightning-bolt</v-icon>
            <div class="summary-value">{{ userXP }}</div>
            <div class="summary-label">XP Ganada</div>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="summary-item">
            <v-icon size="40" color="orange">mdi-fire</v-icon>
            <div class="summary-value">{{ streak }}</div>
            <div class="summary-label">Días Racha</div>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="summary-item">
            <v-icon size="40" color="green">mdi-target</v-icon>
            <div class="summary-value">{{ Math.round(xpProgress) }}%</div>
            <div class="summary-label">Progreso</div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'WeeklySummary',
  props: {
    completedRoutines: {
      type: Number,
      required: true
    },
    userXP: {
      type: Number,
      required: true
    },
    streak: {
      type: Number,
      required: true
    },
    xpProgress: {
      type: Number,
      required: true
    }
  }
};
</script>

<style scoped>
.weekly-summary-card {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
}

.summary-item {
  text-align: center;
  padding: 1rem;
}

.summary-value {
  font-size: 2rem;
  font-weight: 900;
  color: #212121;
  margin: 0.5rem 0 0.25rem;
}

.summary-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #757575;
}

@media (max-width: 600px) {
  .weekly-summary-card {
    margin-top: 1.5rem;
  }
  
  .summary-item {
    padding: 0.75rem 0.5rem;
  }
  
  .summary-item .v-icon {
    font-size: 30px !important;
  }
  
  .summary-value {
    font-size: 1.5rem;
  }
  
  .summary-label {
    font-size: 0.75rem;
  }
}
</style>