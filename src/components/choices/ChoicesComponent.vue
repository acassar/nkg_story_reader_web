<script setup lang="ts">
import type { StoryItem } from '@/class/StoryItem'
import ButtonComponent from '../common/button/ButtonComponent.vue'
import type { Story } from '@/class/StoryClass'

const props = defineProps<{
  choices: StoryItem[] | undefined
  story: Story
}>()

defineEmits<{
  (e: 'selectItem', choice: StoryItem): void
  (e: 'fullyClosed'): void
}>()

const isDisabled = (choice: StoryItem) => {
  return !choice.isSelectable(props.story)
}
</script>

<template>
  <transition-group
    @after-leave="() => $emit('fullyClosed')"
    name="slide-fade"
    tag="div"
  >
    <ButtonComponent
      :key="choice.id"
      :disabled="isDisabled(choice)"
      v-for="(choice, index) in choices"
      @click="$emit('selectItem', choice)"
      :style="{ transitionDelay: `${index * 0.2}s` }"
    >
      <span>{{ choice.text }}</span>
    </ButtonComponent>
  </transition-group>
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1.5s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
