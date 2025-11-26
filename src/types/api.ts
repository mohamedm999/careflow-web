import { Permission } from './models'
export type { Permission }

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  pagination?: {
    page: number
    pages: number
    total: number
    limit: number
  }
}