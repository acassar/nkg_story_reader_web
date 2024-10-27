<script setup lang="ts">
import { Story } from '@/class/StoryClass'
import ReaderComponentVue from '@/components/reader/ReaderComponent.vue'
import { ref } from 'vue'
import ExampleStory from '@/stories/example/example.json'
import ButtonComponent from './common/button/ButtonComponent.vue'
import CaveStory from '@/stories/cave/cave.json'

const currentStory = ref<Story>()
const stories: { name: string; story: Record<string, unknown> }[] = [
  {
    name: 'Example',
    story: ExampleStory,
  },
  {
    name: 'Cave',
    story: CaveStory,
  },
]

const loadStory = async (story: {
  name: string
  story: Record<string, unknown>
}) => {
  try {
    currentStory.value = new Story(story.name, story.story)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div v-if="!currentStory">
    <div class="header">
      <h1>Nkg stories</h1>
      <h2>Sélection de l'histoire</h2>
    </div>
    <ButtonComponent
      v-for="(story, index) in stories"
      :key="index"
      @click="loadStory(story)"
    >
      {{ story.name }}
    </ButtonComponent>
  </div>
  <ReaderComponentVue
    @back="() => (currentStory = undefined)"
    v-else
    :story="currentStory"
  />
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
</style>
