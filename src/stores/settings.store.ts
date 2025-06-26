import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const writingSpeedFactor = ref(1)
  const awayTimeFactor = ref(1)

  return { awayTimeFactor, writingSpeedFactor }
})
