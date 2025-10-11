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
</script>

<template>
  <section class="ranking-section">
    <!-- Particles background effect -->
    <div class="particles-bg">
      <div class="particle" v-for="i in 20" :key="i" :style="{ 
        left: Math.random() * 100 + '%', 
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (3 + Math.random() * 4) + 's'
      }"></div>
    </div>

    <!-- Hero Header -->
    <div class="hero-header">
      <div class="header-glow"></div>
      <div class="trophy-icon-container">
        <v-icon class="trophy-main">mdi-trophy-variant</v-icon>
        <div class="trophy-rings">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
        </div>
      </div>
      <h1 class="main-title">
        <span class="title-top">{{ $t('HALL OF') }}</span>
        <span class="title-bottom">{{ $t('CHAMPIONS') }}</span>
      </h1>
      <p class="hero-subtitle">{{ $t('Los atletas legendarios de TheTrainingHub') }}</p>
      <div class="title-divider">
        <div class="divider-line"></div>
        <v-icon class="divider-icon">mdi-fire</v-icon>
        <div class="divider-line"></div>
      </div>
    </div>

    <!-- Podium -->
    <div class="podium-arena">
      <div class="arena-floor"></div>
      
      <!-- Segunda posición -->
      <div v-if="topThreeUsers[1]" class="champion-slot slot-second">
        <div class="spotlight spotlight-silver"></div>
        <div class="champion-card card-silver">
          <div class="card-shine"></div>
          <div class="rank-badge badge-second">
            <span class="rank-number">2</span>
            <v-icon class="rank-icon">{{ getMedalIcon(1) }}</v-icon>
          </div>
          
          <div class="avatar-container">
            <div class="avatar-ring ring-silver">
              <div class="ring-glow"></div>
            </div>
            <div class="avatar-image">
              <v-icon size="64">mdi-account-circle</v-icon>
            </div>
            <div class="level-indicator level-silver">
              <v-icon size="16" class="level-icon">mdi-shield-star</v-icon>
              <span class="level-text">{{ topThreeUsers[1].level }}</span>
            </div>
          </div>

          <h3 class="champion-name">{{ topThreeUsers[1].name }}</h3>
          
          <div class="stats-grid">
            <div class="stat-box stat-strength">
              <div class="stat-header">
                <v-icon size="18">mdi-arm-flex</v-icon>
                <span class="stat-title">{{ $t('FUERZA') }}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-progress progress-strength" 
                     :style="{ width: Math.min(topThreeUsers[1].strength, 100) + '%' }">
                  <span class="stat-value">{{ topThreeUsers[1].strength }}</span>
                </div>
              </div>
            </div>

            <div class="stat-box stat-endurance">
              <div class="stat-header">
                <v-icon size="18">mdi-run-fast</v-icon>
                <span class="stat-title">{{ $t('RESISTENCIA') }}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-progress progress-endurance" 
                     :style="{ width: Math.min(topThreeUsers[1].endurance, 100) + '%' }">
                  <span class="stat-value">{{ topThreeUsers[1].endurance }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <v-icon size="14" color="rgba(192, 192, 192, 0.6)">mdi-medal</v-icon>
            <span class="footer-text">{{ $t('Plata') }}</span>
          </div>
        </div>
        
        <div class="pedestal pedestal-silver">
          <div class="pedestal-top">
            <span class="pedestal-rank">2</span>
          </div>
          <div class="pedestal-body"></div>
        </div>
      </div>

      <!-- Primera posición -->
      <div v-if="topThreeUsers[0]" class="champion-slot slot-first">
        <div class="spotlight spotlight-gold"></div>
        <div class="crown-float">
          <v-icon class="crown-icon">mdi-crown</v-icon>
        </div>
        
        <div class="champion-card card-gold">
          <div class="card-shine gold-shine"></div>
          <div class="card-sparkles">
            <div class="sparkle" v-for="i in 6" :key="i"></div>
          </div>
          
          <div class="rank-badge badge-first">
            <span class="rank-number">1</span>
            <v-icon class="rank-icon">{{ getMedalIcon(0) }}</v-icon>
          </div>
          
          <div class="avatar-container">
            <div class="avatar-ring ring-gold">
              <div class="ring-glow gold-glow"></div>
              <div class="ring-pulse"></div>
            </div>
            <div class="avatar-image">
              <v-icon size="80">mdi-account-circle</v-icon>
            </div>
            <div class="level-indicator level-gold">
              <v-icon size="18" class="level-icon">mdi-shield-star</v-icon>
              <span class="level-text">{{ topThreeUsers[0].level }}</span>
            </div>
          </div>

          <h3 class="champion-name name-gold">{{ topThreeUsers[0].name }}</h3>
          <div class="champion-title">{{ $t('CAMPEÓN SUPREMO') }}</div>
          
          <div class="stats-grid">
            <div class="stat-box stat-strength">
              <div class="stat-header">
                <v-icon size="20">mdi-arm-flex</v-icon>
                <span class="stat-title">{{ $t('FUERZA') }}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-progress progress-strength" 
                     :style="{ width: Math.min(topThreeUsers[0].strength, 100) + '%' }">
                  <span class="stat-value">{{ topThreeUsers[0].strength }}</span>
                </div>
              </div>
            </div>

            <div class="stat-box stat-endurance">
              <div class="stat-header">
                <v-icon size="20">mdi-run-fast</v-icon>
                <span class="stat-title">{{ $t('RESISTENCIA') }}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-progress progress-endurance" 
                     :style="{ width: Math.min(topThreeUsers[0].endurance, 100) + '%' }">
                  <span class="stat-value">{{ topThreeUsers[0].endurance }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer footer-gold">
            <v-icon size="16" color="#FFD700">mdi-trophy</v-icon>
            <span class="footer-text">{{ $t('Oro') }}</span>
          </div>
        </div>
        
        <div class="pedestal pedestal-gold">
          <div class="pedestal-top">
            <span class="pedestal-rank">1</span>
          </div>
          <div class="pedestal-body"></div>
        </div>
      </div>

      <!-- Tercera posición -->
      <div v-if="topThreeUsers[2]" class="champion-slot slot-third">
        <div class="spotlight spotlight-bronze"></div>
        <div class="champion-card card-bronze">
          <div class="card-shine"></div>
          <div class="rank-badge badge-third">
            <span class="rank-number">3</span>
            <v-icon class="rank-icon">{{ getMedalIcon(2) }}</v-icon>
          </div>
          
          <div class="avatar-container">
            <div class="avatar-ring ring-bronze">
              <div class="ring-glow"></div>
            </div>
            <div class="avatar-image">
              <v-icon size="56">mdi-account-circle</v-icon>
            </div>
            <div class="level-indicator level-bronze">
              <v-icon size="14" class="level-icon">mdi-shield-star</v-icon>
              <span class="level-text">{{ topThreeUsers[2].level }}</span>
            </div>
          </div>

          <h3 class="champion-name">{{ topThreeUsers[2].name }}</h3>
          
          <div class="stats-grid">
            <div class="stat-box stat-strength">
              <div class="stat-header">
                <v-icon size="16">mdi-arm-flex</v-icon>
                <span class="stat-title">{{ $t('FUERZA') }}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-progress progress-strength" 
                     :style="{ width: Math.min(topThreeUsers[2].strength, 100) + '%' }">
                  <span class="stat-value">{{ topThreeUsers[2].strength }}</span>
                </div>
              </div>
            </div>

            <div class="stat-box stat-endurance">
              <div class="stat-header">
                <v-icon size="16">mdi-run-fast</v-icon>
                <span class="stat-title">{{ $t('RESISTENCIA') }}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-progress progress-endurance" 
                     :style="{ width: Math.min(topThreeUsers[2].endurance, 100) + '%' }">
                  <span class="stat-value">{{ topThreeUsers[2].endurance }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <v-icon size="14" color="rgba(205, 127, 50, 0.6)">mdi-medal-outline</v-icon>
            <span class="footer-text">{{ $t('Bronce') }}</span>
          </div>
        </div>
        
        <div class="pedestal pedestal-bronze">
          <div class="pedestal-top">
            <span class="pedestal-rank">3</span>
          </div>
          <div class="pedestal-body"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ranking-section {
  position: relative;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
  background: 
    radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #0a0e1a 0%, #0f1419 50%, #0a0e1a 100%);
  min-height: 90vh;
  overflow: hidden;
}

/* Particles Background */
.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 215, 0, 0.4);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* Hero Header */
.hero-header {
  position: relative;
  text-align: center;
  margin-bottom: 4rem;
  z-index: 10;
}

.header-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.trophy-icon-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.trophy-main {
  font-size: 4rem !important;
  color: #FFD700;
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.6));
  animation: trophy-pulse 3s ease-in-out infinite;
}

