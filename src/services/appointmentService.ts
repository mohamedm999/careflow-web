import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Appointment } from '../types/models'

export interface AppointmentListParams { page?: number; limit?: number }

export const getAppointments = async (params: AppointmentListParams = {}) => {
  const res = await http.get<ApiResponse<{ items: Appointment[] }>>('/appointments', { params })
  const data = res.data.data
  const pagination = res.data.pagination
  
  const items = (data?.items ?? []).map((item: any) => ({
    ...item,
    id: item._id || item.id
  }))

  return { items, pagination }
}

export const getAppointmentById = async (id: string) => {
  const res = await http.get<ApiResponse<Appointment>>(`/appointments/${id}`)
  const data = res.data.data!
  return { ...data, id: (data as any)._id || data.id }
}

export const createAppointment = async (payload: any) => {
  const { appointmentDate, appointmentTime, reasonForVisit, ...rest } = payload
  // Combine date and time into ISO string
  const dateTime = new Date(`${appointmentDate}T${appointmentTime}`).toISOString()
  
  const res = await http.post<ApiResponse<Appointment>>('/appointments', {
    ...rest,
    dateTime,
    reason: reasonForVisit
  })
  const data = res.data.data!
  return { ...data, id: (data as any)._id || data.id }
}

export const updateAppointment = async (id: string, payload: Partial<Appointment>) => {
  const res = await http.put<ApiResponse<Appointment>>(`/appointments/${id}`, payload)
  const data = res.data.data!
  return { ...data, id: (data as any)._id || data.id }
}

export const cancelAppointment = async (id: string) => {
  await http.patch(`/appointments/${id}/cancel`)
}