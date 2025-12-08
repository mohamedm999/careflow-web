/**
 * Permission Constants
 * 
 * Single source of truth for all permission names in the CareFlow system.
 * Based on seedRolesPermissions.js (80 permissions across 10 categories)
 * 
 * Usage:
 * ```typescript
 * import { PERMISSIONS } from '@/utils/permissionConstants'
 * 
 * <ProtectedRoute permission={PERMISSIONS.USER_MANAGEMENT.CREATE_USERS} />
 * ```
 */

import type { PermissionName, PermissionCategory } from '../types/permissions'

/**
 * All permissions organized by category
 */
export const PERMISSIONS = {
  USER_MANAGEMENT: {
    CREATE_USERS: 'create_users',
    VIEW_ALL_USERS: 'view_all_users',
    MODIFY_USER_ROLES: 'modify_user_roles',
    SUSPEND_ACTIVATE_ACCOUNTS: 'suspend_activate_accounts',
  },
  
  PATIENT_RECORDS: {
    CREATE_PATIENT_RECORDS: 'create_patient_records',
    VIEW_ALL_PATIENTS: 'view_all_patients',
    VIEW_ASSIGNED_PATIENTS: 'view_assigned_patients',
    EDIT_MEDICAL_HISTORY: 'edit_medical_history',
    VIEW_OWN_RECORD: 'view_own_record',
  },
  
  APPOINTMENTS: {
    VIEW_ALL_APPOINTMENTS: 'view_all_appointments',
    VIEW_OWN_APPOINTMENTS: 'view_own_appointments',
    SCHEDULE_ANY_DOCTOR: 'schedule_any_doctor',
    SCHEDULE_OWN_APPOINTMENTS: 'schedule_own_appointments',
    CANCEL_ANY_APPOINTMENT: 'cancel_any_appointment',
    CANCEL_OWN_APPOINTMENTS: 'cancel_own_appointments',
    MARK_APPOINTMENT_COMPLETE: 'mark_appointment_complete',
  },
  
  CONSULTATIONS: {
    CREATE_CONSULTATIONS: 'create_consultations',
    VIEW_ALL_CONSULTATIONS: 'view_all_consultations',
    VIEW_OWN_CONSULTATIONS: 'view_own_consultations',
    EDIT_CONSULTATIONS: 'edit_consultations',
    DELETE_CONSULTATIONS: 'delete_consultations',
  },
  
  PRESCRIPTIONS: {
    CREATE_PRESCRIPTIONS: 'create_prescriptions',
    VIEW_ALL_PRESCRIPTIONS: 'view_all_prescriptions',
    VIEW_OWN_PRESCRIPTIONS: 'view_own_prescriptions',
    SIGN_PRESCRIPTIONS: 'sign_prescriptions',
    SEND_PRESCRIPTIONS: 'send_prescriptions',
    DISPENSE_PRESCRIPTIONS: 'dispense_prescriptions',
  },
  
  PHARMACY: {
    MANAGE_PHARMACIES: 'manage_pharmacies',
    VIEW_PHARMACIES: 'view_pharmacies',
    VIEW_ASSIGNED_PRESCRIPTIONS: 'view_assigned_prescriptions',
    UPDATE_PRESCRIPTION_STATUS: 'update_prescription_status',
  },
  
  LABORATORY: {
    CREATE_LAB_ORDERS: 'create_lab_orders',
    VIEW_LAB_ORDERS: 'view_lab_orders',
    VIEW_ALL_LAB_ORDERS: 'view_all_lab_orders',
    VIEW_OWN_LAB_ORDERS: 'view_own_lab_orders',
    EDIT_LAB_ORDERS: 'edit_lab_orders',
    CANCEL_LAB_ORDERS: 'cancel_lab_orders',
    COLLECT_SPECIMENS: 'collect_specimens',
    RECEIVE_SPECIMENS: 'receive_specimens',
    UPDATE_LAB_ORDER_STATUS: 'update_lab_order_status',
    CREATE_LAB_RESULTS: 'create_lab_results',
    VIEW_LAB_RESULTS: 'view_lab_results',
    EDIT_LAB_RESULTS: 'edit_lab_results',
    UPLOAD_LAB_RESULTS: 'upload_lab_results',
    VALIDATE_LAB_RESULTS: 'validate_lab_results',
    UPLOAD_LAB_REPORTS: 'upload_lab_reports',
    DOWNLOAD_LAB_REPORTS: 'download_lab_reports',
  },
  
  DOCUMENTS: {
    UPLOAD_DOCUMENTS: 'upload_documents',
    VIEW_ALL_DOCUMENTS: 'view_all_documents',
    VIEW_OWN_DOCUMENTS: 'view_own_documents',
    EDIT_DOCUMENTS: 'edit_documents',
    DELETE_DOCUMENTS: 'delete_documents',
    DOWNLOAD_DOCUMENTS: 'download_documents',
    SHARE_DOCUMENTS: 'share_documents',
  },
  
  SYSTEM_MANAGEMENT: {
    ACCESS_SYSTEM_SETTINGS: 'access_system_settings',
    VIEW_SYSTEM_LOGS: 'view_system_logs',
    CONFIGURE_NOTIFICATIONS: 'configure_notifications',
    EXPORT_IMPORT_DATA: 'export_import_data',
  },
} as const

