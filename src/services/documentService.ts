import { http } from './api'
import type { ApiResponse } from '../types/api'

export interface DocumentListParams {
  page?: number
  limit?: number
  patient?: string
  category?: string
  status?: string
}

export type DocumentCategory = 'imaging' | 'lab_report' | 'prescription' | 'consent_form' | 'medical_record' | 'discharge_summary' | 'operative_report' | 'pathology_report' | 'radiology_report' | 'progress_note' | 'other'

export interface UploadDocumentPayload {
  patient: string  // Patient document ID
  category: DocumentCategory
  title: string
  description?: string
  file: File
  consultation?: string
  labOrder?: string
  prescription?: string
  tags?: string[]
  isConfidential?: boolean
}

export const getDocuments = async (params: DocumentListParams = {}) => {
  const res = await http.get<ApiResponse<any>>('/documents', { params })
  // Backend returns { data: [...], pagination: {...} }
  const documentsArray = res.data.data || []
  const pagination = res.data.pagination || { page: 1, totalPages: 1, total: 0 }
  const documents = documentsArray.map((item: any) => ({
    ...item,
    id: item._id || item.id
  }))
  return {
    items: documents,
    pagination: {
      page: pagination.page || 1,
      pages: pagination.totalPages || 1,
      total: pagination.total || pagination.totalDocs || 0
    }
  }
}

export const getDocumentById = async (id: string) => {
  const res = await http.get<ApiResponse<any>>(`/documents/${id}`)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const uploadDocument = async (payload: UploadDocumentPayload) => {
  const form = new FormData()
  form.append('patient', payload.patient)
  form.append('category', payload.category)
  form.append('title', payload.title)
  if (payload.description) form.append('description', payload.description)
  if (payload.consultation) form.append('consultation', payload.consultation)
  if (payload.labOrder) form.append('labOrder', payload.labOrder)
  if (payload.prescription) form.append('prescription', payload.prescription)
  if (payload.tags) form.append('tags', JSON.stringify(payload.tags))
  if (payload.isConfidential) form.append('isConfidential', 'true')
  form.append('document', payload.file)
  
  const res = await http.post<ApiResponse<any>>('/documents', form, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  })
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const updateDocument = async (id: string, payload: { title?: string; description?: string; tags?: string[]; visibility?: string }) => {
  const res = await http.put<ApiResponse<any>>(`/documents/${id}`, payload)
  const data = res.data.data!
  return { ...data, id: data._id || data.id }
}

export const deleteDocument = async (id: string) => {
  await http.delete(`/documents/${id}`)
}

export const getDownloadUrl = async (id: string) => {
  const res = await http.get<ApiResponse<{ url: string }>>(`/documents/${id}/download`)
  return res.data.data!.url
}

export const shareDocument = async (id: string, userIds: string[]) => {
  const res = await http.post<ApiResponse<any>>(`/documents/${id}/share`, { userIds })
  return res.data.data!
}

export const revokeShare = async (id: string, userId: string) => {
  const res = await http.post<ApiResponse<any>>(`/documents/${id}/revoke-share`, { userId })
  return res.data.data!
}