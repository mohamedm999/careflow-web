/**
 * TypeScript types for CareFlow permissions and roles system
 * Based on seedRolesPermissions.js
 * 
 * This file provides strict typing for all 80 permissions and 7 roles
 * to enable autocomplete and compile-time checking.
 */

// ============================================================================
// Permission Names (80 total)
// ============================================================================

/**
 * All available permission names in the system.
 * Organized by category for better documentation.
 */
export type PermissionName =
  // User Management (4)
  | 'create_users'
  | 'view_all_users'
  | 'modify_user_roles'
  | 'suspend_activate_accounts'
  // Patient Records (5)
  | 'create_patient_records'
  | 'view_all_patients'
  | 'view_assigned_patients'
  | 'edit_medical_history'
  | 'view_own_record'
  // Appointments (7)
  | 'view_all_appointments'
  | 'view_own_appointments'
  | 'schedule_any_doctor'
  | 'schedule_own_appointments'
  | 'cancel_any_appointment'
  | 'cancel_own_appointments'
  | 'mark_appointment_complete'
  // Consultations (5)
  | 'create_consultations'
  | 'view_all_consultations'
  | 'view_own_consultations'
  | 'edit_consultations'
  | 'delete_consultations'
  // Prescriptions (6)
  | 'create_prescriptions'
  | 'view_all_prescriptions'
  | 'view_own_prescriptions'
  | 'sign_prescriptions'
  | 'send_prescriptions'
  | 'dispense_prescriptions'
  // Pharmacy (4)
  | 'manage_pharmacies'
  | 'view_pharmacies'
  | 'view_assigned_prescriptions'
  | 'update_prescription_status'
  // Laboratory (16)
  | 'create_lab_orders'
  | 'view_lab_orders'
  | 'view_all_lab_orders'
  | 'view_own_lab_orders'
  | 'edit_lab_orders'
  | 'cancel_lab_orders'
  | 'collect_specimens'
  | 'receive_specimens'
  | 'update_lab_order_status'
  | 'create_lab_results'
  | 'view_lab_results'
  | 'edit_lab_results'
  | 'upload_lab_results'
  | 'validate_lab_results'
  | 'upload_lab_reports'
  | 'download_lab_reports'
  // Documents (7)
  | 'upload_documents'
  | 'view_all_documents'
  | 'view_own_documents'
  | 'edit_documents'
  | 'delete_documents'
  | 'download_documents'
  | 'share_documents'
  // System Management (4)
  | 'access_system_settings'
  | 'view_system_logs'
  | 'configure_notifications'
  | 'export_import_data'

// ============================================================================
// Permission Categories
// ============================================================================

/**
 * Permission category types
 */
export type PermissionCategory =
  | 'user_management'
  | 'patient_records'
  | 'appointments'
  | 'consultations'
  | 'prescriptions'
  | 'pharmacy'
  | 'laboratory'
  | 'documents'
  | 'system_management'

// ============================================================================
// Role Names (7 total)
// ============================================================================

/**
 * All available role names in the system
 */
export type RoleName =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'secretary'
  | 'patient'
  | 'pharmacist'
  | 'lab_technician'

// ============================================================================
// Permission Groupings by Category
// ============================================================================

/**
 * User Management Permissions
 */
export type UserManagementPermission =
  | 'create_users'
  | 'view_all_users'
  | 'modify_user_roles'
  | 'suspend_activate_accounts'

/**
 * Patient Records Permissions
 */
export type PatientRecordsPermission =
  | 'create_patient_records'
  | 'view_all_patients'
  | 'view_assigned_patients'
  | 'edit_medical_history'
  | 'view_own_record'

/**
 * Appointments Permissions
 */
export type AppointmentsPermission =
  | 'view_all_appointments'
  | 'view_own_appointments'
  | 'schedule_any_doctor'
  | 'schedule_own_appointments'
  | 'cancel_any_appointment'
  | 'cancel_own_appointments'
  | 'mark_appointment_complete'

/**
 * Consultations Permissions
 */
export type ConsultationsPermission =
  | 'create_consultations'
  | 'view_all_consultations'
  | 'view_own_consultations'
  | 'edit_consultations'
  | 'delete_consultations'

/**
 * Prescriptions Permissions
 */
export type PrescriptionsPermission =
  | 'create_prescriptions'
  | 'view_all_prescriptions'
  | 'view_own_prescriptions'
  | 'sign_prescriptions'
  | 'send_prescriptions'
  | 'dispense_prescriptions'

/**
 * Pharmacy Permissions
 */
export type PharmacyPermission =
  | 'manage_pharmacies'
  | 'view_pharmacies'
  | 'view_assigned_prescriptions'
  | 'update_prescription_status'

/**
 * Laboratory Permissions
 */
export type LaboratoryPermission =
  | 'create_lab_orders'
  | 'view_lab_orders'
  | 'view_all_lab_orders'
  | 'view_own_lab_orders'
  | 'edit_lab_orders'
  | 'cancel_lab_orders'
  | 'collect_specimens'
  | 'receive_specimens'
  | 'update_lab_order_status'
  | 'create_lab_results'
  | 'view_lab_results'
  | 'edit_lab_results'
  | 'upload_lab_results'
  | 'validate_lab_results'
  | 'upload_lab_reports'
  | 'download_lab_reports'

/**
 * Documents Permissions
 */
export type DocumentsPermission =
  | 'upload_documents'
  | 'view_all_documents'
  | 'view_own_documents'
  | 'edit_documents'
  | 'delete_documents'
  | 'download_documents'
  | 'share_documents'

/**
 * System Management Permissions
 */
export type SystemManagementPermission =
  | 'access_system_settings'
  | 'view_system_logs'
  | 'configure_notifications'
  | 'export_import_data'

// ============================================================================
// Role Permission Mappings
// ============================================================================

/**
 * Map of role names to their default permission arrays
 * Based on rolePermissions from seedRolesPermissions.js
 */
export interface RolePermissionMap {
  admin: PermissionName[]
  doctor: PermissionName[]
  nurse: PermissionName[]
  secretary: PermissionName[]
  patient: PermissionName[]
  pharmacist: PermissionName[]
  lab_technician: PermissionName[]
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Permission check mode
 */
export type PermissionCheckMode = 'any' | 'all'

/**
 * Extended Permission interface with additional metadata
 */
export interface PermissionWithMeta {
  id: string
  name: PermissionName
  description: string
  category: PermissionCategory
}

/**
 * Extended Role interface with additional metadata
 */
export interface RoleWithMeta {
  id: string
  name: RoleName
  description: string
  permissions: PermissionWithMeta[]
}
