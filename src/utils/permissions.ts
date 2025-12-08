/**
 * Permission utility functions
 * 
 * Core utilities for checking user permissions and roles.
 * These are used by hooks, components, and route guards.
 */

import type { Permission } from '../types/api'
import type { PermissionName, RoleName, PermissionCategory } from '../types/permissions'
import type { User } from '../types/models'

/**
 * Check if user has a specific permission
 * 
 * @param userPermissions - Array of user's permissions
 * @param requiredPermission - Permission name to check
 * @returns true if user has the permission
 * 
 * @example
 * ```typescript
 * if (hasPermission(user.permissions, 'create_patient_records')) {
 *   // User can create patients
 * }
 * ```
 */
export const hasPermission = (
  userPermissions: Permission[],
  requiredPermission: PermissionName
): boolean => {
  return userPermissions.some(p => p.name === requiredPermission)
}

/**
 * Check if user has ANY of the specified permissions (OR logic)
 * 
 * @param userPermissions - Array of user's permissions
 * @param requiredPermissions - Array of permission names (user needs at least one)
 * @returns true if user has at least one of the permissions
 * 
 * @example
 * ```typescript
 * // User needs either permission to view patients
 * const canView = hasAnyPermission(
 *   user.permissions,
 *   ['view_all_patients', 'view_assigned_patients']
 * )
 * ```
 */
export const hasAnyPermission = (
  userPermissions: Permission[],
  requiredPermissions: PermissionName[]
): boolean => {
  return requiredPermissions.some(reqPerm =>
    userPermissions.some(userPerm => userPerm.name === reqPerm)
  )
}

/**
 * Check if user has ALL of the specified permissions (AND logic)
 * 
 * @param userPermissions - Array of user's permissions
 * @param requiredPermissions - Array of permission names (user needs all)
 * @returns true if user has all of the permissions
 * 
 * @example
 * ```typescript
 * // User needs both permissions
 * const canManage = hasAllPermissions(
 *   user.permissions,
 *   ['view_lab_orders', 'edit_lab_orders']
 * )
 * ```
 */
export const hasAllPermissions = (
  userPermissions: Permission[],
  requiredPermissions: PermissionName[]
): boolean => {
  return requiredPermissions.every(reqPerm =>
    userPermissions.some(userPerm => userPerm.name === reqPerm)
  )
}

/**
 * Check if user has a specific role
 * 
 * @param user - User object
 * @param roleName - Role name to check
 * @returns true if user has the role
 * 
 * @example
 * ```typescript
 * if (hasRole(user, 'admin')) {
 *   // User is an admin
 * }
 * ```
 */
export const hasRole = (
  user: User | null,
  roleName: RoleName
): boolean => {
  return user?.role?.name === roleName
}

/**
 * Check if user has any of the specified roles
 * 
 * @param user - User object
 * @param roleNames - Array of role names
 * @returns true if user has at least one of the roles
 * 
 * @example
 * ```typescript
 * if (hasAnyRole(user, ['doctor', 'nurse'])) {
 *   // User is medical staff
 * }
 * ```
 */
export const hasAnyRole = (
  user: User | null,
  roleNames: RoleName[]
): boolean => {
  return roleNames.includes(user?.role?.name as RoleName)
}

/**
 * Get all permissions for a specific category
 * 
 * @param permissions - Array of permissions
 * @param category - Category to filter by
 * @returns Array of permissions in that category
 * 
 * @example
 * ```typescript
 * const patientPerms = getPermissionsByCategory(
 *   allPermissions,
 *   'patient_records'
 * )
 * ```
 */
export const getPermissionsByCategory = (
  permissions: Permission[],
  category: PermissionCategory
): Permission[] => {
  return permissions.filter(p => p.category === category)
}

/**
 * Get unique permission categories from permissions array
 * 
 * @param permissions - Array of permissions
 * @returns Array of unique category names
 * 
 * @example
 * ```typescript
 * const categories = getPermissionCategories(user.permissions)
 * // Returns ['patient_records', 'appointments', ...]
 * ```
 */
export const getPermissionCategories = (permissions: Permission[]): PermissionCategory[] => {
  const categories = permissions.map(p => p.category as PermissionCategory)
  return Array.from(new Set(categories))
}

/**
 * Filter an array of items based on permission check
 * 
 * @param items - Array of items to filter
 * @param userPermissions - User's permissions
 * @param getRequiredPermission - Function to get required permission from item
 * @returns Filtered array of items user has permission for
 * 
 * @example
 * ```typescript
 * const visibleMenuItems = filterByPermission(
 *   menuItems,
 *   user.permissions,
 *   item => item.requiredPermission
 * )
 * ```
 */
export const filterByPermission = <T>(
  items: T[],
  userPermissions: Permission[],
  getRequiredPermission: (item: T) => PermissionName | undefined
): T[] => {
  return items.filter(item => {
    const required = getRequiredPermission(item)
    if (!required) return true // No permission required
    return hasPermission(userPermissions, required)
  })
}

/**
 * Check if user can access a resource based on multiple permission requirements
 * 
 * @param userPermissions - User's permissions
 * @param resourcePermissions - Object with permission requirements
 * @returns true if user meets all requirements
 * 
 * @example
 * ```typescript
 * const canAccess = canAccessResource(user.permissions, {
 *   requireAll: ['view_patients', 'edit_patients'],
 *   requireAny: ['view_all_patients', 'view_assigned_patients']
 * })
 * ```
 */
export const canAccessResource = (
  userPermissions: Permission[],
  resourcePermissions: {
    requireAll?: PermissionName[]
    requireAny?: PermissionName[]
  }
): boolean => {
  const { requireAll, requireAny } = resourcePermissions
  
  if (requireAll && !hasAllPermissions(userPermissions, requireAll)) {
    return false
  }
  
  if (requireAny && !hasAnyPermission(userPermissions, requireAny)) {
    return false
  }
  
  return true
}

/**
 * Get permission names as array of strings
 * 
 * @param permissions - Array of permission objects
 * @returns Array of permission name strings
 * 
 * @example
 * ```typescript
 * const permNames = getPermissionNames(user.permissions)
 * // Returns ['create_users', 'view_all_users', ...]
 * ```
 */
export const getPermissionNames = (permissions: Permission[]): PermissionName[] => {
  return permissions.map(p => p.name as PermissionName)
}
