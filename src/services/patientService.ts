import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Patient } from '../types/models'

export interface PatientListParams { 
  page?: number
  limit?: number
  search?: string
}

export interface CreatePatientWithUserData {
  // User fields
  firstName: string
  lastName: string
  email: string
  password: string
  // Patient fields
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown'
  allergies?: Array<{
    allergen: string
    severity: 'mild' | 'moderate' | 'severe'
    notes?: string
  }>
  emergencyContact?: {
    name?: string
    relationship?: string
    phone?: string
  }
}

export const getPatients = async (params: PatientListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/patients', { params })
  const responseData = res.data.data!
  // Backend returns { patients, pagination } but frontend expects { items, pagination }
  const patients = (responseData.patients || []).map((p: any) => ({
    ...p,
    id: p._id,
    user: p.user ? { ...p.user, id: p.user._id } : p.user
  }))
  
  return {
    items: patients,
    pagination: responseData.pagination
  }
}

export const getPatientById = async (id: string) => {
  const res = await http.get<ApiResponse<Patient>>(`/patients/${id}`)
  const patient = res.data.data!
  return { ...patient, id: (patient as any)._id || patient.id }
}

export const createPatient = async (payload: CreatePatientWithUserData) => {
  const res = await http.post<ApiResponse<Patient>>('/patients/create-with-user', payload)
  const patient = res.data.data!
  return { ...patient, id: (patient as any)._id || patient.id }
}

export const updatePatient = async (id: string, payload: Partial<Patient>) => {
  const res = await http.put<ApiResponse<Patient>>(`/patients/${id}`, payload)
  const patient = res.data.data!
  return { ...patient, id: (patient as any)._id || patient.id }
}

export const deletePatient = async (id: string) => {
  await http.delete(`/patients/${id}`)
}