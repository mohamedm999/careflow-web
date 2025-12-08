import { http } from './api'
import type { ApiResponse } from '../types/api'

export interface AppointmentListParams {
  page?: number
  limit?: number
  status?: string
  doctorId?: string
  patientId?: string
  date?: string
}

export interface CreateAppointmentPayload {
  patientId: string   // User ID of the patient
  doctorId: string    // User ID of the doctor
  dateTime: string    // ISO date string
  duration?: number   // minutes, defaults to 30
  reason: string
  notes?: string
}

export const getAppointments = async (params: AppointmentListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/appointments', { params })
  const data = res.data.data
  
  // Backend returns { appointments, pagination }
  const appointments = (data?.appointments ?? []).map((item: any) => ({
    ...item,
    id: item._id || item.id
  }))

  return { items: appointments, pagination: data?.pagination }
}

export const getAppointmentById = async (id: string) => {
  const res = await http.get<ApiResponse<any>>(`/appointments/${id}`)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const createAppointment = async (payload: any) => {
  const { appointmentDate, appointmentTime, reasonForVisit, patientId, doctorId, ...rest } = payload
  // Combine date and time into ISO string
  const dateTime = new Date(`${appointmentDate}T${appointmentTime}`).toISOString()
  
  const res = await http.post<ApiResponse<any>>('/appointments', {
    patientId,
    doctorId,
    dateTime,
    reason: reasonForVisit,
    ...rest
  })
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const updateAppointment = async (id: string, payload: any) => {
  // If updating date/time, combine them
  const updateData = { ...payload }
  if (payload.appointmentDate && payload.appointmentTime) {
    updateData.dateTime = new Date(`${payload.appointmentDate}T${payload.appointmentTime}`).toISOString()
    delete updateData.appointmentDate
    delete updateData.appointmentTime
  }
  if (payload.reasonForVisit) {
    updateData.reason = payload.reasonForVisit
    delete updateData.reasonForVisit
  }
  
  const res = await http.put<ApiResponse<any>>(`/appointments/${id}`, updateData)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const cancelAppointment = async (id: string, reason?: string) => {
  const res = await http.patch<ApiResponse<any>>(`/appointments/${id}/cancel`, { reason })
  return res.data.data
}

export const completeAppointment = async (id: string, notes?: string) => {
  const res = await http.patch<ApiResponse<any>>(`/appointments/${id}/complete`, { notes })
  return res.data.data
}

export const getDoctorAvailability = async (doctorId: string, date: string) => {
  const res = await http.get<ApiResponse<any>>(`/appointments/availability/${doctorId}`, { params: { date } })
  return res.data.data
}