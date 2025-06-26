import { ref } from 'vue'
import { defineStore } from 'pinia'

//TODO persister
export const useSettingsStore = defineStore('settings', () => {
  const writingSpeedFactor = ref(1)
  const awayTimeFactor = ref(1)

  const lockTimeoutCallback = ref<() => void>() //TODO: deplacer autre part pour ne pas le persister

  return { awayTimeFactor, writingSpeedFactor, lockTimeoutCallback }
})