@keyframes trophy-pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.6));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 50px rgba(255, 215, 0, 0.8));
  }
}

.trophy-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  animation: ring-expand 3s ease-out infinite;
}

.ring-1 {
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}

.ring-2 {
  width: 80px;
  height: 80px;
  animation-delay: 1s;
}

.ring-3 {
  width: 80px;
  height: 80px;
  animation-delay: 2s;
}

@keyframes ring-expand {
  0% {
    width: 80px;
    height: 80px;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

.main-title {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
}

.title-top {
  font-size: 1.8rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 8px;
  text-transform: uppercase;
}

.title-bottom {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
  text-transform: uppercase;
  animation: gradient-shift 3s ease infinite;
  text-shadow: 0 0 60px rgba(255, 215, 0, 0.5);
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 1rem 0 2rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.title-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
}

.divider-icon {
  color: #FF6B35;
  animation: fire-flicker 1.5s ease-in-out infinite;
}

@keyframes fire-flicker {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Podium Arena */
.podium-arena {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 0;
  perspective: 1000px;
}

.arena-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 215, 0, 0.3) 20%,
    rgba(255, 215, 0, 0.5) 50%,
    rgba(255, 215, 0, 0.3) 80%,
    transparent 100%
  );
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.champion-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slot-entrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

@keyframes slot-entrance {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.slot-first {
  animation-delay: 0.3s;
  z-index: 30;
}

.slot-second {
  animation-delay: 0.15s;
  z-index: 20;
}

.slot-third {
  animation-delay: 0.45s;
  z-index: 10;
}

/* Spotlight Effect */
.spotlight {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 300px;
  pointer-events: none;
  opacity: 0.3;
}

.spotlight-gold {
  background: linear-gradient(180deg, rgba(255, 215, 0, 0.4) 0%, transparent 100%);
  filter: blur(30px);
}

.spotlight-silver {
  background: linear-gradient(180deg, rgba(192, 192, 192, 0.3) 0%, transparent 100%);
  filter: blur(25px);
}

.spotlight-bronze {
  background: linear-gradient(180deg, rgba(205, 127, 50, 0.3) 0%, transparent 100%);
  filter: blur(25px);
}

/* Crown Float */
.crown-float {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  animation: crown-bounce 2s ease-in-out infinite;
}

@keyframes crown-bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateX(-50%) translateY(-15px) rotate(5deg);
  }
}

