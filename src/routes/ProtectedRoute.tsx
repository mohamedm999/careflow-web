/**
 * ProtectedRoute Component
 * 
 * Route guard that checks authentication and permissions/roles before rendering.
 * Redirects to login if not authenticated, shows Access Denied if unauthorized.
 * 
 * @example
 * ```typescript
 * // Require authentication only
 * <ProtectedRoute element={<Dashboard />} />
 * 
 * // Require specific permission
 * <ProtectedRoute 
 *   element={<PatientList />} 
 *   permission="view_all_patients" 
 * />
 * 
 * // Require any of multiple permissions
 * <ProtectedRoute 
 *   element={<DocumentList />}
 *   permissions={['view_all_documents', 'view_own_documents']}
 * />
 * 
 * // Require all permissions (AND logic)
 * <ProtectedRoute 
 *   element={<LabManagement />}
 *   permissions={['view_lab_orders', 'edit_lab_orders']}
 *   requireAll
 * />
 * 
 * // Require specific role
 * <ProtectedRoute 
 *   element={<AdminPanel />}
 *   role="admin"
 * />
 * 
 * // Require any of multiple roles
 * <ProtectedRoute 
 *   element={<MedicalDashboard />}
 *   roles={['doctor', 'nurse']}
 * />
 * ```
 */

import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store'
import type { ReactElement } from 'react'
import AccessDenied from '../pages/AccessDenied'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions'
import type { PermissionName, RoleName } from '../types/permissions'

interface ProtectedRouteProps {
  /** The element to render if authorized */
  element: ReactElement
  /** Single permission required */
  permission?: PermissionName
  /** Multiple permissions */
  permissions?: PermissionName[]
  /** If true with permissions array, requires ALL permissions (AND logic). Default: false (OR logic) */
  requireAll?: boolean
  /** Single role required */
  role?: RoleName
  /** Multiple roles (user needs at least one) */
  roles?: RoleName[]
  /** Custom redirect path for unauthenticated users */
  redirectTo?: string
}

export default function ProtectedRoute({
  element,
  permission,
  permissions,
  requireAll = false,
  role,
  roles,
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, permissions: userPermissions, user } = useAppSelector((s) => s.auth)

  // 1. Check authentication
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // 2. Check role requirements
  const userRole = user?.role?.name as RoleName

  if (role && userRole !== role) {
    return <AccessDenied />
  }

  if (roles && !roles.includes(userRole)) {
    return <AccessDenied />
  }

  // 3. Check permission requirements

  // Single permission check
  if (permission && !hasPermission(userPermissions, permission)) {
    return <AccessDenied />
  }

  // Multiple permissions check
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(userPermissions, permissions)
      : hasAnyPermission(userPermissions, permissions)

    if (!hasAccess) {
      return <AccessDenied />
    }
  }

  // All checks passed - render the protected element
  return element
}