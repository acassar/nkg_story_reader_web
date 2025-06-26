import type { Story } from '@/class/StoryClass'
import type { StoryItem } from '@/class/StoryItem'
import {
  SAVE_STORAGE_KEY,
  UNLOCK_STORAGE_KEY,
} from '@/constants/settings/settingsConstant'
import { useSettingsStore } from '@/stores/settings.store'
import { storeToRefs } from 'pinia'

const SAVE_PROGRESSION: boolean = true

export const retrieveSavedItems = (story: Story): StoryItem[] => {
  if (!SAVE_PROGRESSION) return []
  const savedStoryItemsId = localStorage.getItem(`save-${story.title}`)
  const savedItems = savedStoryItemsId?.split(',').map(e => {
    const item = story.items.find(i => i.id === e)
    if (!item)
      throw Error(
        `Technical Error: could not find the saved item with id ${e} in the story ${story.title}`,
      )
    return item
  })
  return savedItems ?? []
}

export const saveProgression = (
  story: Story,
  playedItems: StoryItem[] | undefined,
) => {
  if (!playedItems)
    throw Error(
      "Technical Error: can't save progression, could not retrieve the last text",
    )
  if (SAVE_PROGRESSION)
    localStorage.setItem(
      `${SAVE_STORAGE_KEY}-${story.title}`,
      playedItems.map(e => e.id).join(','),
    )
}

export const removeSave = (story: Story) => {
  const { lockTimeoutCallback } = storeToRefs(useSettingsStore())
  localStorage.removeItem(`${SAVE_STORAGE_KEY}-${story.title}`)
  localStorage.removeItem(`${UNLOCK_STORAGE_KEY}-${story.title}`)
  lockTimeoutCallback.value = undefined
}
