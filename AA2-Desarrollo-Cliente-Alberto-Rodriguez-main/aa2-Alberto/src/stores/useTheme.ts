import { ref, watch } from 'vue'

const savedTheme = localStorage.getItem('app-theme') || 'dark'
export const currentTheme = ref(savedTheme)

watch(currentTheme, (newTheme) => {
  localStorage.setItem('app-theme', newTheme)
})