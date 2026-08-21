import { ref } from 'vue'

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    const newToast: ToastItem = {
      id,
      title: toast.title,
      description: toast.description,
      type: toast.type || 'success',
      duration: toast.duration ?? 3500,
    }

    toasts.value.push(newToast)

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    addToast,
    removeToast,
  }
}
