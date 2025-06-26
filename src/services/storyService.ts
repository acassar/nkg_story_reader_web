import type { Story } from '@/class/StoryClass'
import type { StoryItem } from '@/class/StoryItem'
import { useSettingsStore } from '@/stores/settings.store'

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
 * Apply a factor to a speed with a maximum. If the factor equals or is more that the factor, 0 is returned.
 * @param speed original speed
 * @param max maximum factor
 * @param factor factor to apply
 * @returns the modified speed
 */
export const applySpeedFactor = (props: {
  speed: number
  max: number
  factor: number
}) => {
  if (props.factor >= props.max) return 0 //Vitesse instantanée
  return props.speed / props.factor
}

/**
 * Calculates the writing speed for the given story item.
 * @param {StoryItem} storyItem - The story item for which the writing speed needs to be calculated.
 * @returns {number} - The calculated writing speed in milliseconds.
 */
export const getTextWritingSpeed = (storyItem: StoryItem) => {
  const MINIMUM_WRITING_SPEED = 1000
  const MAXIMUM_WRITING_SPEED = 10000
  const WORD_PER_SECOND_SPEED = 5

  const words = storyItem.text.split(' ')
  let speed = (words.length / WORD_PER_SECOND_SPEED) * 1000

  speed = Math.max(
    MINIMUM_WRITING_SPEED,
    Math.min(speed, MAXIMUM_WRITING_SPEED),
  )

  const { writingSpeedFactor } = useSettingsStore()
  return applySpeedFactor({
    speed,
    max: MAXIMUM_WRITING_SPEED,
    factor: writingSpeedFactor,
  })
}
