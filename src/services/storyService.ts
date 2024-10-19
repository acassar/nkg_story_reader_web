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
