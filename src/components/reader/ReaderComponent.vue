<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import ChatBubble from '../chat/ChatBubble.vue'
import { Story } from '@/class/StoryClass'
import { StoryItem } from '@/class/StoryItem'
import AnsweringLoader from '../common/loader/AnsweringLoader.vue'
import { getTextWritingSpeed, StoryService } from '@/services/storyService'
import TypeWriter from '../typeWriter/TypeWriter.vue'
import { retrieveSavedItems, saveProgression } from '@/services/saveService'
import { useStoryLock } from '@/composables/useStoryLock'
import { notificationService } from '@/services/notificationService'
import ActionPanel from '../actionPanel/ActionPanel.vue'

const props = defineProps<{
  story: Story
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'open:settings'): void
}>()

const { getChildren } = StoryService(props.story)
const storyItems = ref<StoryItem[]>([])
const isCharacterAnswering = ref<boolean>(false)
const userAnsweringItem = ref<StoryItem>()
const lockTimer = ref<number>(0)

const showEnd = computed(
  () =>
    lastItem.value?.nodeType === 'BAD' || lastItem.value?.nodeType === 'GOOD',
)

const choicesHidden = computed<boolean>(
  () =>
    !lastItem.value ||
    !!userAnsweringItem.value ||
    isStoryLocked.value ||
    showEnd.value,
)

const { syncLocalStorageLock, isStoryLocked, setUnlockTimeout } = useStoryLock(
  props.story,
)

const lastItem = computed(() =>
  (storyItems.value?.length ?? 0) > 0
    ? storyItems.value![storyItems.value!.length - 1]
    : undefined,
)

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
      //If there is only one child, we can handle it right away if it's not a choice
      if (children[0].nodeType !== 'CHOICE') handleWhoIsAnswering(children[0])
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
  else if (item.nodeType === 'BAD' || item.nodeType == 'GOOD') {
    addItem(item)
    storyItemAddedCallback(item)
  } else throw Error('Technical error: unknown node type')
}

const undo = () => {
  if (storyItems.value.length > 1) {
    // Remove the last item
    storyItems.value.pop()

    // Check if the new last item is a choice
    const newLastItem = lastItem.value
    if (newLastItem && newLastItem.nodeType === 'CHOICE') {
      storyItems.value.pop()
      saveProgression(props.story, storyItems.value)
    } else {
      // If not, recursively call undo until we find a choice or run out of items
      undo()
    }
  }
}

const storyItemAddedCallback = (storyItem: StoryItem) => {
  const children = getChildren(storyItem)
  if (children.length === 1 && children[0].nodeType !== 'CHOICE') {
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
  emit('open:settings')
}
</script>

<template>
  <div id="game-container">
    <span style="cursor: pointer" @click="$emit('back')">Retour</span>
    <div class="views">
      <div class="container chat">
        <div id="chat-component" class="bubble-container">
          <v-icon
            @click="toggleSettings"
            scale="1.5"
            id="settings-gear"
            name="bi-gear-fill"
          />
          <v-icon
            @click="undo"
            scale="1.5"
            id="undo-icon"
            name="la-undo-solid"
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
      <div id="action-panel">
        <ActionPanel
          :choices-hidden="choicesHidden"
          v-model:show-end="showEnd"
          :story="story"
          :story-items="storyItems"
          @make-user-answer="makeUserAnswer"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
#game-container {
  display: flex;
  flex-direction: column;
  height: var(--app-available-height);
}

.container {
  display: flex;
  flex-direction: column;
  padding: 3rem;
}

.views {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  gap: 1rem;
  height: 100%;
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

#action-panel {
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

#undo-icon {
  position: absolute;
  top: 10px;
  left: 10px;
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

  #action-panel {
    flex: 0;
    order: 2;
  }
}
</style>
