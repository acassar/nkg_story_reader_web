<script setup lang="ts">
defineEmits<(e: 'click') => void>()
</script>

<template>
  <button @click="$emit('click')">
    <slot />
  </button>
</template>

<style scoped>
button {
  background-color: var(--palette-primary);
  color: white;
  margin: 0.2rem;
  border: solid 1px transparent;
  border-radius: 3px;
  padding: 0.5rem;
  min-height: 60px;
}

button:hover {
  cursor: pointer;
  opacity: 90%;
  border: solid 1px var(--color-background);
  border-radius: 6px;
}
</style>
