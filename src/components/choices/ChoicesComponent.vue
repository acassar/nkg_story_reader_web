<script setup lang="ts">
import type { StoryItem } from '@/class/StoryItem'
import ButtonComponent from '../common/button/ButtonComponent.vue'

defineProps<{
  choices: StoryItem[] | undefined
}>()

defineEmits<(e: 'selectItem', choice: StoryItem) => void>()
</script>

<template>
  <ButtonComponent
    :key="choice.id"
    v-for="choice in choices"
    @click="$emit('selectItem', choice)"
  >
    <span>{{ choice.text }}</span>
  </ButtonComponent>
</template>

<style scoped>
button {
  font-size: medium;
}

@media screen and (max-width: 800px) {
  button {
    font-size: small;
  }
}
</style>