.crown-icon {
  font-size: 2.5rem !important;
  color: #FFD700;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
}

/* Champion Cards */
.champion-card {
  position: relative;
  background: 
    linear-gradient(135deg, rgba(20, 30, 48, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem 1.5rem;
  width: 300px;
  border: 2px solid;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.champion-card:hover {
  transform: translateY(-15px) scale(1.02);
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.6s;
}

.champion-card:hover .card-shine {
  left: 100%;
}

.gold-shine {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 215, 0, 0.2),
    transparent
  );
}

.card-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #FFD700;
  border-radius: 50%;
  animation: sparkle-twinkle 2s ease-in-out infinite;
}

.sparkle:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
.sparkle:nth-child(2) { top: 30%; right: 20%; animation-delay: 0.3s; }
.sparkle:nth-child(3) { top: 50%; left: 10%; animation-delay: 0.6s; }
.sparkle:nth-child(4) { top: 60%; right: 15%; animation-delay: 0.9s; }
.sparkle:nth-child(5) { top: 75%; left: 20%; animation-delay: 1.2s; }
.sparkle:nth-child(6) { top: 85%; right: 25%; animation-delay: 1.5s; }

@keyframes sparkle-twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.card-gold {
  border-color: #FFD700;
  width: 340px;
  padding: 2.5rem 2rem;
  box-shadow: 
    0 20px 60px rgba(255, 215, 0, 0.3),
    0 0 80px rgba(255, 215, 0, 0.2),
    inset 0 1px 0 rgba(255, 215, 0, 0.3);
}

