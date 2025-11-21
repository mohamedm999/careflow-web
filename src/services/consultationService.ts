import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Consultation } from '../types/models'

export const getConsultations = async (params: { page?: number; limit?: number } = {}) => {
  const res = await http.get<ApiResponse<{ items: Consultation[] }>>('/consultations', { params })
  return { items: res.data.data?.items ?? [], pagination: res.data.pagination }
}

export const getConsultationById = async (id: string) => {
  const res = await http.get<ApiResponse<Consultation>>(`/consultations/${id}`)
  return res.data.data!
}

export const createConsultation = async (payload: Partial<Consultation> & { patientId: string; doctorId: string; date: string }) => {
  const res = await http.post<ApiResponse<Consultation>>('/consultations', payload)
  return res.data.data!
}

export const updateConsultation = async (id: string, payload: Partial<Consultation>) => {
  const res = await http.put<ApiResponse<Consultation>>(`/consultations/${id}`, payload)
  return res.data.data!
}

export const cancelConsultation = async (id: string) => { await http.patch(`/consultations/${id}/cancel`) }