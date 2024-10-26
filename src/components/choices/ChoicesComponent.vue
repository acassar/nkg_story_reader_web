<script setup lang="ts">
import type { StoryItem } from '@/class/StoryItem'
import ButtonComponent from '../common/button/ButtonComponent.vue'
import type { Story } from '@/class/StoryClass'

const props = defineProps<{
  choices: StoryItem[] | undefined
  story: Story
}>()

defineEmits<(e: 'selectItem', choice: StoryItem) => void>()

const isDisabled = (choice: StoryItem) => {
  return !choice.isSelectable(props.story)
}
</script>

<template>
  <ButtonComponent
    :key="choice.id"
    :disabled="isDisabled(choice)"
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
