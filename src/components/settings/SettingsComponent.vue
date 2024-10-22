<script setup lang="ts">
import { removeSave } from '@/services/saveService'
import ButtonComponent from '../common/button/ButtonComponent.vue'
import type { Story } from '@/class/StoryClass'

defineProps<{
  story: Story
}>()
</script>

<template>
  <div class="settings-container">
    <ButtonComponent @click="() => removeSave(story)">
      Effacer la sauvegarde
    </ButtonComponent>
  </div>
</template>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
}
</style>
