import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Prescription } from '../types/models'

export const getPrescriptions = async (params: { page?: number; limit?: number } = {}) => {
  const res = await http.get<ApiResponse<{ items: Prescription[] }>>('/prescriptions', { params })
  return { items: res.data.data?.items ?? [], pagination: res.data.pagination }
}

export const getPrescriptionById = async (id: string) => {
  const res = await http.get<ApiResponse<Prescription>>(`/prescriptions/${id}`)
  return res.data.data!
}

export const createPrescription = async (payload: Partial<Prescription> & { patientId: string; doctorId: string }) => {
  const res = await http.post<ApiResponse<Prescription>>('/prescriptions', payload)
  return res.data.data!
}

export const updatePrescription = async (id: string, payload: Partial<Prescription>) => {
  const res = await http.put<ApiResponse<Prescription>>(`/prescriptions/${id}`, payload)
  return res.data.data!
}

export const signPrescription = async (id: string) => { await http.patch(`/prescriptions/${id}/sign`) }
export const dispensePrescription = async (id: string) => { await http.patch(`/prescriptions/${id}/dispense`) }
export const cancelPrescription = async (id: string) => { await http.patch(`/prescriptions/${id}/cancel`) }