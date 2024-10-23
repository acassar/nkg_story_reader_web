<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import ChatBubble from '../chat/ChatBubble.vue'
import { Story } from '@/class/StoryClass'
import { StoryItem } from '@/class/StoryItem'
import ChoicesComponent from '../choices/ChoicesComponent.vue'
import AnsweringLoader from '../common/loader/AnsweringLoader.vue'
import { getTextWritingSpeed, StoryService } from '@/services/storyService'
import TypeWriter from '../typeWriter/TypeWriter.vue'
import { retrieveSavedItems, saveProgression } from '@/services/saveService'
import SettingsComponent from '../settings/SettingsComponent.vue'
import { useStoryLock } from '@/composables/useStoryLock'

const props = defineProps<{
  story: Story
}>()

const { getChildren } = StoryService(props.story)
const storyItems = ref<StoryItem[]>([])
const isCharacterAnswering = ref<boolean>(false)
const userAnsweringItem = ref<StoryItem>()
const showSettings = ref<boolean>(false)
const {
  syncLocalStorageLock,
  lockStoryIfNecessary,
  unlockStory,
  isStoryLocked,
} = useStoryLock(props.story)

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
  const lockTime = syncLocalStorageLock()

  //Adding the first item, or the saved ones
  if (savedItems.length) {
    savedItems.forEach(e => addItem(e))
  } else {
    addItem(
      props.story.items.find(e => e.id === 'start') ?? props.story.items[0],
    )
  }

  //continuing the story only after the lock time (if there) has elapsed
  setTimeout(() => {
    handleAutoText(lastItem.value!, true)
  }, lockTime)
})

const getItemPosition = (storyItem: StoryItem): 'left' | 'right' => {
  if (storyItem.nodeType === 'CHOICE') return 'right'
  return 'left'
}

const selectItem = (item: StoryItem) => {
  userAnsweringItem.value = item
}

const addItem = (item: StoryItem) => {
  storyItems.value?.push(item)
  saveProgression(props.story, storyItems.value)
}

const userEndedAnswering = () => {
  if (!userAnsweringItem.value)
    throw Error('Technical error: user typing item not available')
  addItem(userAnsweringItem.value)
  const children = getChildren(userAnsweringItem.value)

  if (children.length) {
    const timer = lockStoryIfNecessary(children[0])
    setTimeout(() => {
      if (!userAnsweringItem.value)
        throw Error('Technical error: user typing item not available')
      handleAutoText(userAnsweringItem.value)
      userAnsweringItem.value = undefined
    }, timer)
  }
}

/**
 * Handles the automatic text generation for a given story item. It keeps displaying the character texts.
 * @param {StoryItem} item - The story item for which the text needs to be generated.
 * @returns {Promise<void>} - A Promise that resolves when the text generation is complete.
 */
const handleAutoText = async (
  item: StoryItem,
  mountedCall: boolean = false,
) => {
  const children = getChildren(item)
  const firstChild = children[0]

  const characterAnswer = () => {
    isCharacterAnswering.value = true
    setTimeout(() => {
      isCharacterAnswering.value = false
      addItem(firstChild)
      handleAutoText(firstChild)
    }, getTextWritingSpeed(firstChild))
  }

  if (children?.length === 1 && firstChild.nodeType === 'TEXT') {
    let timer = lockStoryIfNecessary(firstChild)
    if (mountedCall) timer = 0 //if we arrive here by the onMounted event, we don't want to re-run a timer on an already handled item
    console.log(timer)
    setTimeout(() => {
      unlockStory()
      characterAnswer()
    }, timer)
  }
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

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}
</script>

<template>
  <div class="views">
    <div class="container choices">
      <ChoicesComponent :choices="choices" @select-item="selectItem" />
      <SettingsComponent v-model="showSettings" :story />
    </div>
    <div class="container chat">
      <div id="chat-component" class="bubble-container">
        <v-icon
          @click="toggleSettings"
          scale="1.5"
          id="settings-gear"
          name="bi-gear-fill"
        />
        <ChatBubble
          :position="getItemPosition(item)"
          :story-item="item"
          :key="index"
          v-for="(item, index) of storyItems"
          :class="getItemPosition"
        />
        <AnsweringLoader v-if="isCharacterAnswering" />
      </div>
      <div v-if="isStoryLocked">Pierre est occupé</div>
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
  position: relative;
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

#settings-gear {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
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
