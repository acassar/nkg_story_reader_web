<script setup lang="ts">
import type { StoryItem } from '@/class/StoryItem'
import { computed } from 'vue'

const props = defineProps<{
  storyItem: StoryItem
}>()

const isOpen = defineModel<boolean>()

const backgroundColor = computed(() => {
  return props.storyItem.nodeType === 'GOOD' ? 'green' : 'red'
})
</script>

<template>
  <Transition>
    <div :class="['end-container', backgroundColor]" v-if="isOpen">
      <div class="text">
        <span>
          {{ props.storyItem.text }}
        </span>
      </div>
      <router-link to="/">Back to Home</router-link>
    </div>
  </Transition>
</template>

<style scoped>
.end-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  font-size: 1.5rem;
  border-radius: 10px;
}

.text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.green {
  background-color: #688b58;
}

.red {
  background-color: #e54b4b;
}

.v-enter-active,
.v-leave-active {
  transition:
    opacity 2s,
    transform 2s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
