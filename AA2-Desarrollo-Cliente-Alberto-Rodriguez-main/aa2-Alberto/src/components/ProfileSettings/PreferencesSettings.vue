<template>
  <v-card class="settings-card" elevation="0" border>
    <v-card-title class="card-title">
      <v-icon>mdi-palette</v-icon>
      Preferences
    </v-card-title>

    <v-divider class="card-divider" />

    <v-card-text>
      <div class="preferences-container">
        <div class="preference-section">
          <h3 class="section-title">Theme & Display</h3>
          
          <div class="preference-group">
            <label class="form-label">Theme</label>
            <div class="theme-selector">
              <div
                v-for="theme in themeOptions"
                :key="theme.id"
                class="theme-option"
                :class="{ active: currentTheme === theme.id }"
                @click="currentTheme = theme.id"
              >
                <div class="theme-preview" :style="{ background: theme.color }"></div>
                <span class="theme-name">{{ theme.label }}</span>
              </div>
            </div>
          </div>

          <div class="preference-group">
            <label class="form-label">Font Size</label>
            <div class="slider-group">
              <v-slider
                v-model="fontSize"
                :min="12"
                :max="18"
                step="1"
                class="size-slider"
                thumb-label="always"
              />
              <span class="size-preview" :style="{ fontSize: fontSize + 'px' }">Aa</span>
            </div>
          </div>
        </div>

      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { currentTheme } from '@/stores/useTheme' // Ajusta la ruta según tu proyecto
const fontSize = ref(14)

const themeOptions = [
  { id: 'dark', label: 'Dark', color: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' },
  { id: 'light', label: 'Light', color: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)' },
  { id: 'auto', label: 'Auto', color: 'linear-gradient(135deg, #ffffff 0%, #000000 100%)' },
]
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

.preferences-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preference-section {
  padding: 1rem 0;
}

.section-title {
  margin: 0 0 1rem 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preference-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
}

/* Theme Selector */
.theme-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 204, 0, 0.02);
}

.theme-option:hover {
  border-color: rgba(255, 204, 0, 0.3);
  background: rgba(255, 204, 0, 0.05);
}

.theme-option.active {
  border-color: #ffcc00;
  background: rgba(255, 204, 0, 0.1);
}

.theme-preview {
  width: 100%;
  height: 60px;
  border-radius: 6px;
  border: 1px solid rgba(255, 204, 0, 0.2);
}

.theme-name {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  font-size: 0.85rem;
}

/* Font Size */
.slider-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.size-slider {
  flex: 1;
}

.size-slider :deep(.v-slider__track) {
  background: rgba(255, 204, 0, 0.3) !important;
}

.size-slider :deep(.v-slider__thumb) {
  background: #ffcc00 !important;
}

.size-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  color: #ffcc00;
  font-weight: 900;
  background: rgba(255, 204, 0, 0.05);
  border: 1px solid rgba(255, 204, 0, 0.15);
  border-radius: 8px;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .theme-selector {
    grid-template-columns: 1fr 1fr;
  }

  .slider-group {
    flex-direction: column;
  }
}
</style>