.card-silver {
  border-color: #C0C0C0;
  box-shadow: 
    0 15px 50px rgba(192, 192, 192, 0.2),
    0 0 60px rgba(192, 192, 192, 0.15),
    inset 0 1px 0 rgba(192, 192, 192, 0.2);
}

.card-bronze {
  border-color: #CD7F32;
  box-shadow: 
    0 15px 50px rgba(205, 127, 50, 0.2),
    0 0 60px rgba(205, 127, 50, 0.15),
    inset 0 1px 0 rgba(205, 127, 50, 0.2);
}

/* Rank Badge */
.rank-badge {
  position: absolute;
  top: -15px;
  right: 15px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid;
  background: linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.badge-first {
  border-color: #FFD700;
  width: 60px;
  height: 60px;
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 4px 30px rgba(255, 215, 0, 0.8);
  }
}

.badge-second {
  border-color: #C0C0C0;
}

.badge-third {
  border-color: #CD7F32;
}

.rank-number {
  position: absolute;
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
  z-index: 2;
}

.rank-icon {
  position: absolute;
  opacity: 0.3;
  font-size: 2rem !important;
}

/* Avatar Container */
.avatar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0 1rem;
}

.avatar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid;
}

.ring-gold {
  border-color: #FFD700;
  width: 120px;
  height: 120px;
  animation: ring-rotate 10s linear infinite;
}

@keyframes ring-rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.ring-silver {
  border-color: #C0C0C0;
}

.ring-bronze {
  border-color: #CD7F32;
}

.ring-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: inherit;
  filter: blur(10px);
  opacity: 0.5;
}

.gold-glow {
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    filter: blur(10px);
  }
  50% {
    opacity: 0.8;
    filter: blur(15px);
  }
}

.ring-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #FFD700;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    width: 100%;
    height: 100%;
    opacity: 1;
  }
  100% {
    width: 150%;
    height: 150%;
    opacity: 0;
  }
}

.avatar-image {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image .v-icon {
  color: rgba(255, 255, 255, 0.9);
}

.card-gold .avatar-image .v-icon {
  color: #FFD700;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
}

.level-indicator {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.level-gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
}

.level-silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
}

.level-bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #B16A29 100%);
}

.level-icon {
  color: rgba(255, 255, 255, 0.9);
}

.level-gold .level-icon {
  color: #000;
}

.level-text {
  font-size: 0.9rem;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
}

.level-gold .level-text {
  color: #000;
}

/* Champion Name */
.champion-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-align: center;
  margin: 0.5rem 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
}

