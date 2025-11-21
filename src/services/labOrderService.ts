import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { LabOrder } from '../types/models'

export const getLabOrders = async (params: { page?: number; limit?: number } = {}) => {
  const res = await http.get<ApiResponse<{ items: LabOrder[] }>>('/labs/orders', { params })
  return { items: res.data.data?.items ?? [], pagination: res.data.pagination }
}

export const getLabOrderById = async (id: string) => {
  const res = await http.get<ApiResponse<LabOrder>>(`/labs/orders/${id}`)
  return res.data.data!
}

export const createLabOrder = async (payload: Partial<LabOrder> & { patientId: string; doctorId: string; tests: { testName: string }[] }) => {
  const res = await http.post<ApiResponse<LabOrder>>('/labs/orders', payload)
  return res.data.data!
}

export const updateLabOrder = async (id: string, payload: Partial<LabOrder>) => {
  const res = await http.put<ApiResponse<LabOrder>>(`/labs/orders/${id}`, payload)
  return res.data.data!
}

export const cancelLabOrder = async (id: string) => { await http.patch(`/labs/orders/${id}/cancel`) }