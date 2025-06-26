import type { Story } from '@/class/StoryClass'
import type { StoryItem } from '@/class/StoryItem'
import {
  MAX_AWAY_TIME_FACTOR,
  UNLOCK_STORAGE_KEY,
} from '@/constants/settings/settingsConstant'
import { notificationService } from '@/services/notificationService'
import { applySpeedFactor } from '@/services/storyService'
import { useSettingsStore } from '@/stores/settings.store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

export const useStoryLock = (story: Story) => {
  const { awayTimeFactor } = storeToRefs(useSettingsStore())
  const isStoryLocked = ref<boolean>(false)
  const { lockTimeoutCallback } = storeToRefs(useSettingsStore())

  /**
   * Locks the story item if it has a minutesToWait value.
   * @param {StoryItem} storyItem - The story item to check for locking.
   * @returns {number | undefined} The unlock date in milliseconds or undefined if no lock is needed.
   */
  const lockStoryIfNecessary = (storyItem: StoryItem): number => {
    const lockDateString = localStorage.getItem(
      `${UNLOCK_STORAGE_KEY}-${story.title}`,
    )
    if (lockDateString) {
      //We don't want to lock the story if it's already locked
      const lockDate = new Date(lockDateString)
      return lockDate.getTime() - new Date().getTime()
    }

    const todayDate = new Date()
    if (storyItem.minutesToWait) {
      const speedInMS = storyItem.minutesToWait * 1000 * 60

      const unlockDate = new Date(
        todayDate.getTime() +
          applySpeedFactor({
            speed: speedInMS,
            max: MAX_AWAY_TIME_FACTOR,
            factor: awayTimeFactor.value,
          }),
      )
      localStorage.setItem(
        `${UNLOCK_STORAGE_KEY}-${story.title}`,
        unlockDate.toUTCString(),
      )
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
    const lockDateString = localStorage.getItem(
      `${UNLOCK_STORAGE_KEY}-${story.title}`,
    )
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
    localStorage.removeItem(`${UNLOCK_STORAGE_KEY}-${story.title}`)
  }

  const unlockStory = () => {
    isStoryLocked.value = false
    removeLockToLocalStorage()
    lockTimeoutCallback.value = undefined
  }

  /**
   * Sets a timeout to unlock the story item after the minutesToWait has passed.
   * @param {StoryItem} storyItem - The story item to set the unlock timeout for.
   * @param {Function} callback - The callback function to execute after the lock time has passed.
   */
  const setUnlockTimeout = (storyItem: StoryItem, callback: () => void) => {
    const lockTime = lockStoryIfNecessary(storyItem)

    if (!lockTimeoutCallback.value) {
      console.info("pas de timeout pour l'instant: création")
      lockTimeoutCallback.value = () => {
        //TODO: verifier qu'il ne se declenche pas si ce n'est pas le moment
        if (lockTimeoutCallback.value) {
          if (lockTime) {
            notificationService.sendNotification(
              'Pierre est de nouveau en ligne',
            )
            unlockStory()
          }
          callback()
          lockTimeoutCallback.value = undefined
        }
      }
      setTimeout(lockTimeoutCallback.value, lockTime)
    } else console.info('timeout déjà présent')

    return lockTime
  }

  return {
    lockStoryIfNecessary,
    syncLocalStorageLock,
    removeLockToLocalStorage,
    unlockStory,
    isStoryLocked,
    setUnlockTimeout,
  }
}
