<script setup lang="ts">
import { usePlanStore } from '@/stores/PlanStore'

const store = usePlanStore()
store.fetchPlan()

const advantages = ['planCustomization', 'coachTracking', 'premiumAccess']

// Colores y características por tier
const tierColors = [
  { primary: '#00ff88', secondary: '#00d9ff', glow: 'rgba(0, 255, 136, 0.4)', badge: 'BASIC' },
  { primary: '#00d9ff', secondary: '#8b5cf6', glow: 'rgba(0, 217, 255, 0.4)', badge: 'PRO' },
  { primary: '#ffcc00', secondary: '#ff6b9d', glow: 'rgba(255, 204, 0, 0.4)', badge: 'PREMIUM' },
  { primary: '#ff6b9d', secondary: '#ff0080', glow: 'rgba(255, 107, 157, 0.5)', badge: 'ELITE' }
]

function getTierStyle(index: number) {
  return tierColors[index % tierColors.length]
}
</script>

<template>
  <div class="plans-wrapper">
    <v-container class="py-12 planes-container" fluid>
      <!-- Header Section -->
      <div class="plans-header">
        <div class="header-icon">
          <v-icon size="50" color="#00ff88">mdi-crown</v-icon>
        </div>
        <h1 class="plans-title">Elige Tu Plan</h1>
        <p class="plans-subtitle">Desbloquea tu máximo potencial con nuestros planes premium</p>
      </div>

      <!-- Plans Grid -->
      <v-row justify="center" align="stretch" class="plans-grid">
        <v-col
          v-for="(plan, index) in store.plan"
          :key="plan.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <div 
            class="plan-card"
            :class="{ 'featured': index === 2 }"
            :style="{
              '--tier-primary': getTierStyle(index).primary,
              '--tier-secondary': getTierStyle(index).secondary,
              '--tier-glow': getTierStyle(index).glow
            }"
          >
            <!-- Featured Badge -->
            <div v-if="index === 2" class="featured-badge">
              <v-icon size="16" class="mr-1">mdi-star</v-icon>
              MÁS POPULAR
            </div>

            <!-- Tier Badge -->
            <div class="tier-badge" :style="{ background: `linear-gradient(135deg, ${getTierStyle(index).primary}, ${getTierStyle(index).secondary})` }">
              {{ getTierStyle(index).badge }}
            </div>

            <!-- Card Content -->
            <div class="card-inner">
              <!-- Title -->
              <div class="plan-header">
                <h2 class="plan-name">
                  {{ $t('plan de tier') }} {{ plan.id }}
                </h2>
                <p class="plan-description">{{ plan.description }}</p>
              </div>

              <!-- Price Section -->
              <div class="price-section">
                <div class="price-container">
                  <span class="currency">€</span>
                  <span class="price-amount">30</span>
                  <span class="price-period">/mes</span>
                </div>
              </div>

              <!-- Advantages List -->
              <div class="advantages-section">
                <h3 class="advantages-title">
                  <v-icon size="20" class="mr-2" :color="getTierStyle(index).primary">mdi-check-decagram</v-icon>
                  {{ $t('ventajas') }}
                </h3>

                <div class="advantages-list">
                  <div 
                    v-for="(item, idx) in advantages" 
                    :key="idx"
                    class="advantage-item"
                  >
                    <div class="advantage-icon">
                      <v-icon size="18" :color="getTierStyle(index).primary">mdi-check-circle</v-icon>
                    </div>
                    <span class="advantage-text">{{ $t(item) }}</span>
                  </div>
                </div>
              </div>

              <!-- CTA Button -->
              <v-btn
                block
                size="large"
                class="cta-button"
                elevation="0"
              >
                <v-icon class="mr-2">mdi-rocket-launch</v-icon>
                Comenzar Ahora
              </v-btn>

              <!-- Additional Info -->
              <p class="terms-text">
                Sin compromiso • Cancela cuando quieras
              </p>
            </div>

            <!-- Decorative Elements -->
            <div class="card-glow"></div>
            <div class="card-shine"></div>
          </div>
        </v-col>
      </v-row>

      <!-- Bottom Info -->
      <div class="bottom-info">
        <v-icon size="24" color="#00ff88" class="mr-2">mdi-shield-check</v-icon>
        <span>Todos los planes incluyen garantía de satisfacción de 30 días</span>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.plans-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
  padding: 2rem 0;
}

.planes-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Section */
.plans-header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInDown 0.8s ease-out;
}

.header-icon {
  display: inline-flex;
  padding: 1.5rem;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(0, 255, 136, 0.3);
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.plans-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  background: linear-gradient(135deg, #00ff88 0%, #00d9ff 50%, #ffcc00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.plans-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  margin: 0;
}

/* Plans Grid */
.plans-grid {
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Plan Card */
.plan-card {
  position: relative;
  background: linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%);
  border-radius: 24px;
  padding: 2rem;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.plan-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--tier-primary), var(--tier-secondary));
  opacity: 0.8;
}

.plan-card:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: var(--tier-primary);
  box-shadow: 
    0 20px 60px var(--tier-glow),
    0 0 0 1px var(--tier-primary) inset;
}

.plan-card.featured {
  transform: scale(1.05);
  border-color: var(--tier-primary);
  box-shadow: 0 15px 50px var(--tier-glow);
}

.plan-card.featured:hover {
  transform: translateY(-12px) scale(1.08);
}

/* Featured Badge */
.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #ffcc00, #ff6b9d);
  color: #000;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  animation: badgePulse 2s ease-in-out infinite;
  z-index: 10;
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 204, 0, 0);
  }
}

/* Tier Badge */
.tier-badge {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px var(--tier-glow);
}

/* Card Inner */
.card-inner {
  position: relative;
  z-index: 2;
}

/* Plan Header */
.plan-header {
  margin-bottom: 2rem;
}

.plan-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plan-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

/* Price Section */
.price-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.price-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
}

.currency {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--tier-primary);
  align-self: flex-start;
  margin-top: 0.5rem;
}

.price-amount {
  font-size: 3.5rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.price-period {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  align-self: flex-end;
  margin-bottom: 0.5rem;
}

/* Advantages Section */
.advantages-section {
  margin-bottom: 2rem;
}

.advantages-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.advantages-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.advantage-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.advantage-item:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(5px);
}

.advantage-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.advantage-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 500;
}

/* CTA Button */
.cta-button {
  background: linear-gradient(135deg, var(--tier-primary), var(--tier-secondary)) !important;
  color: #000 !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 12px !important;
  padding: 1.5rem !important;
  margin-bottom: 1rem;
  box-shadow: 0 8px 24px var(--tier-glow);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px var(--tier-glow);
}

/* Terms Text */
.terms-text {
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

/* Decorative Elements */
.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--tier-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.plan-card:hover .card-glow {
  opacity: 0.3;
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.plan-card:hover .card-shine {
  left: 100%;
}

/* Bottom Info */
.bottom-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* Responsive */
@media (max-width: 960px) {
  .plans-grid {
    gap: 1.5rem;
  }

  .plan-card.featured {
    transform: scale(1);
  }

  .plan-card.featured:hover {
    transform: translateY(-12px) scale(1.02);
  }
}

@media (max-width: 600px) {
  .plans-wrapper {
    padding: 1rem 0;
  }

  .plans-header {
    margin-bottom: 2rem;
  }

  .plan-card {
    padding: 1.5rem;
  }

  .price-amount {
    font-size: 2.5rem;
  }

  .featured-badge {
    font-size: 0.65rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>