<template>
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <v-container class="hero-content">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="7">
          <div class="hero-text">
            <v-chip color="purple" dark class="mb-4 hero-badge">
              <v-icon small left>mdi-fire</v-icon>
              {{ streak }} días en racha
            </v-chip>
            <h1 class="display-2 font-weight-black white--text mb-4">
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
                @click="$emit('create-routine')"
              >
                <v-icon left color="purple">mdi-plus-circle</v-icon>
                <span class="purple--text font-weight-bold">Crear Rutina</span>
              </v-btn>
              <v-btn
                x-large
                outlined
                dark
                class="hero-btn-secondary"
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
            :user-xp="userXP"
            :xp-to-next-level="xpToNextLevel"
            :xp-progress="xpProgress"
            :coins="coins"
            :completed-routines="completedRoutines"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import StatsCards from './StatsCards.vue';

export default {
  name: 'HeroSection',
  components: {
    StatsCards
  },
  props: {
    userLevel: {
      type: Number,
      required: true
    },
    userXP: {
      type: Number,
      required: true
    },
    xpToNextLevel: {
      type: Number,
      required: true
    },
    coins: {
      type: Number,
      required: true
    },
    completedRoutines: {
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

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  font-weight: 700;
  font-size: 0.95rem;
}

.gradient-text-hero {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  opacity: 0.95;
  max-width: 600px;
}

.hero-btn-primary {
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.5px;
}

.hero-btn-secondary {
  font-weight: 700;
  text-transform: none;
  border: 2px solid rgba(255, 255, 255, 0.7) !important;
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
}
</style>