<template>
  <div class="app-root">

    <div class="chat-shell">

      <!-- Sidebar -->
      <ChatSidebar :open="sidebarOpen" />

      <!-- Main column -->
      <div class="main">
        <ChatHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

        <ChatFeed :messages="messages" @send="handleSend" />

        <ChatComposer :disabled="isLoading" :show-quick-prompts="messages.length === 0" @send="handleSend" />
      </div>

    </div>

    <!-- Mobile backdrop: closes sidebar on outside tap -->
    <div class="backdrop" :class="{ 'backdrop--on': sidebarOpen }" @click="sidebarOpen = false" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChatSidebar from '../../components/CoachAI/ChatSidebar.vue'
import ChatHeader from '../../components/CoachAI/ChatHeader.vue'
import ChatFeed from '../../components/CoachAI/ChatFeed.vue'
import ChatComposer from '../../components/CoachAI/ChatComposer.vue'

/* ── State ── */
const messages = ref([])
const isLoading = ref(false)
const sidebarOpen = ref(false)

/* ── Helpers ── */
const now = () =>
  new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

const buildHistory = () =>
  messages.value
    .filter(m => !m.isTyping)
    .map(m => ({ role: m.role, content: m.text }))

/* ── Extraer Contexto del Usuario ── */
const getUserContext = () => {
  let contextText = "";
  try {
    // 1. Recuperamos los datos de memoria (ajusta 'localStorage' si usas Pinia/Vuex)
    const rawBMI = localStorage.getItem('lastBMIResult') || '{}';
    const rawHealth = localStorage.getItem('healthCalcResults') || '[]';

    // 2. Parseamos a objetos JS
    const bmiData = JSON.parse(rawBMI);
    const healthData = JSON.parse(rawHealth);

    // 3. Buscamos las calorías (TDEE) en el array de resultados
    const caloriesEntry = Array.isArray(healthData)
      ? healthData.find(item => item.type === 'calories')
      : null;

    // 4. Construimos el texto que leerá la IA
    contextText = `
    
    --- INFORMACIÓN FÍSICA DEL USUARIO ---
    Ten en cuenta estos datos actuales del usuario para personalizar tus respuestas:
    - Peso: ${bmiData.weight || 'No especificado'} kg
    - Altura: ${bmiData.height || 'No especificada'} cm
    - IMC: ${bmiData.bmi ? bmiData.bmi.toFixed(2) : 'No especificado'} (${bmiData.category || ''})
    - Calorías de mantenimiento (TDEE): ${caloriesEntry?.tdee || 'No especificadas'} kcal.
    `;
  } catch (error) {
    console.warn("No se pudieron cargar los datos físicos del usuario para el chatbot", error);
  }
  return contextText;
}

/* ── Send message ── */
async function handleSend(text) {
  const t = text?.trim()
  if (!t || isLoading.value) return

  // Add user message
  messages.value.push({ id: Date.now(), role: 'user', text: t, time: now() })

  // Add typing placeholder
  isLoading.value = true
  const typingId = Date.now() + 1
  messages.value.push({ id: typingId, role: 'assistant', isTyping: true, time: '' })

  // Juntamos tu prompt original con los datos físicos extraídos
  const systemPrompt = `Eres CoachAI, un entrenador personal y nutricionista virtual experto, amigable y motivador.
Respondes ÚNICAMENTE preguntas sobre actividad física, entrenamiento, nutrición deportiva, recuperación muscular y bienestar físico.
Si alguien pregunta algo fuera de estos temas, redirige amablemente al fitness.
Tono: energético, motivador, cercano. Usa **negritas** para puntos clave.
Listas con "• ". Respuestas concisas pero completas. Siempre en español.` + getUserContext();

  try {
    // Ejemplo usando la API gratuita de Groq (formato estándar OpenAI)
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', messages: [
          { role: 'system', content: systemPrompt },
          ...buildHistory()
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    const data = await res.json()
    // La respuesta en Groq/OpenAI viene en choices[0].message.content
    const reply = data.choices?.[0]?.message?.content || 'No pude procesar tu mensaje. Inténtalo de nuevo.'

    messages.value = messages.value.filter(m => m.id !== typingId)
    messages.value.push({ id: Date.now() + 2, role: 'assistant', text: reply, time: now() })

  } catch (err) {
    console.error(err)
    messages.value = messages.value.filter(m => m.id !== typingId)
    messages.value.push({
      id: Date.now() + 2,
      role: 'assistant',
      text: 'Error de conexión. Verifica tu configuración e inténtalo de nuevo.',
      time: now()
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
  font-family: 'DM Sans', 'Segoe UI', system-ui, sans-serif;
}

body {
  background: #f0ebe3;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

:root {
  --c-bg: #faf8f5;
  --c-surface: #ffffff;
  --c-sidebar: #1c1917;
  --c-border: #e8e2da;
  --c-text: #1c1917;
  --c-muted: #78716c;
  --c-faint: #a8a29e;
  --c-accent: #e85d26;
  --c-accent2: #f97316;
  --c-user-text: #ffffff;
  --r-sm: 8px;
  --r-md: 14px;
  --r-lg: 20px;
  --r-xl: 26px;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {

  0%,
  80%,
  100% {
    opacity: .25;
    transform: scale(.75);
  }

  40% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<style scoped>

.app-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
}

.chat-shell {
  display: flex;
  width: min(1040px, 100vw);
  height: min(800px, 100vh);
  background: var(--c-bg);
  border-radius: 28px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, .06),
    0 32px 80px rgba(0, 0, 0, .18),
    0 8px 24px rgba(0, 0, 0, .1);
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--c-surface);
}

/* Mobile backdrop */
.backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  z-index: 99;
  backdrop-filter: blur(2px);
}

.backdrop--on {
  display: block;
}

@media (min-width: 700px) {
  .backdrop {
    display: none !important;
  }
}
</style>