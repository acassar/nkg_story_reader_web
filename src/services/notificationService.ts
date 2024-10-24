class NotificationService {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support desktop notification')
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  sendNotification(title: string, options?: NotificationOptions): void {
    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notification')
      return
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options)
    } else if (Notification.permission !== 'denied') {
      this.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options)
        }
      })
    }
  }
}

export const notificationService = new NotificationService()
