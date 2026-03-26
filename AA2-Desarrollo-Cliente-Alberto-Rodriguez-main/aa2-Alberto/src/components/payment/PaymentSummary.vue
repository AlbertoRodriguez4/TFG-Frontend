<script setup lang="ts">
import { computed } from 'vue'

interface PlanItem {
  name: string
  period: string
  price: number
  originalPrice: number
  features: string[]
}

const selectedPlan = computed<PlanItem>(() => ({
  name: 'Plan Premium',
  period: 'Mensual',
  price: 29.99,
  originalPrice: 49.99,
  features: [
    'Acceso ilimitado a ejercicios',
    'Rutinas personalizadas',
    'Analytics de progreso',
    'Soporte 24/7',
    'Comunidad exclusiva'
  ]
}))

const discount = computed(() => selectedPlan.value.originalPrice - selectedPlan.value.price)
const discountPercentage = computed(() =>
  Math.round((discount.value / selectedPlan.value.originalPrice) * 100)
)
</script>

<template>
  <div class="summary">
    <!-- Summary Header -->
    <div class="summary-header">
      <h2 class="summary-title">Resumen de compra</h2>
      <p class="summary-subtitle">Lo que estás adquiriendo hoy</p>
    </div>

    <!-- Plan Card -->
    <div class="plan-card">
      <!-- Discount Badge -->
      <div class="discount-badge">
        <span class="discount-text">Ahorra {{ discountPercentage }}%</span>
      </div>

      <!-- Plan Content -->
      <div class="plan-content">
        <h3 class="plan-name">{{ selectedPlan.name }}</h3>
        <p class="plan-period">{{ selectedPlan.period }}</p>

        <!-- Pricing -->
        <div class="pricing">
          <div class="original-price">${{ selectedPlan.originalPrice.toFixed(2) }}</div>
          <div class="current-price">${{ selectedPlan.price.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Features -->
      <div class="features">
        <div class="feature" v-for="(feature, index) in selectedPlan.features" :key="index">
          <v-icon size="18" color="#0a0a0a">mdi-check</v-icon>
          <span>{{ feature }}</span>
        </div>
      </div>
    </div>

    <!-- Order Breakdown -->
    <div class="order-breakdown">
      <div class="breakdown-row">
        <span class="breakdown-label">Subtotal</span>
        <span class="breakdown-value">${{ selectedPlan.originalPrice.toFixed(2) }}</span>
      </div>

      <div class="breakdown-row discount-row">
        <span class="breakdown-label">Descuento</span>
        <span class="breakdown-value">-${{ discount.toFixed(2) }}</span>
      </div>

      <div class="breakdown-divider"></div>

      <div class="breakdown-row total-row">
        <span class="breakdown-label">Total a pagar</span>
        <span class="breakdown-value">${{ selectedPlan.price.toFixed(2) }}</span>
      </div>

      <p class="payment-period">/mes, cancela cuando quieras</p>
    </div>

    <!-- Guarantee -->
    <div class="guarantee">
      <div class="guarantee-icon">
        <v-icon size="28">mdi-shield-check</v-icon>
      </div>
      <div class="guarantee-text">
        <div class="guarantee-title">Garantía de 30 días</div>
        <div class="guarantee-desc">Reembolso completo sin preguntas</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  min-height: 580px;
  display: flex;
  flex-direction: column;
}

/* Summary Header */
.summary-header {
  margin-bottom: 2rem;
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #0a0a0a;
  letter-spacing: -0.3px;
}

.summary-subtitle {
  font-size: 0.9rem;
  color: #999999;
  margin: 0;
  font-weight: 400;
}

/* Plan Card */
.plan-card {
  position: relative;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

/* Discount Badge */
.discount-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #0a0a0a;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.discount-text {
  display: block;
}

/* Plan Content */
.plan-content {
  text-align: center;
  margin-bottom: 2rem;
}

.plan-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0a0a0a;
  margin: 0 0 0.25rem;
  letter-spacing: -0.3px;
}

.plan-period {
  font-size: 0.85rem;
  color: #999999;
  margin: 0 0 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* Pricing */
.pricing {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.original-price {
  font-size: 1rem;
  color: #cccccc;
  text-decoration: line-through;
  font-weight: 500;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #0a0a0a;
}

/* Features */
.features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e5e5;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #666666;
  line-height: 1.5;
}

.feature :deep(.v-icon) {
  margin-top: 2px;
  flex-shrink: 0;
}

/* Order Breakdown */
.order-breakdown {
  margin-bottom: 2rem;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  font-size: 0.95rem;
}

.breakdown-label {
  color: #666666;
  font-weight: 500;
}

.breakdown-value {
  color: #0a0a0a;
  font-weight: 600;
}

.breakdown-row.discount-row .breakdown-value {
  color: #0a0a0a;
}

.breakdown-divider {
  height: 1px;
  background: #e5e5e5;
  margin: 1rem 0;
}

.breakdown-row.total-row {
  padding: 1rem 0;
  border-top: 2px solid #0a0a0a;
  font-size: 1.1rem;
  font-weight: 700;
}

.breakdown-row.total-row .breakdown-value {
  font-size: 1.3rem;
}

.payment-period {
  font-size: 0.8rem;
  color: #999999;
  margin: 0.5rem 0 0;
  text-align: center;
  font-weight: 500;
}

/* Guarantee */
.guarantee {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem;
  margin-top: auto;
}

.guarantee-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0a0a;
  flex-shrink: 0;
  border: 1px solid #e5e5e5;
}

.guarantee-text {
  flex: 1;
}

.guarantee-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0a0a0a;
  margin-bottom: 0.2rem;
}

.guarantee-desc {
  font-size: 0.8rem;
  color: #999999;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .summary {
    position: sticky;
    top: 2rem;
  }
}

@media (max-width: 600px) {
  .summary {
    padding: 1.5rem;
    position: static;
    min-height: auto;
  }

  .plan-card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .current-price {
    font-size: 1.8rem;
  }

  .breakdown-row.total-row .breakdown-value {
    font-size: 1.1rem;
  }

  .discount-badge {
    right: 12px;
    top: -10px;
  }
}
</style>