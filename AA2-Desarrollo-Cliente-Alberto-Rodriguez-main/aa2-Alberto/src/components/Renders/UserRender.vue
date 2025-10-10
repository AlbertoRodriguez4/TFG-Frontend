<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()
const topThreeUsers = ref([])

onMounted(async () => {
  topThreeUsers.value = await store.getTopThreeUsers()
  console.log(topThreeUsers.value)
})

const getMedalIcon = (index) => {
  if (index === 0) return 'mdi-trophy'
  if (index === 1) return 'mdi-medal'
  return 'mdi-medal-outline'
}

const getRankPosition = (index) => {
  return ['1º', '2º', '3º'][index]
}
</script>

<template>
  <section class="ranking-section">
    <!-- Header del ranking -->
    <div class="ranking-header">
      <div class="header-decoration">
        <v-icon size="48" color="#FFD700">mdi-podium-gold</v-icon>
      </div>
      <div class="header-content">
        <h2 class="ranking-title">{{ $t('ranking de usuarios') }}</h2>
        <p class="ranking-subtitle">{{ $t('Los mejores atletas de TheTrainingHub') }}</p>
      </div>
      <div class="header-decoration">
        <v-icon size="48" color="#FFD700">mdi-trophy-variant</v-icon>
      </div>
    </div>

    <!-- Podio -->
    <div class="podium-container">
      <!-- Segundo lugar (izquierda) -->
      <div v-if="topThreeUsers[1]" class="podium-position second-position">
        <div class="position-card second-card">
          <div class="medal-badge second-medal">
            <v-icon size="40" color="#C0C0C0">{{ getMedalIcon(1) }}</v-icon>
            <span class="position-number">2º</span>
          </div>
          
          <div class="user-avatar second-avatar">
            <v-icon size="56" color="#C0C0C0">mdi-account-circle</v-icon>
            <div class="level-badge">
              <span>LVL {{ topThreeUsers[1].level }}</span>
            </div>
          </div>
          
          <h3 class="user-name">{{ topThreeUsers[1].name }}</h3>
          
          <div class="stats-container">
            <div class="stat-item strength-stat">
              <div class="stat-icon">
                <v-icon size="20" color="#FF4757">mdi-arm-flex</v-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">{{ $t('fuerza') }}</span>
                <div class="stat-bar-wrapper">
                  <div class="stat-bar">
                    <div class="stat-fill strength-fill" :style="{ width: Math.min(topThreeUsers[1].strength, 100) + '%' }">
                      <span class="stat-value">{{ topThreeUsers[1].strength }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="stat-item endurance-stat">
              <div class="stat-icon">
                <v-icon size="20" color="#00D2FF">mdi-run-fast</v-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">{{ $t('resistencia') }}</span>
                <div class="stat-bar-wrapper">
                  <div class="stat-bar">
                    <div class="stat-fill endurance-fill" :style="{ width: Math.min(topThreeUsers[1].endurance, 100) + '%' }">
                      <span class="stat-value">{{ topThreeUsers[1].endurance }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="podium-base second-base">
          <span class="base-number">2</span>
        </div>
      </div>

      <!-- Primer lugar (centro) -->
      <div v-if="topThreeUsers[0]" class="podium-position first-position">
        <div class="position-card first-card">
          <div class="crown-decoration">
            <v-icon size="32" color="#FFD700">mdi-crown</v-icon>
          </div>
          
          <div class="medal-badge first-medal">
            <v-icon size="48" color="#FFD700">{{ getMedalIcon(0) }}</v-icon>
            <span class="position-number">1º</span>
          </div>
          
          <div class="user-avatar first-avatar">
            <v-icon size="72" color="#FFD700">mdi-account-circle</v-icon>
            <div class="level-badge gold-badge">
              <span>LVL {{ topThreeUsers[0].level }}</span>
            </div>
          </div>
          
          <h3 class="user-name champion-name">{{ topThreeUsers[0].name }}</h3>
          
          <div class="stats-container">
            <div class="stat-item strength-stat">
              <div class="stat-icon">
                <v-icon size="24" color="#FF4757">mdi-arm-flex</v-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">{{ $t('fuerza') }}</span>
                <div class="stat-bar-wrapper">
                  <div class="stat-bar">
                    <div class="stat-fill strength-fill" :style="{ width: Math.min(topThreeUsers[0].strength, 100) + '%' }">
                      <span class="stat-value">{{ topThreeUsers[0].strength }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="stat-item endurance-stat">
              <div class="stat-icon">
                <v-icon size="24" color="#00D2FF">mdi-run-fast</v-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">{{ $t('resistencia') }}</span>
                <div class="stat-bar-wrapper">
                  <div class="stat-bar">
                    <div class="stat-fill endurance-fill" :style="{ width: Math.min(topThreeUsers[0].endurance, 100) + '%' }">
                      <span class="stat-value">{{ topThreeUsers[0].endurance }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="podium-base first-base">
          <span class="base-number">1</span>
        </div>
      </div>

      <!-- Tercer lugar (derecha) -->
      <div v-if="topThreeUsers[2]" class="podium-position third-position">
        <div class="position-card third-card">
          <div class="medal-badge third-medal">
            <v-icon size="36" color="#CD7F32">{{ getMedalIcon(2) }}</v-icon>
            <span class="position-number">3º</span>
          </div>
          
          <div class="user-avatar third-avatar">
            <v-icon size="48" color="#CD7F32">mdi-account-circle</v-icon>
            <div class="level-badge">
              <span>LVL {{ topThreeUsers[2].level }}</span>
            </div>
          </div>
          
          <h3 class="user-name">{{ topThreeUsers[2].name }}</h3>
          
          <div class="stats-container">
            <div class="stat-item strength-stat">
              <div class="stat-icon">
                <v-icon size="18" color="#FF4757">mdi-arm-flex</v-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">{{ $t('fuerza') }}</span>
                <div class="stat-bar-wrapper">
                  <div class="stat-bar">
                    <div class="stat-fill strength-fill" :style="{ width: Math.min(topThreeUsers[2].strength, 100) + '%' }">
                      <span class="stat-value">{{ topThreeUsers[2].strength }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="stat-item endurance-stat">
              <div class="stat-icon">
                <v-icon size="18" color="#00D2FF">mdi-run-fast</v-icon>
              </div>
              <div class="stat-content">
                <span class="stat-label">{{ $t('resistencia') }}</span>
                <div class="stat-bar-wrapper">
                  <div class="stat-bar">
                    <div class="stat-fill endurance-fill" :style="{ width: Math.min(topThreeUsers[2].endurance, 100) + '%' }">
                      <span class="stat-value">{{ topThreeUsers[2].endurance }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="podium-base third-base">
          <span class="base-number">3</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ranking-section {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  border-radius: 24px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  min-height: 85vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.ranking-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%);
  border-radius: 20px;
  border: 2px solid rgba(255, 215, 0, 0.2);
}

.header-decoration {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.header-content {
  text-align: center;
}

.ranking-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #FFD700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.4);
}

.ranking-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 0 0;
  font-weight: 500;
}

/* Podio Container */
.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2rem;
  flex: 1;
  padding: 2rem 0;
}

.podium-position {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.6s ease-out backwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.first-position {
  animation-delay: 0.2s;
  z-index: 3;
}

.second-position {
  animation-delay: 0.1s;
  z-index: 2;
}

.third-position {
  animation-delay: 0.3s;
  z-index: 1;
}

/* Position Cards */
.position-card {
  position: relative;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  width: 280px;
  border: 3px solid;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.position-card:hover {
  transform: translateY(-10px);
}

.first-card {
  border-color: #FFD700;
  width: 320px;
  padding: 2.5rem 2rem;
  box-shadow: 
    0 15px 50px rgba(255, 215, 0, 0.4),
    0 0 60px rgba(255, 215, 0, 0.2);
}

.second-card {
  border-color: #C0C0C0;
  box-shadow: 
    0 12px 45px rgba(192, 192, 192, 0.3),
    0 0 50px rgba(192, 192, 192, 0.15);
}

.third-card {
  border-color: #CD7F32;
  box-shadow: 
    0 10px 40px rgba(205, 127, 50, 0.3),
    0 0 40px rgba(205, 127, 50, 0.15);
}

/* Crown decoration */
.crown-decoration {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}

/* Medal Badge */
.medal-badge {
  position: absolute;
  top: -25px;
  right: -15px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
  border-radius: 50%;
  padding: 0.75rem;
  border: 3px solid;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.first-medal {
  border-color: #FFD700;
  padding: 1rem;
  animation: pulse-gold 2s ease-in-out infinite;
}

@keyframes pulse-gold {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(255, 215, 0, 0.6);
  }
}

.second-medal {
  border-color: #C0C0C0;
}

.third-medal {
  border-color: #CD7F32;
}

.position-number {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  border: 2px solid currentColor;
}

/* User Avatar */
.user-avatar {
  position: relative;
  margin: 1.5rem auto 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.first-avatar .v-icon {
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
}

.second-avatar .v-icon {
  filter: drop-shadow(0 0 15px rgba(192, 192, 192, 0.5));
}

.third-avatar .v-icon {
  filter: drop-shadow(0 0 12px rgba(205, 127, 50, 0.5));
}

.level-badge {
  background: linear-gradient(135deg, #0D6EFD 0%, #0a58ca 100%);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.85rem;
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.gold-badge {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #000;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
}

/* User Name */
.user-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
  text-align: center;
  margin: 0.5rem 0 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.champion-name {
  font-size: 1.6rem;
  color: #FFD700;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(255, 215, 0, 0.4);
}

/* Stats Container */
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.strength-stat .stat-icon {
  background: linear-gradient(135deg, rgba(255, 71, 87, 0.2) 0%, rgba(255, 71, 87, 0.1) 100%);
  border: 2px solid rgba(255, 71, 87, 0.3);
}

.endurance-stat .stat-icon {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(0, 210, 255, 0.1) 100%);
  border: 2px solid rgba(0, 210, 255, 0.3);
}

.stat-content {
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-bar-wrapper {
  position: relative;
}

.stat-bar {
  height: 24px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-fill {
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0.5rem;
  transition: width 1s ease-out;
  position: relative;
  overflow: hidden;
}

.stat-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer-stat 2s infinite;
}

@keyframes shimmer-stat {
  100% {
    left: 100%;
  }
}

.strength-fill {
  background: linear-gradient(90deg, #FF4757 0%, #FF6348 100%);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.endurance-fill {
  background: linear-gradient(90deg, #00D2FF 0%, #3A7BD5 100%);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.stat-value {
  font-size: 0.75rem;
  font-weight: 800;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

/* Podium Base */
.podium-base {
  width: 100%;
  height: 80px;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.7);
  position: relative;
  margin-top: 1rem;
  border: 3px solid;
  border-bottom: none;
}

.first-base {
  height: 120px;
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
  border-color: #B8860B;
  box-shadow: 
    0 -10px 30px rgba(255, 215, 0, 0.3),
    inset 0 -4px 8px rgba(0, 0, 0, 0.2);
}

.second-base {
  height: 100px;
  background: linear-gradient(180deg, #C0C0C0 0%, #A8A8A8 100%);
  border-color: #808080;
  box-shadow: 
    0 -8px 25px rgba(192, 192, 192, 0.2),
    inset 0 -4px 8px rgba(0, 0, 0, 0.2);
}

.third-base {
  height: 80px;
  background: linear-gradient(180deg, #CD7F32 0%, #B16A29 100%);
  border-color: #8B5A2B;
  box-shadow: 
    0 -6px 20px rgba(205, 127, 50, 0.2),
    inset 0 -4px 8px rgba(0, 0, 0, 0.2);
}

.base-number {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .podium-container {
    gap: 1.5rem;
  }
  
  .position-card {
    width: 240px;
  }
  
  .first-card {
    width: 280px;
  }
}

@media (max-width: 960px) {
  .ranking-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .podium-container {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  .podium-position {
    width: 100%;
    max-width: 400px;
  }
  
  .position-card {
    width: 100%;
  }
  
  .first-card {
    width: 100%;
  }
  
  .podium-base {
    height: 60px;
  }
  
  .first-base {
    height: 80px;
  }
  
  .second-base {
    height: 70px;
  }
}

@media (max-width: 600px) {
  .ranking-section {
    padding: 1.5rem;
  }
  
  .ranking-title {
    font-size: 1.8rem;
  }
  
  .ranking-subtitle {
    font-size: 0.9rem;
  }
  
  .position-card {
    padding: 1.5rem 1rem;
  }
  
  .user-name {
    font-size: 1.1rem;
  }
  
  .champion-name {
    font-size: 1.3rem;
  }
}
</style>