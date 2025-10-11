<template>
  <div class="rewards-preview mt-8">
    <h3 class="text-h6 font-weight-bold mb-4 text-center">
      🎁 Recompensas al Completar
    </h3>
    <v-row>
      <v-col cols="4">
        <div class="reward-preview-card">
          <div class="reward-icon purple">
            <v-icon size="50" color="white">mdi-star</v-icon>
          </div>
          <div class="reward-amount">+150</div>
          <div class="reward-type">Experiencia</div>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="reward-preview-card">
          <div class="reward-icon amber">
            <v-icon size="50" color="white">mdi-coin</v-icon>
          </div>
          <div class="reward-amount">+50</div>
          <div class="reward-type">Monedas</div>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="reward-preview-card">
          <div class="reward-icon orange">
            <v-icon size="50" color="white">mdi-fire</v-icon>
          </div>
          <div class="reward-amount">+1</div>
          <div class="reward-type">Racha</div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'RewardsPreview'
};
</script>

<style scoped>
.rewards-preview {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border: 2px solid rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  padding: 2rem;
}

.reward-preview-card {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 2rem 1rem;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.reward-preview-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.reward-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.reward-icon.purple {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.reward-icon.amber {
  background: linear-gradient(135deg, #ffc107, #ff9800);
}

.reward-icon.orange {
  background: linear-gradient(135deg, #ff9800, #ff5722);
}

.reward-amount {
  font-size: 2rem;
  font-weight: 900;
  color: #212121;
  margin-bottom: 0.5rem;
}

.reward-type {
  font-size: 0.95rem;
  font-weight: 700;
  color: #757575;
}

@media (max-width: 600px) {
  .rewards-preview {
    padding: 1rem;
  }
  
  .reward-preview-card {
    padding: 1rem 0.5rem;
  }
  
  .reward-icon {
    width: 50px;
    height: 50px;
  }
  
  .reward-icon .v-icon {
    font-size: 32px !important;
  }
  
  .reward-amount {
    font-size: 1.2rem;
  }
  
  .reward-type {
    font-size: 0.75rem;
  }
}
</style>