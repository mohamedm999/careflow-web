import axios, { AxiosError } from 'axios'
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
    
    // Handle 401 Unauthorized - Token refresh
    if (status === 401 && original && !original._retry) {
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
        return Promise.reject(new Error('Session expired. Please login again.'))
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