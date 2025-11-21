import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Appointment } from '../types/models'

export interface AppointmentListParams { page?: number; limit?: number }

export const getAppointments = async (params: AppointmentListParams = {}) => {
  const res = await http.get<ApiResponse<{ items: Appointment[] }>>('/appointments', { params })
  const data = res.data.data
  const pagination = res.data.pagination
  return { items: data?.items ?? [], pagination }
}

export const getAppointmentById = async (id: string) => {
  const res = await http.get<ApiResponse<Appointment>>(`/appointments/${id}`)
  return res.data.data!
}

export const createAppointment = async (payload: Partial<Appointment> & { patientId: string; doctorId: string }) => {
  const res = await http.post<ApiResponse<Appointment>>('/appointments', payload)
  return res.data.data!
}

export const updateAppointment = async (id: string, payload: Partial<Appointment>) => {
  const res = await http.put<ApiResponse<Appointment>>(`/appointments/${id}`, payload)
  return res.data.data!
}

export const cancelAppointment = async (id: string) => {
  await http.patch(`/appointments/${id}/cancel`)
}