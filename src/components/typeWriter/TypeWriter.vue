<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const sendContainer = ref<HTMLElement | null>()
const sendIcon = ref<HTMLElement | null>()
const screenWidth = ref(0)

const iconScale = computed(() => {
  if (screenWidth.value <= 800) return 1
  return 1.5
})

const props = defineProps<{
  text: string | undefined
}>()
const i = ref(0)
const SPEED = 20

const emit = defineEmits<(e: 'typing:end') => void>()

onMounted(() => {
  sendContainer.value = document.getElementById('send-container')
  sendIcon.value = document.getElementById('send-icon')
})

watch(
  () => props.text,
  () => {
    reset()
    typeWrite()
  },
)

onMounted(() => {
  nextTick(() => {
    window.addEventListener('resize', setScreenWidth)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setScreenWidth)
})

const setScreenWidth = () => {
  screenWidth.value = window.screen.width
}

const reset = () => {
  i.value = 0
  document.getElementById('chat-input')!.innerHTML = ''
}

const endType = () => {
  emit('typing:end')
  reset()
  sendContainer.value!.classList.remove('send-animation')
  sendIcon.value!.classList.remove('icon-animation')
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
    sendContainer.value!.classList.add('send-animation')
    sendIcon.value!.classList.add('icon-animation')
    setTimeout(endType, 500)
  }
}
</script>

<template>
  <div id="send-container" class="input-container">
    <div>
      <span id="chat-input" />
      &nbsp;
    </div>
    <div>
      <v-icon id="send-icon" :scale="iconScale" name="bi-send-fill" />
    </div>
  </div>
</template>
<style scoped>
.input-container {
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  min-height: min-content;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--vt-c-black-mute);
  columns: black;
}

.send-animation {
  animation: send 500ms forwards;
}

.icon-animation {
  animation: send-icon-animation 500ms infinite;
}

@keyframes send {
  0% {
    background-color: var(--vt-c-black-mute);
  }
  50% {
    background-color: rgb(51, 51, 51);
  }
  100% {
    background-color: var(--vt-c-black-mute);
  }
}

@keyframes send-icon-animation {
  from {
    color: var(--color-text);
  }
  to {
    color: var(--palette-primary);
  }
}
</style>
