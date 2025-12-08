import { http } from './api'
import type { ApiResponse } from '../types/api'

export interface PrescriptionListParams {
  page?: number
  limit?: number
  patient?: string
  doctor?: string
  pharmacy?: string
  status?: string
  priority?: string
}

export interface Medication {
  medicationName: string
  genericName?: string
  dosage: string
  strength?: { value: number; unit: 'mg' | 'g' | 'mcg' | 'ml' | 'L' | 'IU' | '%' }
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'ointment' | 'inhaler' | 'drops' | 'patch' | 'suppository' | 'other'
  route: 'oral' | 'sublingual' | 'topical' | 'intravenous' | 'intramuscular' | 'subcutaneous' | 'inhalation' | 'rectal' | 'ophthalmic' | 'otic' | 'nasal'
  frequency: string
  duration: { value: number; unit: 'days' | 'weeks' | 'months' | 'as_needed' }
  quantity: number
  refills?: number
  instructions?: string
  indication?: string
  warnings?: string
}

export interface CreatePrescriptionPayload {
  patient: string  // Patient document ID
  doctor?: string  // User ID (optional, defaults to current user)
  consultation?: string
  medications: Medication[]
  pharmacy?: string
  diagnosis?: string
  notes?: string
  priority?: 'routine' | 'urgent' | 'stat'
}

export const getPrescriptions = async (params: PrescriptionListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/prescriptions', { params })
  // Backend uses mongoose-paginate-v2
  const paginatedData = res.data.data
  const prescriptions = (paginatedData?.docs || []).map((item: any) => ({
    ...item,
    id: item._id || item.id
  }))
  return {
    items: prescriptions,
    pagination: {
      page: paginatedData?.page || 1,
      pages: paginatedData?.totalPages || 1,
      total: paginatedData?.totalDocs || 0
    }
  }
}

export const getPrescriptionById = async (id: string) => {
  const res = await http.get<ApiResponse<any>>(`/prescriptions/${id}`)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const createPrescription = async (payload: CreatePrescriptionPayload) => {
  const res = await http.post<ApiResponse<any>>('/prescriptions', payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const updatePrescription = async (id: string, payload: Partial<CreatePrescriptionPayload>) => {
  const res = await http.put<ApiResponse<any>>(`/prescriptions/${id}`, payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const signPrescription = async (id: string, digitalSignature?: string) => {
  const res = await http.patch<ApiResponse<any>>(`/prescriptions/${id}/sign`, { digitalSignature })
  return res.data.data!
}

export const sendToPharmacy = async (id: string, pharmacyId: string) => {
  const res = await http.patch<ApiResponse<any>>(`/prescriptions/${id}/send-to-pharmacy`, { pharmacyId })
  return res.data.data!
}

export const dispenseMedication = async (id: string, data: { medicationId: string; dispensedQuantity: number; batchNumber?: string; expiryDate?: string; notes?: string }) => {
  const res = await http.patch<ApiResponse<any>>(`/prescriptions/${id}/dispense`, data)
  return res.data.data!
}

export const cancelPrescription = async (id: string, cancellationReason: string) => {
  const res = await http.patch<ApiResponse<any>>(`/prescriptions/${id}/cancel`, { cancellationReason })
  return res.data.data!
}

export const renewPrescription = async (id: string, data?: { medications?: Medication[]; notes?: string }) => {
  const res = await http.post<ApiResponse<any>>(`/prescriptions/${id}/renew`, data || {})
  return res.data.data!
}

export const dispensePrescription = async (id: string, data: { medicationId: string; dispensedQuantity: number; batchNumber?: string; expiryDate?: string; notes?: string }) => {
  const res = await http.patch<ApiResponse<any>>(`/prescriptions/${id}/dispense`, data)
  return res.data.data!
}