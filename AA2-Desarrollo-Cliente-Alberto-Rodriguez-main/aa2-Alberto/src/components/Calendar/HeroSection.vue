<template>
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="hero-particles"></div>
    <v-container class="hero-content">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="7">
          <div class="hero-text">
            <v-chip color="purple" dark class="mb-4 hero-badge elevation-4">
              <v-icon small left>mdi-fire</v-icon>
              {{ streak }} días en racha
            </v-chip>
            <h1 class="display-2 font-weight-black white--text mb-4 hero-title">
              Tu Calendario de<br>
              <span class="gradient-text-hero">Entrenamiento</span>
            </h1>
            <p class="text-h6 white--text mb-6 hero-subtitle">
              Planifica, entrena y alcanza tus objetivos con nuestro sistema gamificado
            </p>
            <div class="hero-actions">
              <v-btn
                x-large
                color="white"
                class="hero-btn-primary mr-3"
                elevation="8"
                @click="handleCreateRoutine"
              >
                <v-icon left color="purple">mdi-plus-circle</v-icon>
                <span class="purple--text font-weight-bold">Crear Rutina</span>
              </v-btn>
              <v-btn
                x-large
                outlined
                dark
                class="hero-btn-secondary"
                @click="showStats = true"
              >
                <v-icon left>mdi-chart-timeline-variant</v-icon>
                Ver Estadísticas
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <StatsCards
            :user-level="userLevel"
            :userXP="userXP"
            :xp-to-next-level="xpToNextLevel"
            :xp-progress="xpProgress"
            :coins="coins"
            :completed-routines="completedRoutines"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Diálogo de descanso -->
    <v-dialog v-model="showRestDialog" max-width="500">
      <v-card class="rest-dialog">
        <v-card-title class="rest-dialog-title">
          <v-icon large color="white" class="mr-3">mdi-sleep</v-icon>
          <span>¡Momento de descansar!</span>
        </v-card-title>
        <v-card-text class="rest-dialog-text">
          <p class="text-h6 mb-3">Ya has entrenado hoy 💪</p>
          <p class="text-body-1">
            Recuerda: <strong>la parte más importante de cualquier rutina es el descanso</strong>. 
            Tu cuerpo necesita tiempo para recuperarse y crecer más fuerte.
          </p>
          <p class="text-body-2 mt-3 purple--text text--lighten-1">
            ✨ Vuelve mañana para continuar tu racha de {{ streak }} días
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="purple"
            text
            large
            @click="showRestDialog = false"
          >
            Entendido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Estadísticas -->
    <RoutineStats v-model="showStats" />
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, computed } from 'vue';
import { useRoutineStore } from '@/stores/RoutineStore';
import StatsCards from './StatsCards.vue';
import RoutineStats from './RoutineStats.vue';

export default defineComponent({
  name: 'HeroSection',
  components: {
    StatsCards,
    RoutineStats
  },
  props: {
    userLevel: {
      type: Number as PropType<number>,
      required: true
    },
    userXP: {
      type: Number as PropType<number>,
      required: true
    },
    xpToNextLevel: {
      type: Number as PropType<number>,
      required: true
    },
    coins: {
      type: Number as PropType<number>,
      required: true
    },
    completedRoutines: {
      type: Number as PropType<number>,
      required: true
    },
    streak: {
      type: Number as PropType<number>,
      required: true
    },
    xpProgress: {
      type: Number as PropType<number>,
      required: true
    }
  },
  emits: ['create-routine'],
  setup(props, { emit }) {
    const routineStore = useRoutineStore();
    const showRestDialog = ref(false);
    const showStats = ref(false);

    const hasRoutineToday = computed((): boolean => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return routineStore.routines.some(routine => {
        const routineDate = new Date(routine.createdat);
        routineDate.setHours(0, 0, 0, 0);
        return routineDate.getTime() === today.getTime();
      });
    });

    const handleCreateRoutine = (): void => {
      if (hasRoutineToday.value) {
        showRestDialog.value = true;
      } else {
        emit('create-routine');
      }
    };

    return {
      showRestDialog,
      showStats,
      handleCreateRoutine,
      hasRoutineToday
    };
  }
});
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 0 6rem;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
  background-size: cover;
  background-position: bottom;
  opacity: 0.3;
}

.hero-particles {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 50px 50px, 80px 80px, 100px 100px;
  background-position: 0 0, 40px 60px, 130px 270px;
  animation: particleFloat 20s linear infinite;
}

@keyframes particleFloat {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out;
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

.hero-badge {
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 20px;
  padding: 8px 16px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.gradient-text-hero {
  background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}

.hero-subtitle {
  opacity: 0.95;
  max-width: 600px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-actions {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-btn-primary {
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
}

.hero-btn-secondary {
  font-weight: 700;
  text-transform: none;
  border: 2px solid rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  border-radius: 12px;
}

.hero-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 1) !important;
  transform: translateY(-2px);
}

.rest-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.rest-dialog-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  font-size: 1.5rem;
  font-weight: 700;
}

.rest-dialog-text {
  padding: 32px 24px;
  text-align: center;
}

.rest-dialog-text p {
  line-height: 1.6;
}

@media (max-width: 960px) {
  .hero-section {
    padding: 3rem 0 4rem;
  }
  
  .display-2 {
    font-size: 2.5rem !important;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero-actions .v-btn {
    width: 100%;
    margin: 0 !important;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 2rem 0 3rem;
  }
  
  .display-2 {
    font-size: 2rem !important;
    line-height: 1.2;
  }
  
  .text-h6 {
    font-size: 1rem !important;
  }

  .rest-dialog-title {
    font-size: 1.25rem;
    padding: 20px;
  }

  .rest-dialog-text {
    padding: 24px 16px;
  }
}
</style>