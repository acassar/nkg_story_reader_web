<script setup lang="ts">
import { computed } from 'vue'
import TooltipComponent from '../tooltip/TooltipComponent.vue'

const props = defineProps<{
  disabled?: boolean
}>()
defineEmits<(e: 'click') => void>()

const tooltipText = computed(() =>
  props.disabled
    ? "Une condition d'activation spécifique n'a pas été activée"
    : undefined,
)
</script>

<template>
  <TooltipComponent :tooltip-text="tooltipText">
    <button
      :disabled="disabled"
      :aria-disabled="disabled"
      @click="$emit('click')"
      :title="tooltipText"
    >
      <slot />
    </button>
  </TooltipComponent>
</template>

<style scoped>
button {
  background-color: var(--palette-secondary);
  color: var(--color-heading);
  margin: 0.2rem;
  border: solid 1px transparent;
  border-radius: 3px;
  padding: 0.5rem;
  min-height: 60px;
  width: 100%;
}

button:hover {
  cursor: pointer;
  opacity: 90%;
  border: solid 1px var(--color-background);
  border-radius: 6px;
}

button:disabled {
  background-color: var(--palette-secondary);
  opacity: 60%;
  color: var(--color-heading);
  cursor: not-allowed;
}
</style>
