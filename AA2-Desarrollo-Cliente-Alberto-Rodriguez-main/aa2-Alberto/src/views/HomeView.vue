<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useMapStore } from '@/stores/mapStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mapStore = useMapStore();
const map = ref<L.Map | null>(null);
const markers = ref<L.Marker[]>([]);
const searchAddress = ref('');
const loading = ref(false);
const gymsFound = ref<any[]>([]);
const selectedGym = ref<any>(null);
const showMap = ref(false);

// Iconos personalizados para el mapa
const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const gymIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

onMounted(() => {
  if (showMap.value) {
    initMap();
  }
});

watch(showMap, (newVal) => {
  if (newVal) {
    setTimeout(() => initMap(), 100);
  }
});

function initMap() {
  if (map.value) return;
  
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  map.value = L.map('map').setView([41.6488, -0.8891], 13); // Zaragoza por defecto

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);

  // Click en el mapa para seleccionar ubicación
  map.value.on('click', async (e: L.LeafletMouseEvent) => {
    await searchGymsNearLocation(e.latlng.lat, e.latlng.lng);
  });
}

async function searchByAddress() {
  if (!searchAddress.value.trim()) return;
  
  loading.value = true;
  try {
    const coords = await mapStore.getCooredadas(searchAddress.value);
    await searchGymsNearLocation(coords.lat, coords.lon);
  } catch (error) {
    console.error('Error buscando dirección:', error);
    alert('No se pudo encontrar la dirección. Intenta con otra.');
  } finally {
    loading.value = false;
  }
}

async function searchGymsNearLocation(lat: number, lon: number) {
  loading.value = true;
  
  // Limpiar marcadores anteriores
  markers.value.forEach(marker => marker.remove());
  markers.value = [];

  // Agregar marcador de usuario
  if (map.value) {
    const userMarker = L.marker([lat, lon], { icon: userIcon })
      .addTo(map.value)
      .bindPopup('📍 Tu ubicación');
    markers.value.push(userMarker);
    map.value.setView([lat, lon], 14);
  }

  try {
    const gyms = await mapStore.getEstablecimientos(lat, lon, 'sports_centre');
    gymsFound.value = gyms;

    // Agregar marcadores de gimnasios
    gyms.forEach((gym: any) => {
      if (gym.lat && gym.lon && map.value) {
        const marker = L.marker([parseFloat(gym.lat), parseFloat(gym.lon)], { icon: gymIcon })
          .addTo(map.value)
          .bindPopup(`<strong>${gym.name || 'Gimnasio'}</strong><br>${gym.address || ''}`);
        
        marker.on('click', () => {
          selectedGym.value = gym;
        });
        
        markers.value.push(marker);
      }
    });
  } catch (error) {
    console.error('Error buscando gimnasios:', error);
  } finally {
    loading.value = false;
  }
}

function toggleMapView() {
  showMap.value = !showMap.value;
}
</script>

