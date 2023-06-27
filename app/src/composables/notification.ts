import { ref } from "vue"

export type Notification = {
  type: 'success'|'info'|'warning'|'error'
  title: string
  text: string
}

const currentNotification = ref<Notification|undefined>(undefined)

export function useNotification() {
  const showNotification = (notification: Notification) => {
    currentNotification.value = notification
  }

  const hideNotification = () => {
    currentNotification.value = undefined
  }

  return { showNotification, hideNotification, currentNotification }
}