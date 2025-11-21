import axios from 'axios'

export interface ApiError {
  message: string
  details?: string
  code?: string
}

interface ApiResponse {
  message?: string
  error?: string
  errors?: Record<string, string | string[]>
}

export function getErrorMessage(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data as ApiResponse | undefined

    if (status === 401) {
      return {
        message: 'Your session has expired. Please login again.',
        code: '401'
      }
    }

    if (status === 403) {
      return {
        message: 'You do not have permission to perform this action.',
        code: '403'
      }
    }

    if (status === 404) {
      return {
        message: 'The requested resource was not found.',
        code: '404'
      }
    }

    if (status === 422) {
      const validationErrors = data?.errors
      if (validationErrors && typeof validationErrors === 'object') {
        const errors = Object.entries(validationErrors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n')
        return {
          message: 'Validation failed',
          details: errors,
          code: '422'
        }
      }
      return {
        message: data?.message || data?.error || 'Validation error',
        code: '422'
      }
    }

    if (status === 409) {
      return {
        message: data?.message || data?.error || 'This resource already exists.',
        code: '409'
      }
    }

    if (status === 500) {
      return {
        message: 'Server error. Please try again later.',
        code: '500'
      }
    }

    if (status === 429) {
      return {
        message: 'Too many requests. Please wait a moment and try again.',
        code: '429'
      }
    }

    if (data?.message) {
      return {
        message: data.message,
        details: data.error,
        code: status?.toString()
      }
    }

    if (error.message === 'Network Error') {
      return {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      }
    }

    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout. The server took too long to respond.',
        code: 'TIMEOUT'
      }
    }

    return {
      message: error.message || 'An unexpected error occurred',
      code: 'AXIOS_ERROR'
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR'
    }
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR'
  }
}

export function formatErrorDisplay(error: ApiError): string {
  if (error.details) {
    return `${error.message}\n${error.details}`
  }
  return error.message
}
