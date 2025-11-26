import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Doctor } from '../types/models'

export interface DoctorListParams { page?: number; limit?: number; search?: string }

export const getDoctors = async (params: DoctorListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/users', { 
    params: { ...params, role: 'doctor' } 
  })
  // Backend uses mongoose-paginate-v2 which returns { docs, totalDocs, page, totalPages, ... }
  const paginatedData = res.data.data
  const users = paginatedData?.docs || []
  const doctors = users.map((user: any) => ({
    id: user._id,
    user: user,
    specialization: 'General', // Default as it's not in user model
    licenseNumber: 'N/A',
    yearsOfExperience: 0
  }))
  return { 
    items: doctors, 
    pagination: {
      page: paginatedData?.page || 1,
      pages: paginatedData?.totalPages || 1,
      total: paginatedData?.totalDocs || 0
    }
  }
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
