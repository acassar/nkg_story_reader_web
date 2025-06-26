<script setup lang="ts">
import { InputText, Slider } from 'primevue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    label: string
    min?: number
    max?: number
    tooltip?: string
  }>(),
  { min: 1, max: 10 },
)

const model = defineModel<number>()

const modelLabel = computed(() => {
  if (model.value === 1) return 'Temps réel'
  if (model.value === props.max) return 'Instantané'
  return model.value?.toString()
})

const updateValue = (event: FocusEvent) => {
  const parsedValue = parseInt((event.target as HTMLInputElement).value)
  if (!isNaN(parsedValue)) model.value = parsedValue
}
</script>

<template>
  <div class="input">
    <label :for="name">{{ label }}</label>
    <InputText
      v-tooltip="tooltip"
      @blur="updateValue"
      :model-value="modelLabel"
    />
    <Slider v-tooltip="tooltip" :name :min="min" :max="max" v-model="model" />
  </div>
</template>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.input label {
  text-align: center;
}

.input > * {
  width: 15%;
}
</style>
