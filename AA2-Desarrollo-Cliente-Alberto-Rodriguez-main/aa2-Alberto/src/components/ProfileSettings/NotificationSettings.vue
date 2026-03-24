<template>
  <v-card class="settings-card" elevation="0" border>
    <v-card-title class="card-title">
      <v-icon>mdi-bell</v-icon>
      Notification Preferences
    </v-card-title>

    <v-divider class="card-divider" />

    <v-card-text>
      <div class="notifications-container">
        
        <div class="notification-section">
          <h3 class="section-title">App Alerts</h3>
          <p class="section-subtitle mb-4 text-medium-emphasis">Choose which notifications you want to receive to stay updated without distractions.</p>
          
          <div class="notification-item">
            <div class="item-content">
              <p class="item-title">Inactivity Reminder</p>
              <p class="item-description d-flex align-center flex-wrap gap-2">
                Notify me if I haven't logged a workout in 
                <v-text-field
                  v-model.number="notifs.inactivityDays"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  min="1"
                  max="30"
                  class="inline-input"
                  :disabled="!notifs.inactivityEnabled"
                />
                days
              </p>
            </div>
            <v-switch
              v-model="notifs.inactivityEnabled"
              color="#ffcc00"
              class="toggle-switch"
              hide-details
            />
          </div>

          <div class="notification-item">
            <div class="item-content">
              <p class="item-title">Room Activity</p>
              <p class="item-description">Notify me when creating or joining a training room</p>
            </div>
            <v-switch
              v-model="notifs.rooms"
              color="#ffcc00"
              class="toggle-switch"
              hide-details
            />
          </div>

          <div class="notification-item">
            <div class="item-content">
              <p class="item-title">Purchase Receipts</p>
              <p class="item-description">Confirmations when I buy an item in the store</p>
            </div>
            <v-switch
              v-model="notifs.purchases"
              color="#ffcc00"
              class="toggle-switch"
              hide-details
            />
          </div>

          <div class="notification-item">
            <div class="item-content">
              <p class="item-title">Subscription Expiry</p>
              <p class="item-description">Alert me before my Premium Plan expires</p>
            </div>
            <v-switch
              v-model="notifs.premium"
              color="#ffcc00"
              class="toggle-switch"
              hide-details
            />
          </div>

        </div>

        <div class="form-actions">
          <v-btn
            color="#ffcc00"
            text-color="#000"
            variant="flat"
            size="large"
            class="save-btn"
            :loading="isSaving"
            @click="savePreferences"
          >
            <v-icon start>mdi-check</v-icon>
            Save Preferences
          </v-btn>
          <v-btn
            variant="outlined"
            size="large"
            class="reset-btn"
            @click="resetDefaults"
            :disabled="isSaving"
          >
            Reset to Default
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isSaving = ref(false)

// Estado centralizado de las notificaciones
const notifs = ref({
  inactivityEnabled: true,
  inactivityDays: 3,
  rooms: true,
  purchases: true,
  premium: true
})

// Función para guardar
const savePreferences = async () => {
  isSaving.value = true
  try {
    // Simulación de guardado en API
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('Saved preferences:', notifs.value)
  } catch (error) {
    console.error('Error saving:', error)
  } finally {
    isSaving.value = false
  }
}

// Función para resetear
const resetDefaults = () => {
  notifs.value = {
    inactivityEnabled: true,
    inactivityDays: 3,
    rooms: true,
    purchases: true,
    premium: true
  }
}
</script>

<style scoped>
.settings-card {
  background: rgba(20, 20, 20, 0.5) !important;
  border: 1px solid rgba(255, 204, 0, 0.15) !important;
  border-radius: 12px;
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

.notifications-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-section {
  padding: 1rem 0;
}

.section-title {
  margin: 0 0 0.5rem 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 204, 0, 0.1);
  background: rgba(255, 204, 0, 0.02);
  margin-bottom: 0.8rem;
  transition: all 0.2s ease;
}

.notification-item:hover {
  border-color: rgba(255, 204, 0, 0.2);
  background: rgba(255, 204, 0, 0.04);
}

.item-content {
  flex: 1;
}

.item-title {
  margin: 0 0 0.3rem 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
}

.item-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

/* Estilo especial para el input de días integrado en el texto */
.inline-input {
  max-width: 70px;
  margin: 0 4px;
}
.inline-input :deep(.v-field__input) {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  min-height: 32px !important;
  color: #ffcc00 !important;
  font-weight: bold;
  text-align: center;
}
.inline-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.toggle-switch {
  flex-shrink: 0;
  margin-left: 1rem;
}

.toggle-switch :deep(.v-switch__track) {
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Action Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 204, 0, 0.1);
}

.save-btn {
  flex: 1;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reset-btn {
  flex: 1;
  color: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(255, 204, 0, 0.3) !important;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 600px) {
  .notification-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .toggle-switch {
    width: 100%;
    margin-left: 0;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn,
  .reset-btn {
    flex: 1;
  }
}
</style>