.name-gold {
  font-size: 1.8rem;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

.champion-title {
  font-size: 0.75rem;
  color: rgba(255, 215, 0, 0.8);
  text-align: center;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-box {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.stat-box:hover {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.stat-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.stat-bar {
  position: relative;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-progress {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0.75rem;
  border-radius: 14px;
  position: relative;
  transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.stat-progress::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.stat-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent);
  border-radius: 14px 14px 0 0;
}

.progress-strength {
  background: linear-gradient(90deg, #FF4757 0%, #FF6348 50%, #FF4757 100%);
  background-size: 200% auto;
  box-shadow: 
    0 0 20px rgba(255, 71, 87, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  animation: gradient-shift 3s ease infinite;
}

.progress-endurance {
  background: linear-gradient(90deg, #00D2FF 0%, #3A7BD5 50%, #00D2FF 100%);
  background-size: 200% auto;
  box-shadow: 
    0 0 20px rgba(0, 210, 255, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  animation: gradient-shift 3s ease infinite;
}

.stat-value {
  position: relative;
  z-index: 2;
  font-size: 0.85rem;
  font-weight: 900;
  color: white;
  text-shadow: 
    1px 1px 2px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

/* Card Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-gold {
  border-top-color: rgba(255, 215, 0, 0.2);
}

.footer-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-gold .footer-text {
  color: rgba(255, 215, 0, 0.7);
}

/* Pedestal */
.pedestal {
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4));
}

.pedestal-top {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 12px 12px 0 0;
  border: 3px solid;
  border-bottom: none;
  position: relative;
  overflow: hidden;
}

.pedestal-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent);
}

.pedestal-body {
  width: 100%;
  border-left: 3px solid;
  border-right: 3px solid;
  border-bottom: 3px solid;
  border-radius: 0 0 8px 8px;
}

.pedestal-gold .pedestal-top,
.pedestal-gold .pedestal-body {
  border-color: #B8860B;
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
}

.pedestal-gold .pedestal-top {
  height: 100px;
  box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.2);
}

.pedestal-gold .pedestal-body {
  height: 40px;
  background: linear-gradient(180deg, #FFA500 0%, #B8860B 100%);
}

.pedestal-silver .pedestal-top,
.pedestal-silver .pedestal-body {
  border-color: #808080;
  background: linear-gradient(180deg, #C0C0C0 0%, #A8A8A8 100%);
}

.pedestal-silver .pedestal-top {
  height: 80px;
  box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.2);
}

.pedestal-silver .pedestal-body {
  height: 35px;
  background: linear-gradient(180deg, #A8A8A8 0%, #808080 100%);
}

.pedestal-bronze .pedestal-top,
.pedestal-bronze .pedestal-body {
  border-color: #8B5A2B;
  background: linear-gradient(180deg, #CD7F32 0%, #B16A29 100%);
}

.pedestal-bronze .pedestal-top {
  height: 60px;
  box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.2);
}

.pedestal-bronze .pedestal-body {
  height: 30px;
  background: linear-gradient(180deg, #B16A29 0%, #8B5A2B 100%);
}

.pedestal-rank {
  font-size: 3rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.7);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .podium-arena {
    gap: 1.5rem;
  }
  
  .champion-card {
    width: 260px;
  }
  
  .card-gold {
    width: 300px;
  }
}

@media (max-width: 968px) {
  .ranking-section {
    padding: 2rem 1.5rem;
  }

  .title-bottom {
    font-size: 2.8rem;
  }
  
  .podium-arena {
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }
  
  .champion-slot {
    width: 100%;
    max-width: 400px;
  }
  
  .champion-card,
  .card-gold {
    width: 100%;
    max-width: 400px;
  }
  
  .pedestal-gold .pedestal-top {
    height: 80px;
  }
  
  .pedestal-silver .pedestal-top {
    height: 70px;
  }
  
  .pedestal-bronze .pedestal-top {
    height: 60px;
  }

  .slot-first,
  .slot-second,
  .slot-third {
    animation-delay: 0.2s;
  }
}

@media (max-width: 600px) {
  .ranking-section {
    padding: 1.5rem 1rem;
  }

  .trophy-main {
    font-size: 3rem !important;
  }
  
  .title-top {
    font-size: 1.3rem;
    letter-spacing: 4px;
  }
  
  .title-bottom {
    font-size: 2rem;
    letter-spacing: 2px;
  }
  
  .hero-subtitle {
    font-size: 0.95rem;
  }

  .champion-card {
    padding: 1.5rem 1.25rem;
  }

  .card-gold {
    padding: 2rem 1.5rem;
  }
  
  .champion-name {
    font-size: 1.3rem;
  }
  
  .name-gold {
    font-size: 1.5rem;
  }

  .stat-header .v-icon {
    font-size: 16px !important;
  }

  .stat-title {
    font-size: 0.7rem;
  }

  .stat-bar {
    height: 24px;
  }

  .pedestal-rank {
    font-size: 2.5rem;
  }
}

@media (max-width: 400px) {
  .title-bottom {
    font-size: 1.6rem;
  }

  .avatar-ring {
    width: 80px !important;
    height: 80px !important;
  }

  .ring-gold {
    width: 100px !important;
    height: 100px !important;
  }

  .avatar-image .v-icon {
    font-size: 48px !important;
  }

  .card-gold .avatar-image .v-icon {
    font-size: 64px !important;
  }
}
</style>