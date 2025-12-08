/**
 * Permissions Module Exports
 * 
 * Centralized exports for all permission-related functionality.
 * Import from this file for convenience.
 * 
 * @example
 * ```typescript
 * import { 
 *   usePermission, 
 *   PERMISSIONS, 
 *   PermissionGate,
 *   hasPermission 
 * } from '@/permissions'
 * ```
 */

// Types
export type {
  PermissionName,
  RoleName,
  PermissionCategory,
  PermissionCheckMode,
  PermissionWithMeta,
  RoleWithMeta,
  RolePermissionMap,
  UserManagementPermission,
  PatientRecordsPermission,
  AppointmentsPermission,
  ConsultationsPermission,
  PrescriptionsPermission,
  PharmacyPermission,
  LaboratoryPermission,
  DocumentsPermission,
  SystemManagementPermission
} from './types/permissions'

// Constants
export {
  PERMISSIONS,
  ROLES,
  ALL_PERMISSIONS,
  PERMISSION_CATEGORIES,
  CATEGORY_LABELS,
  ROLE_LABELS
} from './utils/permissionConstants'

// Utility Functions
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  getPermissionsByCategory,
  getPermissionCategories,
  filterByPermission,
  canAccessResource,
  getPermissionNames
} from './utils/permissions'

// Hooks
export {
  usePermission,
  usePermissions,
  useHasRole,
  useHasAnyRole,
  useUserPermissions,
  useUserRole,
  useUserRoleName
} from './hooks/usePermission'

// Components
export { default as PermissionGate } from './components/common/PermissionGate'
export { default as RoleGate } from './components/common/RoleGate'
export { default as ProtectedRoute } from './routes/ProtectedRoute'

// Selectors
export {
  selectUser,
  selectUserRole,
  selectPermissions,
  selectIsAuthenticated,
  selectHasPermission,
  selectHasAnyPermission,
  selectHasAllPermissions
} from './store/slices/authSlice'
