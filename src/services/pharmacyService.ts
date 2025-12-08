import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Pharmacy } from '../types/models'

export interface PharmacyListParams {
  page?: number
  limit?: number
  search?: string
  city?: string
  type?: string
  isActive?: boolean
}

export const getPharmacies = async (params: PharmacyListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/pharmacies', { params })
  // Backend returns { data: [...], pagination: {...} } format
  const pharmaciesArray = res.data.data || []
  const pagination = res.data.pagination || { page: 1, totalPages: 1, total: 0 }
  const pharmacies = pharmaciesArray.map((item: any) => ({
    ...item,
    id: item._id || item.id
  }))
  return {
    items: pharmacies,
    pagination: {
      page: pagination.page || 1,
      pages: pagination.totalPages || 1,
      total: pagination.total || pagination.totalDocs || 0
    }
  }
}

export const getPharmacy = async (id: string) => {
  const res = await http.get<ApiResponse<any>>(`/pharmacies/${id}`)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const createPharmacy = async (data: Partial<Pharmacy>) => {
  const res = await http.post<ApiResponse<any>>('/pharmacies', data)
  const pharmacy = res.data.data!
  return { ...pharmacy, id: pharmacy._id || pharmacy.id }
}

export const updatePharmacy = async (id: string, data: Partial<Pharmacy>) => {
  const res = await http.put<ApiResponse<any>>(`/pharmacies/${id}`, data)
  const pharmacy = res.data.data!
  return { ...pharmacy, id: pharmacy._id || pharmacy.id }
}

export const deletePharmacy = async (id: string) => {
  await http.delete(`/pharmacies/${id}`)
}

export const searchNearbyPharmacies = async (latitude: number, longitude: number, maxDistance?: number) => {
  const res = await http.get<ApiResponse<any>>('/pharmacies/nearby', {
    params: { latitude, longitude, maxDistance }
  })
  return res.data.data
}