<template>
  <v-app>
    <v-main class="main-container">
      <!-- Hero Section -->
      <v-container 
        v-if="!showMap"
        fluid 
        class="hero-section pa-0"
      >
        <div class="hero-overlay"></div>
        <v-container class="hero-content">
          <v-row align="center" justify="center">
            <v-col cols="12" md="6" class="text-center">
              <!-- Badge -->
              <v-chip
                class="mb-4 level-badge"
                color="amber"
                text-color="black"
                size="large"
                prepend-icon="mdi-trophy"
              >
                🎮 Social Gaming + Fitness
              </v-chip>

              <h1 class="main-title mb-4">
                <span class="gradient-text">TheTrainingHub</span>
              </h1>
              
              <p class="subtitle mb-2">
                🏋️ Entrena en grupo, acepta retos y sube de nivel
              </p>
              <p class="subtitle mb-4">
                💪 Gana XP, monedas y desbloquea salas exclusivas
              </p>

              <div class="stats-container mb-6">
                <div class="stat-item">
                  <div class="stat-icon">⚡</div>
                  <div class="stat-number">+500</div>
                  <div class="stat-label">XP Diario</div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">👥</div>
                  <div class="stat-number">+1000</div>
                  <div class="stat-label">Usuarios</div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">🏆</div>
                  <div class="stat-number">+50</div>
                  <div class="stat-label">Retos</div>
                </div>
              </div>

              <div class="button-group">
                <RouterLink to="/register" class="no-decoration">
                  <v-btn
                    class="primary-btn"
                    size="x-large"
                    elevation="8"
                  >
                    <v-icon left>mdi-account-plus</v-icon>
                    Únete Ahora
                  </v-btn>
                </RouterLink>

                <v-btn
                  class="secondary-btn ml-4"
                  size="x-large"
                  elevation="8"
                  @click="toggleMapView"
                >
                  <v-icon left>mdi-map-marker</v-icon>
                  Encuentra tu Gym
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
              <div class="hero-image-container">
                <div class="glow-effect"></div>
                <v-img
                  src="../assets/imgs/People.png"
                  alt="Entrenamiento"
                  class="hero-image"
                  cover
                />
                <div class="floating-card card-1">
                  <v-icon color="amber">mdi-lightning-bolt</v-icon>
                  <span>+50 XP</span>
                </div>
                <div class="floating-card card-2">
                  <v-icon color="green">mdi-check-circle</v-icon>
                  <span>Reto Completado</span>
                </div>
                <div class="floating-card card-3">
                  <v-icon color="blue">mdi-account-group</v-icon>
                  <span>Nueva Sala</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- Map Section -->
      <v-container 
        v-else
        fluid 
        class="map-section pa-0"
      >
        <v-btn
          class="back-btn"
          icon
          size="large"
          @click="toggleMapView"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-container class="map-container py-8">
          <v-row>
            <v-col cols="12">
              <div class="map-header text-center mb-6">
                <h2 class="map-title">
                  🗺️ Encuentra tu Gimnasio Perfecto
                </h2>
                <p class="map-subtitle">
                  Haz clic en el mapa o busca por dirección
                </p>
              </div>

              <!-- Búsqueda -->
              <v-card class="search-card mb-4" elevation="8">
                <v-card-text>
                  <v-row align="center">
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="searchAddress"
                        label="Escribe tu dirección"
                        placeholder="Ej: Calle Mayor 10, Zaragoza"
                        prepend-inner-icon="mdi-map-search"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        @keyup.enter="searchByAddress"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-btn
                        block
                        size="large"
                        color="primary"
                        :loading="loading"
                        @click="searchByAddress"
                      >
                        <v-icon left>mdi-magnify</v-icon>
                        Buscar Gimnasios
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Mapa -->
              <v-card class="map-card" elevation="12">
                <div id="map" class="map-element"></div>
              </v-card>

              <!-- Resultados -->
              <v-card 
                v-if="gymsFound.length > 0" 
                class="results-card mt-4"
                elevation="8"
              >
                <v-card-title class="results-title">
                  <v-icon left color="primary">mdi-dumbbell</v-icon>
                  {{ gymsFound.length }} Gimnasios encontrados
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col 
                      v-for="(gym, index) in gymsFound.slice(0, 6)" 
                      :key="index"
                      cols="12" 
                      md="6"
                    >
                      <v-card 
                        class="gym-card"
                        :class="{ 'selected': selectedGym === gym }"
                        elevation="4"
                        hover
                      >
                        <v-card-text>
                          <div class="d-flex align-center">
                            <v-icon color="red" size="large" class="mr-3">
                              mdi-map-marker
                            </v-icon>
                            <div>
                              <div class="gym-name">
                                {{ gym.name || 'Centro Deportivo' }}
                              </div>
                              <div class="gym-address">
                                {{ gym.address || 'Dirección no disponible' }}
                              </div>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;600;700&display=swap');

.main-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%);
  position: relative;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  background-image: url('../assets/imgs/gimansio-fondo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(10, 14, 39, 0.95) 0%, 
    rgba(26, 31, 58, 0.9) 50%, 
    rgba(15, 20, 25, 0.95) 100%
  );
  backdrop-filter: blur(2px);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 80px 20px;
}

.level-badge {
  font-weight: 700;
  font-size: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.main-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.1;
  text-shadow: 0 0 30px rgba(255, 193, 7, 0.5);
}

.gradient-text {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.4rem;
  color: #e0e0e0;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 193, 7, 0.3);
  min-width: 140px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  border-color: #ffd700;
  box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 900;
  color: #ffd700;
  font-family: 'Orbitron', sans-serif;
}

.stat-label {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin-top: 4px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.no-decoration {
  text-decoration: none;
}

.primary-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%) !important;
  color: #000 !important;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 12px;
  text-transform: none;
  padding: 28px 48px !important;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 193, 7, 0.5) !important;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 12px;
  border: 2px solid #ffd700;
  text-transform: none;
  padding: 28px 48px !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: rgba(255, 193, 7, 0.2) !important;
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 193, 7, 0.3) !important;
}

/* Hero Image */
.hero-image-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.3) 0%, transparent 70%);
  animation: glow 3s ease-in-out infinite;
  z-index: 0;
}

@keyframes glow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.hero-image {
  position: relative;
  z-index: 1;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
  z-index: 2;
}

.card-1 {
  top: 10%;
  right: -10%;
  animation-delay: 0s;
}

.card-2 {
  bottom: 20%;
  left: -10%;
  animation-delay: 1s;
}

.card-3 {
  top: 60%;
  right: -5%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

/* Map Section */
.map-section {
  min-height: 100vh;
  padding: 40px 0;
  position: relative;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.map-header {
  color: white;
}

.map-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.map-subtitle {
  font-size: 1.2rem;
  color: #b0b0b0;
}

.search-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
}

.map-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: white;
}

.map-element {
  width: 100%;
  height: 600px;
  border-radius: 16px;
}

.results-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 16px !important;
}

.results-title {
  font-weight: 700;
  font-size: 1.3rem;
  color: #1a1f3a;
}

.gym-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.gym-card:hover {
  border-color: #ffd700;
  transform: translateY(-2px);
}

.gym-card.selected {
  border-color: #ffd700;
  background: rgba(255, 193, 7, 0.1) !important;
}

.gym-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1a1f3a;
  margin-bottom: 4px;
}

.gym-address {
  font-size: 0.9rem;
  color: #666;
}

/* Responsive */
@media (max-width: 960px) {
  .main-title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-btn, .secondary-btn {
    width: 100%;
  }

  .stats-container {
    gap: 20px;
  }

  .floating-card {
    display: none;
  }
}
</style>