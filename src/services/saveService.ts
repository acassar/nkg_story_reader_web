import type { Story } from '@/class/StoryClass'
import type { StoryItem } from '@/class/StoryItem'

const SAVE_PROGRESSION: boolean = false

export const retrieveSavedItems = (story: Story): StoryItem[] => {
  if (!SAVE_PROGRESSION) return []
  const savedStoryItemsId = localStorage.getItem(`save-${story.title}`)
  const savedItems = story.items.filter(e => savedStoryItemsId?.includes(e.id))
  return savedItems
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
      `save-${story.title}`,
      playedItems.map(e => e.id).join(','),
    )
}

export const removeSave = (story: Story) =>
  localStorage.removeItem(`save-${story.title}`)
