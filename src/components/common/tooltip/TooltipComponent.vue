<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tooltipRef = ref<HTMLElement | null>(null)

defineProps<{
  tooltipText?: string
}>()

onMounted(() => {
  const tooltip = tooltipRef.value
  if (tooltip) {
    const parent = tooltip.parentElement
    if (parent) {
      const parentRect = parent.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()

      if (tooltipRect.top <= parentRect.top) {
        tooltip.style.top = '100%'
        tooltip.style.left = '50%'
        tooltip.style.transform = 'translateX(-50%)'
      } else {
        tooltip.style.bottom = '100%'
        tooltip.style.left = '50%'
        tooltip.style.transform = 'translateX(-50%)'
      }
    }
  }
})
</script>

<template>
  <div class="tooltip">
    <span ref="tooltipRef" v-if="tooltipText">{{ tooltipText }}</span>
    <slot />
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  width: 100%;
}

.tooltip span {
  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: default;
}

.tooltip:hover span {
  visibility: visible;
  opacity: 1;
}
</style>
