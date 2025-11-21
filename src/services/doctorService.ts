import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Doctor } from '../types/models'

export interface DoctorListParams { page?: number; limit?: number; search?: string }

export const getDoctors = async (params: DoctorListParams = {}) => {
  const res = await http.get<ApiResponse<{ items: Doctor[] }>>('/doctors', { params })
  const data = res.data.data
  const pagination = res.data.pagination
  return { items: data?.items ?? [], pagination }
}

export const getDoctorById = async (id: string) => {
  const res = await http.get<ApiResponse<Doctor>>(`/doctors/${id}`)
  return res.data.data!
}

export const createDoctor = async (payload: Partial<Doctor>) => {
  const res = await http.post<ApiResponse<Doctor>>('/doctors', payload)
  return res.data.data!
}

export const updateDoctor = async (id: string, payload: Partial<Doctor>) => {
  const res = await http.put<ApiResponse<Doctor>>(`/doctors/${id}`, payload)
  return res.data.data!
}

export const deleteDoctor = async (id: string) => {
  await http.delete(`/doctors/${id}`)
}
