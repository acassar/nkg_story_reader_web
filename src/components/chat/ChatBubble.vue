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
  animation: chatBubbleAppear 2s forwards;
}

@keyframes chatBubbleAppear {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
