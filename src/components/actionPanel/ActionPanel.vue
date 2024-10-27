<script setup lang="ts">
import type { Story } from '@/class/StoryClass'
import ChoicesComponent from '../choices/ChoicesComponent.vue'
import StoryEndComponent from '../endings/StoryEndComponent.vue'
import SettingsComponent from '../settings/SettingsComponent.vue'
import type { StoryItem } from '@/class/StoryItem'
import { computed } from 'vue'
import { StoryService } from '@/services/storyService'

const props = defineProps<{
  story: Story
  storyItems: StoryItem[]
  choicesHidden: boolean
}>()

const { getChildren } = StoryService(props.story)

const lastItem = computed(() => props.storyItems[props.storyItems.length - 1])

const lastItemChildren = computed<StoryItem[]>(() => {
  if (!lastItem.value) return []
  return getChildren(lastItem.value)
})

const choices = computed(() => {
  if (props.choicesHidden) return []
  return lastItemChildren.value.filter(e => e.nodeType === 'CHOICE')
})

const showEnd = defineModel<boolean>('showEnd', { required: true })
const showSettings = defineModel<boolean>('showSettings', { required: true })

defineEmits<{
  (e: 'makeUserAnswer', item: StoryItem): void
}>()

//TODO: ameliorer l'ouverture/fermeture de la fin d'histoire
</script>

<template>
  <div class="action-panel-container">
    <StoryEndComponent
      v-if="lastItem"
      :is-open="showEnd"
      :story-item="lastItem"
    />
    <ChoicesComponent
      :story="story"
      :choices="choices"
      @select-item="item => $emit('makeUserAnswer', item)"
    />
    <SettingsComponent :is-open="showSettings" :story />
  </div>
</template>

<style scoped>
.action-panel-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
</style>
