import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { LabResult } from '../types/models'

export const getLabResults = async (params: { page?: number; limit?: number } = {}) => {
  const res = await http.get<ApiResponse<{ items: LabResult[] }>>('/lab-results', { params })
  return { items: res.data.data?.items ?? [], pagination: res.data.pagination }
}

export const getLabResultById = async (id: string) => {
  const res = await http.get<ApiResponse<LabResult>>(`/lab-results/${id}`)
  return res.data.data!
}