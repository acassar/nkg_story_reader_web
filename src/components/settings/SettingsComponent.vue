<script setup lang="ts">
import { removeSave } from '@/services/saveService'
import ButtonComponent from '../common/button/ButtonComponent.vue'
import type { Story } from '@/class/StoryClass'

defineProps<{
  story: Story
  isOpen: boolean
}>()

defineEmits<{
  (e: 'fullyClosed'): void
}>()
</script>

<template>
  <transition @after-leave="() => $emit('fullyClosed')" name="slide">
    <div v-if="isOpen" class="settings-container">
      <ButtonComponent @click="() => removeSave(story)">
        Effacer la sauvegarde
      </ButtonComponent>
    </div>
  </transition>
</template>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
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
