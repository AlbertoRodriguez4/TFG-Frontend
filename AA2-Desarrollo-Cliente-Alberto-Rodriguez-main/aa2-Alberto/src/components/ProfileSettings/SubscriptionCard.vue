<template>
  <div class="subscription-container">
    <!-- Current Plan -->
    <v-card class="settings-card plan-card" elevation="0" border>
      <v-card-title class="card-title">
        <v-icon>mdi-crown</v-icon>
        Current Plan
      </v-card-title>

      <v-divider class="card-divider" />

      <v-card-text>
        <div class="current-plan">
          <div class="plan-badge premium">PREMIUM</div>
          
          <h3 class="plan-name">Premium Plan</h3>
          <p class="plan-price">$9.99 <span class="period">/month</span></p>
          
          <div class="plan-features">
            <div class="feature">
              <v-icon size="small">mdi-check-circle</v-icon>
              <span>Unlimited workouts</span>
            </div>
            <div class="feature">
              <v-icon size="small">mdi-check-circle</v-icon>
              <span>CoachAI access</span>
            </div>
            <div class="feature">
              <v-icon size="small">mdi-check-circle</v-icon>
              <span>Calorie calculator</span>
            </div>
            <div class="feature">
              <v-icon size="small">mdi-check-circle</v-icon>
              <span>Advanced analytics</span>
            </div>
            <div class="feature">
              <v-icon size="small">mdi-check-circle</v-icon>
              <span>Priority support</span>
            </div>
          </div>

          <div class="plan-renewal">
            <p class="renewal-text">Your subscription renews on <strong>March 25, 2026</strong></p>
          </div>

          <div class="plan-actions">
            <v-btn
              variant="outlined"
              size="large"
              class="action-btn"
            >
              Upgrade Plan
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              color="error"
              class="action-btn"
            >
              Cancel Subscription
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Billing History -->
    <v-card class="settings-card" elevation="0" border>
      <v-card-title class="card-title">
        <v-icon>mdi-receipt</v-icon>
        Billing History
      </v-card-title>

      <v-divider class="card-divider" />

      <v-card-text>
        <div class="billing-table">
          <div class="table-header">
            <div class="table-col">Date</div>
            <div class="table-col">Description</div>
            <div class="table-col">Amount</div>
            <div class="table-col">Status</div>
            <div class="table-col"></div>
          </div>

          <div
            v-for="invoice in billingHistory"
            :key="invoice.id"
            class="table-row"
          >
            <div class="table-col">{{ invoice.date }}</div>
            <div class="table-col">{{ invoice.description }}</div>
            <div class="table-col">
              <strong>{{ invoice.amount }}</strong>
            </div>
            <div class="table-col">
              <v-chip
                :label="true"
                size="small"
                :color="invoice.status === 'paid' ? '#4ade80' : '#ff9500'"
                :text-color="invoice.status === 'paid' ? '#000' : '#000'"
              >
                {{ invoice.status }}
              </v-chip>
            </div>
            <div class="table-col">
              <v-btn
                icon="mdi-download"
                size="small"
                variant="text"
                class="download-btn"
              />
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Payment Method -->
    <v-card class="settings-card" elevation="0" border>
      <v-card-title class="card-title">
        <v-icon>mdi-credit-card</v-icon>
        Payment Method
      </v-card-title>

      <v-divider class="card-divider" />

      <v-card-text>
        <div class="payment-method">
          <div class="card-display">
            <div class="card-brand">💳</div>
            <div class="card-info">
              <p class="card-holder">Visa ending in 4242</p>
              <p class="card-expiry">Expires 12/2026</p>
            </div>
          </div>

          <div class="payment-actions">
            <v-btn
              variant="outlined"
              size="large"
              class="action-btn"
            >
              Update Payment Method
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              color="error"
              class="action-btn"
            >
              Remove Card
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Promo Code -->
    <v-card class="settings-card" elevation="0" border>
      <v-card-title class="card-title">
        <v-icon>mdi-ticket</v-icon>
        Promo Code
      </v-card-title>

      <v-divider class="card-divider" />

      <v-card-text>
        <div class="promo-section">
          <p class="promo-description">Have a promo code? Enter it to get a discount on your subscription.</p>
          
          <div class="promo-input-group">
            <v-text-field
              v-model="promoCode"
              placeholder="Enter promo code"
              variant="outlined"
              density="comfortable"
              class="promo-input"
            />
            <v-btn
              color="#ffcc00"
              text-color="#000"
              variant="flat"
              size="large"
              class="apply-btn"
            >
              Apply
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Subscription FAQ -->
    <v-card class="settings-card" elevation="0" border>
      <v-card-title class="card-title">
        <v-icon>mdi-help-circle</v-icon>
        Subscription FAQ
      </v-card-title>

      <v-divider class="card-divider" />

      <v-card-text>
        <div class="faq-container">
          <v-expansion-panels class="faq-panel">
            <v-expansion-panel
              v-for="(faq, index) in faqItems"
              :key="index"
            >
              <template #title>
                <span class="faq-question">{{ faq.question }}</span>
              </template>
              <template #text>
                <p class="faq-answer">{{ faq.answer }}</p>
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const promoCode = ref('')

