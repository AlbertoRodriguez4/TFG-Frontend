<script setup lang="ts">
import CreditCardForm from '@/components/payment/CreditCardForm.vue'
import PaymentSummary from '@/components/payment/PaymentSummary.vue'
</script>

<template>
  <div class="checkout">
    <v-container class="checkout-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <h1 class="page-title">Completa tu compra</h1>
          <p class="page-subtitle">Ingresa tus datos de pago para acceder inmediatamente</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-section">
        <v-row class="payment-grid" align="stretch">
          <v-col cols="12" lg="7">
            <CreditCardForm />
          </v-col>

          <v-col cols="12" lg="5">
            <PaymentSummary />
          </v-col>
        </v-row>
      </div>

      <!-- Footer Trust Section -->
      <div class="footer-trust">
        <div class="trust-item">
          <div class="trust-icon">
            <v-icon size="24">mdi-shield-check</v-icon>
          </div>
          <div class="trust-text">
            <div class="trust-title">Pago seguro</div>
            <div class="trust-desc">Encriptado con SSL 256-bit</div>
          </div>
        </div>

        <div class="trust-divider"></div>

        <div class="trust-item">
          <div class="trust-icon">
            <v-icon size="24">mdi-undo</v-icon>
          </div>
          <div class="trust-text">
            <div class="trust-title">Garantía 30 días</div>
            <div class="trust-desc">Reembolso sin preguntas</div>
          </div>
        </div>

        <div class="trust-divider"></div>

        <div class="trust-item">
          <div class="trust-icon">
            <v-icon size="24">mdi-lightning-bolt</v-icon>
          </div>
          <div class="trust-text">
            <div class="trust-title">Acceso inmediato</div>
            <div class="trust-desc">Actívate al instante</div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.checkout {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  color: #0a0a0a;
}

.checkout-container {
  max-width: 1400px;
  padding: 4rem 2rem;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 5rem;
  padding: 2rem 0;
}

.header-content {
  max-width: 700px;
  margin: 0 auto;
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin: 0 0 1rem;
  letter-spacing: -0.5px;
  color: #0a0a0a;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666666;
  margin: 0;
  font-weight: 400;
  line-height: 1.6;
}

/* Content Section */
.content-section {
  margin-bottom: 5rem;
}

.payment-grid {
  gap: 3rem;
  display: flex;
  align-items: stretch;
}

.payment-grid .v-col {
  display: flex;
  flex-direction: column;
}

.payment-grid .v-col > * {
  height: 100%;
}

/* Footer Trust Section */
.footer-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 3rem 0;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  flex-wrap: wrap;
}

.trust-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 0 1 auto;
}

.trust-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0a0a;
  flex-shrink: 0;
}

.trust-text {
  text-align: left;
}

.trust-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0a0a0a;
  margin-bottom: 0.25rem;
}

.trust-desc {
  font-size: 0.85rem;
  color: #999999;
}

.trust-divider {
  width: 1px;
  height: 40px;
  background: #e5e5e5;
}

/* Responsive */
@media (max-width: 960px) {
  .checkout-container {
    padding: 3rem 1.5rem;
  }

  .header-section {
    margin-bottom: 3rem;
  }

  .content-section {
    margin-bottom: 3rem;
  }

  .footer-trust {
    gap: 2rem;
    flex-direction: column;
    padding: 2rem 0;
  }

  .trust-divider {
    display: none;
  }

  .trust-item {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .checkout-container {
    padding: 2rem 1rem;
  }

  .header-section {
    margin-bottom: 2.5rem;
    padding: 1rem 0;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .content-section {
    margin-bottom: 2.5rem;
  }

  .payment-grid {
    gap: 1.5rem;
  }
}
</style>