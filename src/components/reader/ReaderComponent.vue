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
import { notificationService } from '@/services/notificationService'

const props = defineProps<{
  story: Story
}>()

const { getChildren } = StoryService(props.story)
const storyItems = ref<StoryItem[]>([])
const isCharacterAnswering = ref<boolean>(false)
const userAnsweringItem = ref<StoryItem>()
const lockTimer = ref<number>(0)
const showSettings = ref<boolean>(false)

const { syncLocalStorageLock, isStoryLocked, setUnlockTimeout } = useStoryLock(
  props.story,
)

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
  if (!lastItem.value || userAnsweringItem.value || isStoryLocked.value)
    return []
  return lastItemChildren.value.filter(e => e.nodeType === 'CHOICE')
})

onMounted(() => {
  notificationService.requestPermission() //TODO: make a better way to ask for permission
  initSavedOrFirstItem()
})

const initSavedOrFirstItem = () => {
  const savedItems = retrieveSavedItems(props.story)

  if (savedItems.length) {
    //If there are saved items, we need to load them
    savedItems.forEach(e => addItem(e))
  } else {
    //If there are no saved items, we need to start the story
    addItem(
      props.story.items.find(e => e.id === 'start') ?? props.story.items[0],
    )
  }

  if (!lastItem.value)
    throw Error('Technical error: Story initialization failed')
  lockTimer.value = syncLocalStorageLock()
  const children = getChildren(lastItem.value)
  if (lockTimer.value) {
    //if the story is locked, we need to wait for the lock to be over before continuing.
    //It also means that only one child should exist, otherwise it would be a bug
    if (children.length !== 1)
      throw Error(
        'Technical error: locked story with multiple children not handled',
      )
    setUnlockTimeout(lastItem.value!, () => {
      handleWhoIsAnswering(children[0])
    })
  } else {
    /* If the story is not locked, it might means:
    - it's a fresh start
    - story items were saved, but the lock is over
    */
    //In either cases, we need to see if there is 1 or more children to handle
    if (children.length === 1) {
      //If there is only one child, we can handle it right away
      handleWhoIsAnswering(children[0])
    } else {
      //If there are multiple children, we need to wait for the user to select one
      //This is the case when the user is presented with multiple choices
      //We don't need to do anything, the user will select one
      //Except if the children types are not choices, then it's a bug
      if (children.some(e => e.nodeType !== 'CHOICE'))
        throw Error(
          'Technical error: multiple children of type different that CHOICE not handled',
        )
    }
  }
}

const getItemPosition = (storyItem: StoryItem): 'left' | 'right' => {
  if (storyItem.nodeType === 'CHOICE') return 'right'
  return 'left'
}

const addItem = (item: StoryItem) => {
  storyItems.value?.push(item)
  props.story.addStoryConditionActivated(item)
  saveProgression(props.story, storyItems.value) //TODO : maybe don't save with mounted call
}

const userEndedAnswering = () => {
  if (!userAnsweringItem.value)
    throw Error('Technical error: user typing item not available')
  addItem(userAnsweringItem.value)
  storyItemAddedCallback(userAnsweringItem.value)
  userAnsweringItem.value = undefined
}

const handleWhoIsAnswering = (item: StoryItem) => {
  if (item.nodeType === 'TEXT') makeCharacterAnswer(item)
  else if (item.nodeType === 'CHOICE') makeUserAnswer(item)
}

const storyItemAddedCallback = (storyItem: StoryItem) => {
  const children = getChildren(storyItem)
  if (children.length === 1) {
    const onlyChild = children[0]
    lockTimer.value = setUnlockTimeout(onlyChild, () => {
      handleWhoIsAnswering(onlyChild)
    })
  }
}

const makeUserAnswer = (item: StoryItem) => {
  userAnsweringItem.value = item
}

const makeCharacterAnswer = (item: StoryItem) => {
  //TODO: the time is oddly long for short texts
  isCharacterAnswering.value = true
  setTimeout(async () => {
    isCharacterAnswering.value = false
    addItem(item)
    storyItemAddedCallback(item)
    await nextTick()
    scrollToBottom()
  }, getTextWritingSpeed(item))
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
      <div v-if="isStoryLocked">
        Pierre est occupé {{ lockTimer / 1000 }} secondes
      </div>
      <TypeWriter
        @typing:end="userEndedAnswering"
        :text="userAnsweringItem?.text"
      ></TypeWriter>
    </div>
    <div class="container choices">
      <ChoicesComponent
        :story="story"
        :choices="choices"
        @select-item="makeUserAnswer"
      />
      <SettingsComponent v-model="showSettings" :story />
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
