import { http } from './api'
import type { ApiResponse } from '../types/api'

export interface LabResultListParams {
  page?: number
  limit?: number
  patient?: string
  status?: string
  hasCriticalResults?: boolean
}

export interface TestResult {
  testId: string
  testCode: string
  testName: string
  category: string
  resultValue: string
  resultUnit?: string
  referenceRange?: { min?: number; max?: number; text?: string }
  flag?: 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high' | 'abnormal' | 'positive' | 'negative'
  interpretation?: string
  notes?: string
  method?: string
  status?: 'preliminary' | 'final' | 'corrected' | 'cancelled'
}

export interface CreateLabResultPayload {
  labOrder: string  // LabOrder document ID
  patient: string   // Patient document ID
  doctor: string    // User ID
  testResults: TestResult[]
  reportSummary?: string
  overallInterpretation?: string
  recommendations?: string
  status?: 'preliminary' | 'final' | 'corrected' | 'cancelled' | 'amended'
}

export const getLabResults = async (params: LabResultListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/lab-results', { params })
  // Backend uses mongoose-paginate-v2
  const paginatedData = res.data.data
  const labResults = (paginatedData?.docs || []).map((item: any) => ({
    ...item,
    id: item._id || item.id
  }))
  return {
    items: labResults,
    pagination: {
      page: paginatedData?.page || 1,
      pages: paginatedData?.totalPages || 1,
      total: paginatedData?.totalDocs || 0
    }
  }
}

export const getLabResultById = async (id: string) => {
  const res = await http.get<ApiResponse<any>>(`/lab-results/${id}`)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const createLabResult = async (payload: CreateLabResultPayload) => {
  const res = await http.post<ApiResponse<any>>('/lab-results', payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const updateLabResult = async (id: string, payload: Partial<CreateLabResultPayload>) => {
  const res = await http.put<ApiResponse<any>>(`/lab-results/${id}`, payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const validateLabResult = async (id: string, validationNotes?: string) => {
  const res = await http.patch<ApiResponse<any>>(`/lab-results/${id}/validate`, { validationNotes })
  return res.data.data!
}

export const uploadLabReport = async (id: string, file: File) => {
  const form = new FormData()
  form.append('report', file)
  const res = await http.post<ApiResponse<any>>(`/lab-results/${id}/upload-report`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.data!
}

export const downloadLabReport = async (id: string) => {
  const res = await http.get<ApiResponse<{ url: string }>>(`/lab-results/${id}/download-report`)
  return res.data.data!.url
}