/**
 * All role names
 */
export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  SECRETARY: 'secretary',
  PATIENT: 'patient',
  PHARMACIST: 'pharmacist',
  LAB_TECHNICIAN: 'lab_technician',
} as const

/**
 * Flat array of all permission names for iteration
 */
export const ALL_PERMISSIONS: PermissionName[] = [
  // User Management
  'create_users',
  'view_all_users',
  'modify_user_roles',
  'suspend_activate_accounts',
  // Patient Records
  'create_patient_records',
  'view_all_patients',
  'view_assigned_patients',
  'edit_medical_history',
  'view_own_record',
  // Appointments
  'view_all_appointments',
  'view_own_appointments',
  'schedule_any_doctor',
  'schedule_own_appointments',
  'cancel_any_appointment',
  'cancel_own_appointments',
  'mark_appointment_complete',
  // Consultations
  'create_consultations',
  'view_all_consultations',
  'view_own_consultations',
  'edit_consultations',
  'delete_consultations',
  // Prescriptions
  'create_prescriptions',
  'view_all_prescriptions',
  'view_own_prescriptions',
  'sign_prescriptions',
  'send_prescriptions',
  'dispense_prescriptions',
  // Pharmacy
  'manage_pharmacies',
  'view_pharmacies',
  'view_assigned_prescriptions',
  'update_prescription_status',
  // Laboratory
  'create_lab_orders',
  'view_lab_orders',
  'view_all_lab_orders',
  'view_own_lab_orders',
  'edit_lab_orders',
  'cancel_lab_orders',
  'collect_specimens',
  'receive_specimens',
  'update_lab_order_status',
  'create_lab_results',
  'view_lab_results',
  'edit_lab_results',
  'upload_lab_results',
  'validate_lab_results',
  'upload_lab_reports',
  'download_lab_reports',
  // Documents
  'upload_documents',
  'view_all_documents',
  'view_own_documents',
  'edit_documents',
  'delete_documents',
  'download_documents',
  'share_documents',
  // System Management
  'access_system_settings',
  'view_system_logs',
  'configure_notifications',
  'export_import_data',
]

/**
 * Permission category names
 */
export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  'user_management',
  'patient_records',
  'appointments',
  'consultations',
  'prescriptions',
  'pharmacy',
  'laboratory',
  'documents',
  'system_management',
]

/**
 * Human-readable labels for permission categories
 */
export const CATEGORY_LABELS: Record<PermissionCategory, string> = {
  user_management: 'User Management',
  patient_records: 'Patient Records',
  appointments: 'Appointments',
  consultations: 'Consultations',
  prescriptions: 'Prescriptions',
  pharmacy: 'Pharmacy',
  laboratory: 'Laboratory',
  documents: 'Documents',
  system_management: 'System Management',
}

/**
 * Human-readable labels for roles
 */
export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
  secretary: 'Secretary',
  patient: 'Patient',
  pharmacist: 'Pharmacist',
  lab_technician: 'Lab Technician',
}
