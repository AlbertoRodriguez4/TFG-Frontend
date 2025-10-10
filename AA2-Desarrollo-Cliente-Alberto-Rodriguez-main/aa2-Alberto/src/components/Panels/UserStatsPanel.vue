<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

interface User {
  id: number;
  name: string;
  email: string;
  passwordhash: string;
  level: number;
  strength: number;
  endurance: number;
  consistencystreak: number;
  gold: number;
  role: string;
}

const store = useUserStore()
const loggedUser = computed<User | null>(() => store.loggedUser)

const statList = ['strength', 'endurance', 'gold'] as const
type StatKey = typeof statList[number]

const colorMap: Record<StatKey, string> = {
  strength: '#ff4757',
  endurance: '#5352ed',
  gold: '#ffc107',
}

const iconMap: Record<StatKey, string> = {
  strength: '💪',
  endurance: '🏃',
  gold: '🪙',
}

const labelMap: Record<StatKey, string> = {
  strength: 'Fuerza',
  endurance: 'Resistencia',
  gold: 'Oro',
}
</script>

<template>
  <div v-if="loggedUser && loggedUser.role !== 'userMaster'" class="user-stats-container">
    <div class="stats-wrapper">
      <!-- Card de Perfil -->
      <div class="profile-card">
        <div class="avatar-container">
          <div class="avatar-glow"></div>
          <img src="@/assets/imgs/usuario.png" alt="Avatar" class="avatar-image" />
          <div class="level-badge">
            <span class="level-icon">⚡</span>
            <span class="level-text">LVL {{ loggedUser.level }}</span>
          </div>
        </div>
        <div class="user-info">
          <h3 class="user-name">{{ loggedUser.name }}</h3>
          <div class="streak-badge">
            <span class="streak-icon">🔥</span>
            <span class="streak-text">{{ loggedUser.consistencystreak }} días</span>
          </div>
        </div>
      </div>

      <!-- Card de Estadísticas -->
      <div class="stats-card">
        <h2 class="stats-title">
          <span class="title-icon">📊</span>
          Estadísticas
        </h2>
        <div class="stats-grid">
          <div
            v-for="stat in statList"
            :key="stat"
            class="stat-item"
          >
            <div class="stat-header">
              <span class="stat-icon">{{ iconMap[stat] }}</span>
              <span class="stat-label">{{ labelMap[stat] }}</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    width: `${Math.min(loggedUser[stat], 100)}%`,
                    backgroundColor: colorMap[stat]
                  }"
                >
                  <div class="progress-shine"></div>
                </div>
              </div>
              <span class="stat-value" :style="{ color: colorMap[stat] }">
                {{ loggedUser[stat] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-stats-container {
  width: 100%;
  padding: 1rem;
}

.stats-wrapper {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

/* Profile Card */
.profile-card {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95));
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  min-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 193, 7, 0.3);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.1) 0%, transparent 70%);
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.avatar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.4), transparent);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.avatar-image {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 4px solid #ffc107;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(255, 193, 7, 0.4);
  position: relative;
  z-index: 1;
}

.level-badge {
  background: linear-gradient(135deg, #ffc107, #ff9800);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.5);
  font-weight: bold;
  font-size: 1.2rem;
  color: #1a1a2e;
}

.level-icon {
  font-size: 1.5rem;
  animation: zap 1.5s ease-in-out infinite;
}

@keyframes zap {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.user-info {
  text-align: center;
  z-index: 1;
}

.user-name {
  color: #ffc107;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.streak-badge {
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff6b6b;
  font-weight: bold;
}

.streak-icon {
  font-size: 1.2rem;
  animation: flicker 2s ease-in-out infinite;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Stats Card */
.stats-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.95));
  border-radius: 24px;
  padding: 2rem;
  flex: 1;
  min-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 193, 7, 0.3);
}

.stats-title {
  color: #1a1a2e;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
}

.title-icon {
  font-size: 2rem;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-label {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1a1a2e;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  border-radius: 12px;
  position: relative;
  transition: width 0.5s ease;
  overflow: hidden;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  to { left: 100%; }
}

.stat-value {
  font-size: 1.4rem;
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-wrapper {
    flex-direction: column;
    gap: 1.5rem;
  }

  .profile-card,
  .stats-card {
    min-width: 100%;
  }

  .avatar-image {
    width: 120px;
    height: 120px;
  }

  .avatar-glow {
    width: 140px;
    height: 140px;
  }

  .user-name {
    font-size: 1.5rem;
  }

  .stats-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .user-stats-container {
    padding: 0.5rem;
  }

  .profile-card,
  .stats-card {
    padding: 1.5rem;
  }

  .avatar-image {
    width: 100px;
    height: 100px;
  }

  .level-badge {
    padding: 0.6rem 1rem;
    font-size: 1rem;
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-label {
    font-size: 1.1rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }
}
</style>