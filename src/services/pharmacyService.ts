import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Pharmacy } from '../types/models'

export const getPharmacies = async (params?: { page?: number; limit?: number; search?: string; city?: string }) => {
  const res = await http.get<ApiResponse<Pharmacy[]>>('/pharmacies', { params })
  return { items: res.data.data || [], pagination: res.data.pagination }
}

export const getPharmacy = async (id: string) => {
  const res = await http.get<ApiResponse<Pharmacy>>(`/pharmacies/${id}`)
  return res.data.data!
}

export const createPharmacy = async (data: Partial<Pharmacy>) => {
  const res = await http.post<ApiResponse<Pharmacy>>('/pharmacies', data)
  return res.data.data!
}

export const updatePharmacy = async (id: string, data: Partial<Pharmacy>) => {
  const res = await http.put<ApiResponse<Pharmacy>>(`/pharmacies/${id}`, data)
  return res.data.data!
}

export const deletePharmacy = async (id: string) => {
  await http.delete(`/pharmacies/${id}`)
}
