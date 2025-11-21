// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 30000)

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Status values
export const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled', 'no-show'] as const
export const PRESCRIPTION_STATUSES = ['draft', 'signed', 'dispensed', 'completed', 'cancelled'] as const
export const CONSULTATION_STATUSES = ['draft', 'completed', 'cancelled'] as const
export const LAB_ORDER_STATUSES = ['pending', 'approved', 'rejected', 'sample_collected', 'in_progress', 'completed', 'cancelled'] as const
export const LAB_RESULT_STATUSES = ['pending', 'approved', 'released', 'reviewed'] as const

// Blood types
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'] as const

// Genders
export const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'] as const

// Appointment types
export const APPOINTMENT_TYPES = ['consultation', 'checkup', 'procedure', 'follow-up'] as const

// Document types
export const DOCUMENT_TYPES = ['prescription', 'lab_result', 'consultation', 'general', 'imaging', 'vaccine'] as const

// Allergy severity
export const ALLERGY_SEVERITIES = ['mild', 'moderate', 'severe'] as const

// Medical history status
export const MEDICAL_HISTORY_STATUSES = ['active', 'resolved', 'chronic'] as const

// Roles
export const USER_ROLES = ['admin', 'doctor', 'nurse', 'secretary', 'patient', 'pharmacist', 'lab_technician'] as const

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const TIME_FORMAT = 'HH:mm'

// File upload
export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'text/csv']
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.csv']
