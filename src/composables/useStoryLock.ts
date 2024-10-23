import type { Story } from '@/class/StoryClass'
import type { StoryItem } from '@/class/StoryItem'
import { ref } from 'vue'

const TIMER_FACTOR = 0.3

export const useStoryLock = (story: Story) => {
  const isStoryLocked = ref<boolean>(false)

  /**
   * Locks the story item if it has a minutesToWait value.
   * @param {StoryItem} storyItem - The story item to check for locking.
   * @returns {number | undefined} The unlock date in milliseconds or undefined if no lock is needed.
   */
  const lockStoryIfNecessary = (storyItem: StoryItem): number => {
    const todayDate = new Date()
    if (storyItem.minutesToWait) {
      const unlockDate = new Date(
        todayDate.getTime() +
          storyItem.minutesToWait * 1000 * 60 * TIMER_FACTOR,
      )
      localStorage.setItem(`unlock-${story.title}`, unlockDate.toUTCString())
      isStoryLocked.value = true
      return unlockDate.getTime() - todayDate.getTime()
    }
    return 0
  }

  /**
   * Synchronizes the local storage lock for the story.
   * @returns The lock time in milliseconds or 0 if no lock is found.
   */
  const syncLocalStorageLock = (): number => {
    let lockTime = 0
    const lockDateString = localStorage.getItem(`unlock-${story.title}`)
    if (lockDateString) {
      const lockDate = new Date(lockDateString)
      if (isNaN(lockDate.getTime())) throw Error('Invalid lock date')
      if (lockDate > new Date()) {
        lockTime = lockDate.getTime() - new Date().getTime()
      }
    }
    isStoryLocked.value = !!lockTime
    return lockTime
  }

  const removeLockToLocalStorage = () => {
    localStorage.removeItem(`unlock-${story.title}`)
  }

  const unlockStory = () => {
    isStoryLocked.value = false
    removeLockToLocalStorage()
  }

  const lockStory = () => {
    isStoryLocked.value = true
  }

  return {
    lockStoryIfNecessary,
    syncLocalStorageLock,
    removeLockToLocalStorage,
    lockStory,
    unlockStory,
    isStoryLocked,
  }
}