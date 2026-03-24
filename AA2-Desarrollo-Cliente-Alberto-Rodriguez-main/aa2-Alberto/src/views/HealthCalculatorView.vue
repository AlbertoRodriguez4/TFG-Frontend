<template>
  <div class="health-calc-container">
    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Main Content -->
    <v-container fluid class="main-content px-0"> <!-- Header -->
      <div class="calc-header">
        <h1 class="main-title">Calculadora de Salud</h1>
        <p class="main-subtitle">Descubre tu IMC y calorías personalizadas</p>
      </div>

      <!-- Calculator Container -->
      <div class="calculator-wrapper">
        <!-- BMI Section -->
        <BmiCalculatorModern @result-changed="bmiData = $event" @save="saveBMI" />

        <!-- Calories Section -->
        <CaloriesCalculatorModern :bmi-weight="bmiData.weight" :bmi-height="bmiData.height"
          @result-changed="caloriesData = $event" @save="saveCalories" />
      </div>

      <!-- History Section -->
      <HealthHistoryModern :results="allResults" @delete="deleteResult" />
    </v-container>

    <!-- Success Notification -->
    <v-snackbar v-model="showNotification" color="success" timeout="2000" location="top">
      {{ notificationMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BmiCalculatorModern from '../components/CalculadorCalorias/BmiCalculatorModern.vue'
import CaloriesCalculatorModern from '../components/CalculadorCalorias/CaloriesCalculatorModern.vue'
import HealthHistoryModern from '../components/CalculadorCalorias/HealthHistoryModern.vue'

interface HistoryItem {
  type: 'bmi' | 'calories'
  date: string
  bmi?: number
  tdee?: number
  weight?: number
  height?: number
}

interface BMIData {
  weight: number | null
  height: number | null
  bmi?: number
  category?: string
}

interface CaloriesData {
  bmr?: number
  tdee?: number
  macros?: {
    protein: number
    carbs: number
    fat: number
  }
}

// State
const bmiData = ref<BMIData>({ weight: null, height: null })
const caloriesData = ref<CaloriesData>({})
const allResults = ref<HistoryItem[]>([])
const showNotification = ref(false)
const notificationMessage = ref('')

// Load results on mount
onMounted(() => {
  loadAllResults()
})

// Save functions
const saveBMI = () => {
  if (!bmiData.value.bmi) return

  const result: HistoryItem = {
    type: 'bmi',
    date: new Date().toISOString(),
    bmi: bmiData.value.bmi,
    weight: bmiData.value.weight ?? undefined,
    height: bmiData.value.height ?? undefined,
  }

  allResults.value.unshift(result)
  saveToLocalStorage()
  notificationMessage.value = '✅ IMC guardado'
  showNotification.value = true
}

const saveCalories = () => {
  if (!caloriesData.value.tdee) return

  const result: HistoryItem = {
    type: 'calories',
    date: new Date().toISOString(),
    tdee: caloriesData.value.tdee,
  }

  allResults.value.unshift(result)
  saveToLocalStorage()
  notificationMessage.value = '✅ Cálculo guardado'
  showNotification.value = true
}

const deleteResult = (index: number) => {
  allResults.value.splice(index, 1)
  saveToLocalStorage()
}

const saveToLocalStorage = () => {
  localStorage.setItem('healthCalcResults', JSON.stringify(allResults.value))
}

const loadAllResults = () => {
  const stored = localStorage.getItem('healthCalcResults')
  if (stored) {
    try {
      allResults.value = JSON.parse(stored)
      allResults.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (e) {
      console.error('Error loading results:', e)
    }
  }
}
</script>

<style scoped>
.health-calc-container {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 15, 0.95) 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
  background-color: red;
}

/* Background Circles */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.03;
  border: 2px solid #ffcc00;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation: float 20s infinite ease-in-out;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
  animation: float 25s infinite ease-in-out reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 10%;
  animation: float 30s infinite ease-in-out;
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(30px, 30px);
  }
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.calc-header {
  text-align: center;
  margin-bottom: 3rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffcc00;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 10px rgba(255, 204, 0, 0.3);
}

.main-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0;
}

/* Calculator Wrapper */
.calculator-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .calculator-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .main-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 600px) {
  .calc-header {
    margin-bottom: 2rem;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .main-subtitle {
    font-size: 0.95rem;
  }
}

/* Snackbar Styling */
:deep(.v-snackbar__content) {
  font-weight: 700;
  font-size: 0.95rem;
}
</style>