import { http } from './api'
import type { ApiResponse } from '../types/api'
import type { Document } from '../types/models'

export const getDocuments = async (params: { page?: number; limit?: number } = {}) => {
  const res = await http.get<ApiResponse<{ items: Document[] }>>('/documents', { params })
  return { items: res.data.data?.items ?? [], pagination: res.data.pagination }
}

export const getDocumentById = async (id: string) => {
  const res = await http.get<ApiResponse<Document>>(`/documents/${id}`)
  return res.data.data!
}

export const uploadDocument = async (payload: { patientId: string; documentType: Document['documentType']; file: File; description?: string }) => {
  const form = new FormData()
  form.append('patientId', payload.patientId)
  form.append('documentType', payload.documentType)
  if (payload.description) form.append('description', payload.description)
  form.append('file', payload.file)
  const res = await http.post<ApiResponse<Document>>('/documents', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data.data!
}

export const deleteDocument = async (id: string) => { await http.delete(`/documents/${id}`) }