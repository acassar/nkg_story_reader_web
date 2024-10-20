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
.bubble {
  margin: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 1rem;
  animation: chatBubbleAppear 2s forwards;
  cursor: default;
}

.left {
  align-self: self-start;
  margin-right: 10rem;
  background-color: var(--palette-other2);
  color: #000;
}

.right {
  align-self: self-end;
  margin-left: 10rem;
  background-color: var(--palette-primary);
  color: var(--palette-other2);
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

@media screen and (max-width: 1000px) {
  .left {
    margin-right: 3rem;
  }

  .right {
    margin-left: 3rem;
  }
}
</style>
