<script setup lang="ts">
import { Story } from '@/class/StoryClass'
import ReaderComponentVue from '@/components/reader/ReaderComponent.vue'
import { onMounted, ref } from 'vue'
import ExampleStory from '@/stories/example/example.json'
// import CaveStory from '@/stories/cave/cave.json'

const currentStory = ref<Story>()

onMounted(() => {
  loadStory()
})

const loadStory = async () => {
  try {
    currentStory.value = new Story('Example', ExampleStory)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <ReaderComponentVue v-if="currentStory" :story="currentStory" />
</template>
