<script setup lang="ts">
import { ref } from 'vue'

const cardNumber = ref('')
const cardHolder = ref('')
const expiryDate = ref('')
const cvv = ref('')
const isProcessing = ref(false)

const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ') : cleaned
}

const formatExpiryDate = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
  }
  return cleaned
}

const handleSubmit = () => {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    alert('¡Pago procesado con éxito!')
  }, 2000)
}
</script>

<template>
  <div class="card-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2 class="form-title">Información de pago</h2>
      <p class="form-subtitle">Tus datos están encriptados y seguros</p>
    </div>

    <!-- Card Preview -->
    <div class="card-preview">
      <div class="card-row">
        <div class="card-chip"></div>
      </div>
      <div class="card-number">{{ cardNumber || '•••• •••• •••• ••••' }}</div>
      <div class="card-footer">
        <div class="card-holder">{{ cardHolder || 'Nombre del titular' }}</div>
        <div class="card-expiry">{{ expiryDate || 'MM/YY' }}</div>
      </div>
    </div>

    <!-- Form Fields -->
    <v-form @submit.prevent="handleSubmit">
      <!-- Card Number -->
      <div class="form-group">
        <label class="form-label">Número de tarjeta</label>
        <v-text-field
          v-model="cardNumber"
          placeholder="1234 5678 9012 3456"
          maxlength="19"
          variant="outlined"
          color="#0a0a0a"
          base-color="#999999"
          class="form-input"
          @update:model-value="(val) => cardNumber = formatCardNumber(val)"
        />
      </div>

      <!-- Card Holder -->
      <div class="form-group">
        <label class="form-label">Nombre del titular</label>
        <v-text-field
          v-model="cardHolder"
          placeholder="Como aparece en la tarjeta"
          maxlength="50"
          variant="outlined"
          color="#0a0a0a"
          base-color="#999999"
          class="form-input"
        />
      </div>

      <!-- Expiry & CVV -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Vencimiento</label>
          <v-text-field
            v-model="expiryDate"
            placeholder="MM/YY"
            maxlength="5"
            variant="outlined"
            color="#0a0a0a"
            base-color="#999999"
            class="form-input"
            @update:model-value="(val) => expiryDate = formatExpiryDate(val)"
          />
        </div>

        <div class="form-group">
          <label class="form-label">CVV</label>
          <v-text-field
            v-model="cvv"
            placeholder="123"
            maxlength="4"
            type="password"
            variant="outlined"
            color="#0a0a0a"
            base-color="#999999"
            class="form-input"
            @update:model-value="(val) => cvv = val.replace(/\D/g, '')"
          />
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="payment-methods">
        <div class="method">
          <v-icon size="28">mdi-visa</v-icon>
        </div>
        <div class="method">
          <v-icon size="28">mdi-mastercard</v-icon>
        </div>
        <div class="method">
          <v-icon size="28">mdi-american-credit-card</v-icon>
        </div>
      </div>

      <!-- Submit Button -->
      <v-btn
        type="submit"
        :loading="isProcessing"
        block
        size="large"
        class="submit-btn"
      >
        Confirmar pago
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.card-form {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  min-height: 580px;
  display: flex;
  flex-direction: column;
}

/* Form Header */
.form-header {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #0a0a0a;
  letter-spacing: -0.3px;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #999999;
  margin: 0;
  font-weight: 400;
}

/* Card Preview */
.card-preview {
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-row {
  display: flex;
}

.card-chip {
  width: 48px;
  height: 32px;
  background: linear-gradient(135deg, #f0e68c 0%, #daa520 100%);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0a0a0a;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-holder {
  font-size: 0.85rem;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.card-expiry {
  font-size: 0.85rem;
  color: #666666;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0a0a0a;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input :deep(.v-field) {
  border: 1px solid #e5e5e5;
  background: #ffffff;
  transition: all 0.3s ease;
}

.form-input :deep(.v-field:hover) {
  border-color: #cccccc;
}

.form-input :deep(.v-field--focused) {
  border-color: #0a0a0a;
  box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.05);
}

.form-input :deep(input) {
  color: #0a0a0a;
  font-size: 0.95rem;
}

.form-input :deep(input::placeholder) {
  color: #cccccc;
}

/* Form Row */
.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 1.5rem;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

.method {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f5f5f5;
  color: #666666;
  transition: all 0.3s ease;
  cursor: pointer;
}

.method:hover {
  background: #eeeeee;
  color: #0a0a0a;
}

/* Submit Button */
.submit-btn {
  background: #0a0a0a !important;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: 0;
  border-radius: 8px !important;
  transition: all 0.3s ease;
  margin-top: auto;
}

.submit-btn:hover {
  background: #333333 !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 600px) {
  .card-form {
    padding: 1.5rem;
    min-height: auto;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-row .form-group {
    margin-bottom: 1.5rem;
  }

  .card-number {
    font-size: 1.2rem;
    letter-spacing: 1px;
  }

  .payment-methods {
    flex-direction: column;
    gap: 0.5rem;
  }

  .method {
    width: 100%;
  }
}
</style>