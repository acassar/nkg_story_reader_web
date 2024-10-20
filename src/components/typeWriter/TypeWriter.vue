<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  text: string
}>()
const i = ref(0)
const SPEED = 20

onMounted(() => {
  typeWrite()
})

const emit = defineEmits<(e: 'typing:end') => void>()

watch(
  () => props.text,
  () => {
    reset()
    typeWrite()
  },
)

const reset = () => {
  i.value = 0
  document.getElementById('chat-input')!.innerHTML = ''
}

const endType = () => {
  emit('typing:end')
  reset()
}

const typeWrite = () => {
  if (i.value < props.text.length) {
    document.getElementById('chat-input')!.innerHTML += props.text.charAt(
      i.value,
    )
    i.value++
    setTimeout(typeWrite, SPEED)
  } else {
    setTimeout(endType, 500)
  }
}
</script>

<template>
  <span id="chat-input" />
</template>

<style scoped></style>