const billingHistory = [
  {
    id: 1,
    date: 'Feb 25, 2026',
    description: 'Premium Plan - Monthly Subscription',
    amount: '$9.99',
    status: 'paid',
  },
  {
    id: 2,
    date: 'Jan 25, 2026',
    description: 'Premium Plan - Monthly Subscription',
    amount: '$9.99',
    status: 'paid',
  },
  {
    id: 3,
    date: 'Dec 25, 2025',
    description: 'Premium Plan - Monthly Subscription',
    amount: '$9.99',
    status: 'paid',
  },
  {
    id: 4,
    date: 'Nov 25, 2025',
    description: 'Premium Plan - Annual Subscription',
    amount: '$99.99',
    status: 'paid',
  },
]

const faqItems = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal for your convenience.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! New members get a 7-day free trial of the Premium plan. No credit card required to start.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
  },
  {
    question: 'What happens if my payment fails?',
    answer: 'We\'ll notify you and give you 3 days to update your payment method. Your access will continue during this time.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'If you\'re not satisfied within 14 days of purchase, we offer a full refund. No questions asked.',
  },
]
</script>

<style scoped>
.subscription-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-card {
  background: rgba(20, 20, 20, 0.5) !important;
  border: 1px solid rgba(255, 204, 0, 0.15) !important;
  border-radius: 12px;
}

.plan-card {
  border: 2px solid rgba(255, 204, 0, 0.3) !important;
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.05) 0%, rgba(255, 204, 0, 0.02) 100%) !important;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #ffcc00;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 1.5rem;
  padding-bottom: 0;
}

.card-divider {
  margin: 1rem 0;
  border-color: rgba(255, 204, 0, 0.1) !important;
}

/* Current Plan */
.current-plan {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.plan-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 900;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: fit-content;
}

.plan-badge.premium {
  background: linear-gradient(135deg, #ffcc00, #ff9900);
  color: #000;
}

.plan-name {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
}

.plan-price {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffcc00;
}

.period {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.feature :deep(.v-icon) {
  color: #4ade80;
}

.plan-renewal {
  padding: 1rem;
  border-radius: 8px;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.2);
}

.renewal-text {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.plan-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  flex: 1;
  color: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(255, 204, 0, 0.3) !important;
  font-weight: 600;
}

/* Billing Table */
.billing-table {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.table-header {
  display: grid;
  grid-template-columns: 120px 1fr 100px 100px 50px;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 204, 0, 0.05);
  border-radius: 8px 8px 0 0;
  font-weight: 700;
  color: #ffcc00;
  font-size: 0.9rem;
}

.table-row {
  display: grid;
  grid-template-columns: 120px 1fr 100px 100px 50px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 204, 0, 0.1);
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
  border-radius: 0 0 8px 8px;
}

.table-col {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.download-btn {
  color: #ffcc00 !important;
}

/* Payment Method */
.payment-method {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.1), rgba(255, 204, 0, 0.05));
  border: 1px solid rgba(255, 204, 0, 0.2);
}

.card-brand {
  font-size: 2rem;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
}

.card-holder {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
}

.card-expiry {
  margin: 0.3rem 0 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.payment-actions {
  display: flex;
  gap: 1rem;
}

/* Promo Section */
.promo-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.promo-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.promo-input-group {
  display: flex;
  gap: 1rem;
}

.promo-input {
  flex: 1;
}

.promo-input :deep(.v-field) {
  background: rgba(255, 204, 0, 0.03) !important;
  border-color: rgba(255, 204, 0, 0.15) !important;
}

.apply-btn {
  font-weight: 700;
  text-transform: uppercase;
}

/* FAQ */
.faq-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-panel :deep(.v-expansion-panel) {
  background: rgba(255, 204, 0, 0.02) !important;
  border: 1px solid rgba(255, 204, 0, 0.1) !important;
  margin-bottom: 0.8rem;
}

.faq-question {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.faq-answer {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .plan-actions {
    flex-direction: column;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr 100px;
    gap: 0.5rem;
  }

  .table-header > div:nth-child(2),
  .table-row > div:nth-child(2),
  .table-header > div:nth-child(4),
  .table-row > div:nth-child(4),
  .table-header > div:nth-child(5),
  .table-row > div:nth-child(5) {
    display: none;
  }

  .card-display {
    flex-direction: column;
    text-align: center;
  }

  .payment-actions {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .promo-input-group {
    flex-direction: column;
  }

  .plan-price {
    font-size: 2rem;
  }
}
</style>