<script setup lang="ts">
import type { StoryItem } from '@/class/StoryItem'
import ButtonComponent from '../common/button/ButtonComponent.vue'

defineProps<{
  choices: StoryItem[] | undefined
}>()

defineEmits<(e: 'selectItem', choice: StoryItem) => void>()
</script>

<template>
  <ButtonComponent
    :key="choice.id"
    v-for="choice in choices"
    @click="$emit('selectItem', choice)"
  >
    <h3>{{ choice.text }}</h3>
  </ButtonComponent>
</template>

<style scoped></style>
