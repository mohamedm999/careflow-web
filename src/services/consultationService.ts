import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Consultation } from '../types/models'

export interface ConsultationListParams {
  page?: number
  limit?: number
  patient?: string
  doctor?: string
  status?: string
}

export const getConsultations = async (params: ConsultationListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/consultations', { params })
  // Backend uses mongoose-paginate-v2 which returns { docs, totalDocs, page, totalPages, ... }
  const paginatedData = res.data.data
  const consultations = (paginatedData?.docs || []).map((item: any) => ({
    ...item,
    id: item._id || item.id
  }))
  return {
    items: consultations,
    pagination: {
      page: paginatedData?.page || 1,
      pages: paginatedData?.totalPages || 1,
      total: paginatedData?.totalDocs || 0
    }
  }
}

export const getConsultationById = async (id: string) => {
  const res = await http.get<ApiResponse<any>>(`/consultations/${id}`)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export interface CreateConsultationPayload {
  patient: string  // Patient document ID
  doctor?: string  // User ID (optional, defaults to current user)
  appointmentId?: string
  consultationDate?: string
  consultationType?: 'initial' | 'follow_up' | 'emergency' | 'routine_checkup' | 'specialist'
  chiefComplaint: string
  historyOfPresentIllness?: string
  vitalSigns?: {
    bloodPressure?: { systolic?: number; diastolic?: number }
    heartRate?: number
    temperature?: number
    weight?: number
    height?: number
    respiratoryRate?: number
    oxygenSaturation?: number
  }
  diagnoses?: { code?: string; description: string; type?: string; notes?: string }[]
  procedures?: { code?: string; name: string; description?: string; notes?: string }[]
  treatmentPlan?: string
  recommendations?: string
  followUpRequired?: boolean
  followUpDate?: string
  followUpInstructions?: string
  privateNotes?: string
  status?: 'draft' | 'completed' | 'reviewed' | 'archived'
}

export const createConsultation = async (payload: CreateConsultationPayload) => {
  const res = await http.post<ApiResponse<any>>('/consultations', payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const updateConsultation = async (id: string, payload: Partial<CreateConsultationPayload>) => {
  const res = await http.put<ApiResponse<any>>(`/consultations/${id}`, payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const updateConsultationStatus = async (id: string, status: string) => {
  const res = await http.patch<ApiResponse<any>>(`/consultations/${id}/status`, { status })
  return res.data.data!
}

export const updateVitalSigns = async (id: string, vitalSigns: CreateConsultationPayload['vitalSigns']) => {
  const res = await http.patch<ApiResponse<any>>(`/consultations/${id}/vital-signs`, { vitalSigns })
  return res.data.data!
}

export const deleteConsultation = async (id: string) => {
  await http.delete(`/consultations/${id}`)
}

export const cancelConsultation = async (id: string) => {
  const res = await http.patch<ApiResponse<any>>(`/consultations/${id}/status`, { status: 'archived' })
  return res.data.data!
}