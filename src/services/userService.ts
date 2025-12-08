import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { User } from '../types/models'

export interface GetUsersParams {
  page?: number
  limit?: number
  role?: string
  isActive?: boolean
  search?: string
  sortBy?: 'createdAt' | 'email' | 'firstName' | 'lastName'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedUsers {
  docs: User[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const getAllUsers = async (params: GetUsersParams = {}) => {
  const res = await http.get<ApiResponse<PaginatedUsers>>('/users', { params })
  const data = res.data.data!
  // Transform backend format to frontend format
  const users = (data.docs || []).map((user: any) => ({
    ...user,
    id: user._id || user.id,
    role: user.role || { name: 'unknown' }
  }))
  return {
    items: users,
    pagination: {
      page: data.page || 1,
      pages: data.totalPages || 1,
      total: data.totalDocs || 0
    }
  }
}

export const getUserById = async (userId: string) => {
  const res = await http.get<ApiResponse<User>>(`/users/${userId}`)
  return res.data.data!
}

export const updateUserRole = async (userId: string, roleId: string) => {
  const res = await http.patch<ApiResponse<User>>(`/users/${userId}/role`, { roleId })
  return res.data.data!
}

export const toggleUserStatus = async (userId: string, isActive: boolean) => {
  const res = await http.patch<ApiResponse<User>>(`/users/${userId}/status`, { isActive })
  return res.data.data!
}
