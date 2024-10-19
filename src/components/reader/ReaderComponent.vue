<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import ChatBubble from '../chat/ChatBubble.vue'
import ExampleStory from '@/stories/example/example.json'
import CaveStory from '@/stories/cave/cave.json'
import { Story } from '@/class/StoryClass'
import { StoryItem } from '@/class/StoryItem'
import ChoicesComponent from '../choices/ChoicesComponent.vue'

const currentStory = ref<Story>()
const storyItems = ref<StoryItem[]>([])

const lastItem = computed(() =>
  (storyItems.value?.length ?? 0) > 0
    ? storyItems.value![storyItems.value!.length - 1]
    : undefined,
)
const choices = computed(() => {
  if (!lastItem.value) return []
  return getChildren(lastItem.value)
})

onMounted(() => {
  loadStory()
})

const loadStory = async () => {
  try {
    currentStory.value = new Story('Cave', CaveStory)
    selectItem(
      currentStory.value.items.find(e => e.id === 'start') ??
        currentStory.value.items[0],
    )
  } catch (error) {
    console.log(error)
  }
}

const getItemPosition = (storyItem: StoryItem): 'left' | 'right' => {
  console.log(storyItem)
  if (storyItem.nodeType === 'CHOICE') return 'right'
  return 'left'
}

const selectItem = (item: StoryItem) => {
  storyItems.value?.push(item)
  handleAutoText(item)
}

const getChildren = (storyItem: StoryItem) => {
  const relatedNodes = currentStory.value?.edges.filter(
    edge => edge.from === storyItem?.id,
  )
  return currentStory.value?.items.filter(child =>
    relatedNodes?.map(e => e.to).includes(child.id),
  )
}

const handleAutoText = async (item: StoryItem) => {
  const children = getChildren(item)
  if (children?.length === 1 && children[0].nodeType === 'TEXT')
    selectItem(children.pop()!)
  await nextTick()
  scrollToBottom()
}

const scrollToBottom = () => {
  const chatElement = document.getElementById('chat-component')
  if (chatElement)
    chatElement.scroll({
      top: chatElement.scrollHeight,
      behavior: 'smooth',
    })
}
</script>

<template>
  <div class="views">
    <div class="container choices">
      <ChoicesComponent
        :choices="choices"
        @select-item="selectItem"
      ></ChoicesComponent>
    </div>
    <div id="chat-component" class="container chat">
      <div class="bubble-container">
        <ChatBubble
          :position="getItemPosition(item)"
          :story-item="item"
          :key="index"
          v-for="(item, index) of storyItems"
          :class="getItemPosition"
        />
      </div>
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
  max-height: var(--app-available-height);
}

.chat {
  background-color: var(--vt-c-black-soft);
  border-radius: 0.5rem;
  flex: 2;
  overflow-y: scroll;
  min-height: var(--app-available-height);
}

.choices {
  flex: 1;
}

.bubble-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
