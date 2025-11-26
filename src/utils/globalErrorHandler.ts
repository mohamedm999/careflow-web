import { toast } from 'react-toastify'
import { extractErrorMessage, extractErrorCode } from './apiHelpers'

export const handleApiError = (error: any, customMessage?: string) => {
  const errorMessage = customMessage || extractErrorMessage(error)
  const errorCode = extractErrorCode(error)
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      error,
      message: errorMessage,
      code: errorCode,
      correlationId: error.response?.data?.correlationId
    })
  }

  // Show toast notification
  toast.error(errorMessage)

  // Return formatted error for component state
  return {
    message: errorMessage,
    code: errorCode,
    correlationId: error.response?.data?.correlationId
  }
}

export const handleSuccess = (message: string) => {
  toast.success(message)
}

export const handleInfo = (message: string) => {
  toast.info(message)
}

export const handleWarning = (message: string) => {
  toast.warning(message)
}
