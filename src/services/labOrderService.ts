import { http } from './api'
import type { ApiResponse } from '../types/api'

export interface LabOrderListParams {
  page?: number
  limit?: number
  patient?: string
  status?: string
  priority?: string
}

export interface LabTest {
  testCode: string
  testName: string
  category: 'hematology' | 'biochemistry' | 'microbiology' | 'immunology' | 'pathology' | 'radiology' | 'molecular' | 'toxicology' | 'genetics' | 'other'
  specimenType: 'blood' | 'urine' | 'stool' | 'saliva' | 'tissue' | 'swab' | 'cerebrospinal_fluid' | 'sputum' | 'other'
  fastingRequired?: boolean
  instructions?: string
}

export interface CreateLabOrderPayload {
  patient: string  // Patient document ID
  consultation?: string
  tests: LabTest[]
  priority?: 'routine' | 'urgent' | 'stat'
  clinicalNotes?: string
  provisionalDiagnosis?: string
  expectedCompletionDate?: string
}

export const getLabOrders = async (params: LabOrderListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/lab-orders', { params })
  // Backend returns { data: [...], pagination: {...} }
  const labOrdersArray = res.data.data || []
  const pagination = res.data.pagination || { page: 1, totalPages: 1, total: 0 }
  const labOrders = labOrdersArray.map((item: any) => ({
    ...item,
    id: item._id || item.id
  }))
  return {
    items: labOrders,
    pagination: {
      page: pagination.page || 1,
      pages: pagination.totalPages || 1,
      total: pagination.total || pagination.totalDocs || 0
    }
  }
}

export const getLabOrderById = async (id: string) => {
  const res = await http.get<ApiResponse<any>>(`/lab-orders/${id}`)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const createLabOrder = async (payload: CreateLabOrderPayload) => {
  const res = await http.post<ApiResponse<any>>('/lab-orders', payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const updateLabOrder = async (id: string, payload: Partial<CreateLabOrderPayload>) => {
  const res = await http.put<ApiResponse<any>>(`/lab-orders/${id}`, payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const collectSpecimen = async (id: string, data: {
  collectedAt?: string
  collectedBy?: string
  specimenCondition?: 'good' | 'acceptable' | 'poor' | 'rejected'
  collectionNotes?: string
  volume?: string
  containerType?: string
}) => {
  const res = await http.patch<ApiResponse<any>>(`/lab-orders/${id}/collect-specimen`, data)
  return res.data.data!
}

export const receiveSpecimen = async (id: string, data: {
  receivedAt?: string
  receivedBy?: string
  specimenCondition?: string
  receptionNotes?: string
}) => {
  const res = await http.patch<ApiResponse<any>>(`/lab-orders/${id}/receive-specimen`, data)
  return res.data.data!
}

export const updateLabOrderStatus = async (id: string, status: string, statusNotes?: string) => {
  const res = await http.patch<ApiResponse<any>>(`/lab-orders/${id}/status`, { status, statusNotes })
  return res.data.data!
}

export const cancelLabOrder = async (id: string, cancellationReason: string) => {
  const res = await http.patch<ApiResponse<any>>(`/lab-orders/${id}/cancel`, { cancellationReason })
  return res.data.data!
}