<script setup lang="ts">
import type { StoryItem } from '@/class/StoryItem'

defineProps<{
  storyItem: StoryItem
  position: 'left' | 'right'
}>()
</script>

<template>
  <span :class="['bubble', position]">{{ storyItem.text }}</span>
</template>

<style scoped>
.left {
  align-self: self-start;
  margin-right: 10rem !important;
  background-color: brown;
}

.right {
  align-self: self-end;
  margin-left: 10rem !important;
  background-color: cornflowerblue;
}

.bubble {
  margin: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  color: white;
}
</style>
