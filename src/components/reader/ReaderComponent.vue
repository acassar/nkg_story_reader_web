<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import ChatBubble from '../chat/ChatBubble.vue'
import { Story } from '@/class/StoryClass'
import { StoryItem } from '@/class/StoryItem'
import ChoicesComponent from '../choices/ChoicesComponent.vue'
import AnsweringLoader from '../common/loader/AnsweringLoader.vue'
import { StoryService } from '@/services/storyService'
import TypeWriter from '../typeWriter/TypeWriter.vue'
import ButtonComponent from '../common/button/ButtonComponent.vue'
import { retrieveSavedItems, saveProgression } from '@/services/saveService'

const props = defineProps<{
  story: Story
}>()

const { getChildren } = StoryService(props.story)
const storyItems = ref<StoryItem[]>([])
const isCharacterAnswering = ref<boolean>(false)
const userAnsweringItem = ref<StoryItem>()

const lastItem = computed(() =>
  (storyItems.value?.length ?? 0) > 0
    ? storyItems.value![storyItems.value!.length - 1]
    : undefined,
)

const lastItemChildren = computed<StoryItem[]>(() => {
  if (!lastItem.value) return []
  return getChildren(lastItem.value)
})

const choices = computed(() => {
  if (!lastItem.value || userAnsweringItem.value) return []
  return lastItemChildren.value.filter(e => e.nodeType === 'CHOICE')
})

onMounted(() => {
  const savedItems = retrieveSavedItems(props.story)
  if (savedItems.length) {
    savedItems.forEach(e => addItem(e, false))
    handleAutoText(lastItem.value!)
  } else
    addItem(
      props.story.items.find(e => e.id === 'start') ?? props.story.items[0],
    )
})

const getItemPosition = (storyItem: StoryItem): 'left' | 'right' => {
  if (storyItem.nodeType === 'CHOICE') return 'right'
  return 'left'
}

const selectItem = (item: StoryItem) => {
  userAnsweringItem.value = item
}

const addItem = (item: StoryItem, autoText: boolean = true) => {
  storyItems.value?.push(item)
  if (autoText) handleAutoText(item)
  saveProgression(props.story, storyItems.value)
}

const userEndedAnswering = () => {
  if (!userAnsweringItem.value)
    throw Error('Technical error: user typing item not available')
  addItem(userAnsweringItem.value)
  userAnsweringItem.value = undefined
}

/**
 * Handles the automatic text generation for a given story item. It keeps displaying the character texts.
 * @param {StoryItem} item - The story item for which the text needs to be generated.
 * @returns {Promise<void>} - A Promise that resolves when the text generation is complete.
 */
const handleAutoText = async (item: StoryItem) => {
  const children = getChildren(item)
  if (children?.length === 1 && children[0].nodeType === 'TEXT') {
    isCharacterAnswering.value = true
    setTimeout(() => {
      isCharacterAnswering.value = false
      addItem(children.pop()!)
    }, getTextWritingSpeed(children[0]))
  }
  await nextTick()
  scrollToBottom()
}

/**
 * Calculates the writing speed for the given story item.
 * @param {StoryItem} storyItem - The story item for which the writing speed needs to be calculated.
 * @returns {number} - The calculated writing speed in milliseconds.
 */
const getTextWritingSpeed = (storyItem: StoryItem) => {
  const MINIMUM_WRITING_SPEED = 1000
  const MAXIMUM_WRITING_SPEED = 10000
  const WORD_PER_SECOND_SPEED = 8
  const words = storyItem.text.split(' ')
  const speed = Math.max(
    Math.min(
      (words.length / WORD_PER_SECOND_SPEED) * 1000,
      MINIMUM_WRITING_SPEED,
    ),
    MAXIMUM_WRITING_SPEED,
  )
  return speed
}

const scrollToBottom = () => {
  const chatElement = document.getElementById('chat-component')
  if (chatElement)
    chatElement.scroll({
      top: chatElement.scrollHeight,
      behavior: 'smooth',
    })
}

const removeSave = () => localStorage.removeItem(`save-${props.story.title}`)
</script>

<template>
  <div class="views">
    <ButtonComponent @click="removeSave"> reset save </ButtonComponent>
    <div class="container choices">
      <ChoicesComponent
        :choices="choices"
        @select-item="selectItem"
      ></ChoicesComponent>
    </div>
    <div class="container chat">
      <div id="chat-component" class="bubble-container">
        <ChatBubble
          :position="getItemPosition(item)"
          :story-item="item"
          :key="index"
          v-for="(item, index) of storyItems"
          :class="getItemPosition"
        />
        <AnsweringLoader v-if="isCharacterAnswering" />
      </div>
      <TypeWriter
        @typing:end="userEndedAnswering"
        :text="userAnsweringItem?.text"
      ></TypeWriter>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 3rem;
}

.views {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: var(--app-available-height);
}

.chat {
  background-color: var(--vt-c-black-soft);
  border-radius: 0.5rem;
  flex: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.choices {
  flex: 1;
}

.bubble-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 30px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--vt-c-black-soft);
  color: var(--vt-c-white-soft);
  font-size: 1.2rem;
  padding: 10px;
}

@media screen and (max-width: 800px) {
  .views {
    flex-direction: column;
    height: var(--app-available-height-mobile);
    font-size: small;
  }

  .container {
    padding: 0.5rem;
  }

  .chat {
    flex: 1;
    transition: height 1s ease-out;
    order: 1;
    height: calc-size(auto);
  }

  .choices {
    flex: 0;
    order: 2;
  }
}
</style>
