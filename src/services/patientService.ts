import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Patient } from '../types/models'

export interface PatientListParams { page?: number; limit?: number; search?: string }

export const getPatients = async (params: PatientListParams = {}) => {
  const res = await http.get<ApiResponse<{ items: Patient[] }>>('/patients', { params })
  const data = res.data.data
  const pagination = res.data.pagination
  return { items: data?.items ?? [], pagination }
}

export const getPatientById = async (id: string) => {
  const res = await http.get<ApiResponse<Patient>>(`/patients/${id}`)
  return res.data.data!
}

export const createPatient = async (payload: Partial<Patient>) => {
  const res = await http.post<ApiResponse<Patient>>('/patients', payload)
  return res.data.data!
}

export const updatePatient = async (id: string, payload: Partial<Patient>) => {
  const res = await http.put<ApiResponse<Patient>>(`/patients/${id}`, payload)
  return res.data.data!
}

export const deletePatient = async (id: string) => {
  await http.delete(`/patients/${id}`)
}