<script setup lang="ts">
import { removeSave } from '@/services/saveService'
import ButtonComponent from '../common/button/ButtonComponent.vue'
import type { Story } from '@/class/StoryClass'
import { ref } from 'vue'
import FactorInput from '../common/input/FactorInput.vue'

defineProps<{
  story: Story
}>()

const isOpen = defineModel<boolean>({ required: true })

const answeringSpeedTooltip =
  'Contrôle la vitesse à laquelle le personnage écrit ses réponses. Une valeur plus élevée accélère l’affichage du texte.'
const answeringDelayTooltip =
  'Définit combien de temps le personnage sera absent lors de ses tâches. Plus la valeur est élevée, plus il reviendra rapidement.'

const answeringSpeedFactor = ref(1)
const answeringDelayFactor = ref(1)

defineEmits<{
  (e: 'fullyClosed'): void
}>()
</script>

<template>
  <transition @after-leave="() => $emit('fullyClosed')" name="slide">
    <div v-if="isOpen" class="settings-container gap-3">
      <ButtonComponent @click="isOpen = false"> Retour </ButtonComponent>
      <ButtonComponent @click="() => removeSave(story)">
        Effacer la sauvegarde
      </ButtonComponent>

      <div class="flex flex-column gap-4">
        <FactorInput
          name="answering-speed"
          label="Vitesse de réponse"
          v-model="answeringSpeedFactor"
          :tooltip="answeringSpeedTooltip"
        ></FactorInput>
        <FactorInput
          name="answering-delay"
          label="Temps d’absence"
          :v-model="answeringDelayFactor"
          :tooltip="answeringDelayTooltip"
        ></FactorInput>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.5s ease-out,
    opacity 0.5s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(
    -100%
  ); /* L'élément commence ou termine hors de l'écran */
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(
    0
  ); /* L'élément est en position normale pendant l'animation */
  opacity: 1;
}
</style>
