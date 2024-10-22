import type { Story } from '@/class/StoryClass'
import type { StoryItem } from '@/class/StoryItem'

export const StoryService = (story: Story) => {
  const getChildren = (storyItem: StoryItem) => {
    const relatedNodes = story.edges.filter(edge => edge.from === storyItem?.id)
    return story.items.filter(child =>
      relatedNodes?.map(e => e.to).includes(child.id),
    )
  }

  return { getChildren }
}

/**
 * Calculates the writing speed for the given story item.
 * @param {StoryItem} storyItem - The story item for which the writing speed needs to be calculated.
 * @returns {number} - The calculated writing speed in milliseconds.
 */
export const getTextWritingSpeed = (storyItem: StoryItem) => {
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
