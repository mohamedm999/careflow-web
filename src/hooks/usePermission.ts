/**
 * Custom hooks for permission checking
 * 
 * Provides convenient hooks for checking user permissions and roles
 * with automatic Redux selector optimization.
 * 
 * @example
 * ```typescript
 * import { usePermission, usePermissions, useHasRole } from '@/hooks/usePermission'
 * 
 * function MyComponent() {
 *   const canCreate = usePermission('create_patients')
 *   const canViewAny = usePermissions(['view_all_patients', 'view_assigned_patients'], 'any')
 *   const isAdmin = useHasRole('admin')
 * 
 *   if (!canCreate) return null
 *   // ...
 * }
 * ```
 */

import { useMemo } from 'react'
import { useAppSelector } from '../store'
import type { PermissionName, RoleName, PermissionCheckMode } from '../types/permissions'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions'

/**
 * Check if the current user has a specific permission
 * 
 * @param permission - The permission name to check
 * @returns true if user has the permission, false otherwise
 * 
 * @example
 * ```typescript
 * const canCreatePatients = usePermission('create_patient_records')
 * ```
 */
export function usePermission(permission: PermissionName): boolean {
  const permissions = useAppSelector(s => s.auth.permissions)
  
  return useMemo(
    () => hasPermission(permissions, permission),
    [permissions, permission]
  )
}

/**
 * Check if the current user has any/all of the specified permissions
 * 
 * @param permissionList - Array of permission names to check
 * @param mode - 'any' (at least one) or 'all' (every permission required)
 * @returns true if permission check passes, false otherwise
 * 
 * @example
 * ```typescript
 * // User needs at least ONE of these permissions
 * const canViewPatients = usePermissions(['view_all_patients', 'view_assigned_patients'], 'any')
 * 
 * // User needs ALL of these permissions
 * const canManageLab = usePermissions(['view_lab_orders', 'edit_lab_orders'], 'all')
 * ```
 */
export function usePermissions(
  permissionList: PermissionName[],
  mode: PermissionCheckMode = 'any'
): boolean {
  const permissions = useAppSelector(s => s.auth.permissions)
  
  return useMemo(() => {
    if (mode === 'all') {
      return hasAllPermissions(permissions, permissionList)
    }
    return hasAnyPermission(permissions, permissionList)
  }, [permissions, permissionList, mode])
}

/**
 * Check if the current user has a specific role
 * 
 * @param roleName - The role name to check
 * @returns true if user has the role, false otherwise
 * 
 * @example
 * ```typescript
 * const isDoctor = useHasRole('doctor')
 * const isAdmin = useHasRole('admin')
 * ```
 */
export function useHasRole(roleName: RoleName): boolean {
  const user = useAppSelector(s => s.auth.user)
  
  return useMemo(
    () => user?.role?.name === roleName,
    [user?.role?.name, roleName]
  )
}

/**
 * Check if the current user has any of the specified roles
 * 
 * @param roleNames - Array of role names to check
 * @returns true if user has at least one of the roles, false otherwise
 * 
 * @example
 * ```typescript
 * const isMedicalStaff = useHasAnyRole(['doctor', 'nurse'])
 * const isAdminOrSecretary = useHasAnyRole(['admin', 'secretary'])
 * ```
 */
export function useHasAnyRole(roleNames: RoleName[]): boolean {
  const user = useAppSelector(s => s.auth.user)
  
  return useMemo(
    () => roleNames.includes(user?.role?.name as RoleName),
    [user?.role?.name, roleNames]
  )
}

/**
 * Get all permissions for the current user
 * 
 * @returns Array of permission objects
 * 
 * @example
 * ```typescript
 * const permissions = useUserPermissions()
 * console.log(`User has ${permissions.length} permissions`)
 * ```
 */
export function useUserPermissions() {
  return useAppSelector(s => s.auth.permissions)
}

/**
 * Get the current user's role
 * 
 * @returns Role object or null if not authenticated
 * 
 * @example
 * ```typescript
 * const role = useUserRole()
 * if (role) {
 *   console.log(`User role: ${role.name}`)
 * }
 * ```
 */
export function useUserRole() {
  return useAppSelector(s => s.auth.user?.role ?? null)
}

/**
 * Get the current user's role name
 * 
 * @returns Role name string or null if not authenticated
 * 
 * @example
 * ```typescript
 * const roleName = useUserRoleName()
 * // Returns 'admin', 'doctor', etc. or null
 * ```
 */
export function useUserRoleName(): RoleName | null {
  return useAppSelector(s => s.auth.user?.role?.name as RoleName ?? null)
}
