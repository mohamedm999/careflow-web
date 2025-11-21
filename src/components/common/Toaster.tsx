import toast, { Toaster as HotToaster } from 'react-hot-toast'

// Toast utility functions
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
      },
    })
  },
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    })
  },
  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    })
  },
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
    })
  },
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId)
  },
}

// Toaster component to be added to app root
export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '8px',
          fontSize: '14px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}
