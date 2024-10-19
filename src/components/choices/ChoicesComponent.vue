<script setup lang="ts">
import type { StoryItem } from '@/class/StoryItem'

defineProps<{
  choices: StoryItem[] | undefined
}>()

defineEmits<(e: 'selectItem', choice: StoryItem) => void>()
</script>

<template>
  <button
    :key="choice.id"
    v-for="choice in choices"
    @click="$emit('selectItem', choice)"
  >
    {{ choice.text }}
  </button>
</template>

<style scoped></style>
