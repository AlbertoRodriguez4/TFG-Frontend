<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()
const topThreeUsers = ref([])

onMounted(async () => {
  topThreeUsers.value = await store.getTopThreeUsers()
  console.log(topThreeUsers.value)
})
</script>


<template>
  <section class="ranking">
    <h2 class="ranking-title">{{ $t('ranking de usuarios') }}</h2>
    <div class="ranking-container">
      <div v-for="(user, index) in topThreeUsers" :key="index" 
        :class="['ranking-item', index === 0 ? 'first-place' : index === 1 ? 'second-place' : 'third-place']">
        <v-card class="user-card">
          <div class="user-card-avatar">
            <span class="icon">👤</span>
          </div>
          <div class="user-card-info">
            <p>{{ $t('usuario') }}: <span class="highlight">{{ user.name }}</span></p>
            <p>LVL: {{ user.level }}</p>
            <div class="stat-bar">
              <span>{{ $t('fuerza') }}: {{ user.strength }}</span>
              <div class="bar">
                <div class="fill fuerza" :style="{ width: user.strength + '%' }"></div>
                
              </div>
            </div>
            <div class="stat-bar">
              <span>{{ $t('resistencia') }}: {{ user.endurance }}</span>
              <div class="bar">
                <div class="fill resistencia" :style="{ width: user.endurance + '%' }"></div>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </section>
</template>


<style scoped>
.ranking {
  width: 80%;
  background: white;
  padding: 1rem;
  color: black;
  border: 10px solid #0D6EFD;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  border-radius: 12px;
  height: 92%;
}

.ranking-title {
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
}

.ranking-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5rem;
  place-items: center;
  width: 100%;
  margin-top: 80px;
}

.ranking-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 240px;
  aspect-ratio: auto;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

/* Primer lugar */
.first-place {
  background-color: #FFD700; /* Dorado */
  transform: scale(1.1);
  border: 5px solid #FFB800;
  box-shadow: 0 10px 20px rgba(255, 223, 0, 0.3);
}

.first-place .user-card {
  background-color: #FFD700;
  color: white;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
}

/* Segundo lugar */
.second-place {
  background-color: #C0C0C0; /* Plateado */
  transform: scale(1.05);
  border: 4px solid #A8A8A8;
  box-shadow: 0 8px 15px rgba(192, 192, 192, 0.3);
}

.second-place .user-card {
  background-color: #C0C0C0;
  color: black;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

/* Tercer lugar */
.third-place {
  background-color: #cd7f32; /* Bronce */
  transform: scale(1.03);
  border: 4px solid #b16a29;
  box-shadow: 0 6px 12px rgba(205, 127, 50, 0.3);
}

.third-place .user-card {
  background-color: #cd7f32;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Tarjetas de usuario (común a todos) */
.user-card {
  display: flex;
  gap: 1rem;
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 200px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
}

.user-card-avatar {
  background-color: #ddd;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
}

.user-card-info {
  flex: 1;
  text-align: left;
}

.stat-bar {
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
}

.stat-bar span {
  width: 80px;
  font-size: 0.75rem;
}

.bar {
  background-color: #ccc;
  height: 8px;
  width: 100%;
  border-radius: 4px;
  margin: 0 0.5rem;
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 4px;
}

.fuerza {
  background-color: red;
}

.resistencia {
  background-color: blue;
}

.highlight {
  font-weight: bold;
}

.search-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1rem;
}

.search-controls input {
  padding: 0.5rem;
  border: 4px solid #007bff;
  border-radius: 6px;
}

.search-controls button {
  border: 4px solid #007bff;
  color: black;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  background-color: #D9D9D9;
  font-weight: bold;
}

h2 {
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
}
</style>

