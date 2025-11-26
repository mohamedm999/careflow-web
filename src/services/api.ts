import axios, { AxiosError } from 'axios'
import { showToast } from '../components/common/Toaster'
// Lightweight store reference to avoid TS dispatch typing issues
import { getAccessToken, setAccessToken } from './token'
import { tokenRefreshed, logout as logoutAction } from '../store/slices/authSlice'

const baseURL = import.meta.env.VITE_API_BASE_URL as string
const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 30000)

export const http = axios.create({ baseURL, timeout, withCredentials: true })
const noAuthHttp = axios.create({ baseURL, timeout, withCredentials: true })

let storeRef: { dispatch: (action: unknown) => unknown } | null = null
export const setStore = (store: { dispatch: (action: unknown) => unknown }) => { storeRef = store }

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Error message helper
const getErrorMessage = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as { message?: string; error?: string }
    return data.message || data.error || 'An error occurred'
  }
  if (error.message) return error.message
  return 'Network error occurred'
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status
    const original = error.config
    const data = error.response?.data as any
    const message = data?.message || 'An unexpected error occurred'

    // 🛑 1. Rate Limiting (429)
    if (status === 429) {
      showToast.error('Too many requests. Please wait a moment.')
      return Promise.reject(error)
    }

    // 🚫 2. Authentication Error (401)
    if (status === 401) {
      // Ignore 401 on login page to let form handle "Invalid credentials"
      if (!window.location.pathname.includes('/auth/login')) {
        if (original && !original._retry) {
          original._retry = true
          try {
            if (!isRefreshing) {
              isRefreshing = true
              refreshPromise = noAuthHttp.post('/auth/refresh-token').then((r) => {
                const newToken = r.data?.data?.accessToken as string
                setAccessToken(newToken)
                storeRef?.dispatch(tokenRefreshed(newToken))
                return newToken
              }).finally(() => { isRefreshing = false })
            }
            await refreshPromise
            return http(original)
          } catch {
            storeRef?.dispatch(logoutAction())
            showToast.error('Session expired. Please login again.')
            return Promise.reject(new Error('Session expired. Please login again.'))
          }
        }
      }
    }

    // 🔒 3. Permission Error (403)
    if (status === 403) {
      showToast.error('You do not have permission to perform this action.')
    }

    // 💥 4. Server Error (500)
    if (status && status >= 500) {
      showToast.error('Server error. Our team has been notified.')
      console.error('Server Error:', message)
    }

    // ⚠️ 5. Validation Error (400)
    if (status === 400) {
      // Let the specific component handle validation errors (e.g., form fields)
      // But show a generic toast if no specific handling exists
      if (!data.errors) {
        showToast.error(message)
      }
    }

    // Enhance error with user-friendly message
    const enhancedError = {
      ...error,
      userMessage: getErrorMessage(error),
      originalError: error,
    }

    return Promise.reject(enhancedError)
  }
)

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
  }
}