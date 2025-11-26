export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  code?: string
  timestamp?: string
}

export interface ApiError {
  success: false
  message: string
  code: string
  correlationId?: string
  timestamp?: string
  details?: any
}

export const isApiError = (error: any): error is ApiError => {
  return error && error.success === false && typeof error.message === 'string'
}

export const extractErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message
  }
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export const extractErrorCode = (error: any): string => {
  if (isApiError(error)) {
    return error.code
  }
  if (error.response?.data?.code) {
    return error.response.data.code
  }
  return 'UNKNOWN_ERROR'
}
