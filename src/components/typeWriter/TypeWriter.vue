<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  text: string | undefined
}>()
const i = ref(0)
const SPEED = 20

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
  if (!props.text) return
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
  <div class="input-container">
    <div>
      <span id="chat-input" />
      &nbsp;
    </div>
    <div>
      <v-icon :scale="1.5" name="bi-send-fill" />
    </div>
  </div>
</template>
<style scoped>
.input-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: min-content;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--vt-c-black-mute);
  columns: black;
}
</style>
