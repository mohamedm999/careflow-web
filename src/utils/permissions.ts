import type { Permission } from '../types/api'

/**
 * Check if user has a specific permission
 * @param userPermissions - Array of user's permissions
 * @param requiredPermission - Permission name to check
 * @returns true if user has the permission
 */
export const hasPermission = (
  userPermissions: Permission[],
  requiredPermission: string
): boolean => {
  return userPermissions.some(p => p.name === requiredPermission)
}

/**
 * Check if user has ANY of the specified permissions
 * @param userPermissions - Array of user's permissions
 * @param requiredPermissions - Array of permission names (user needs at least one)
 * @returns true if user has at least one of the permissions
 */
export const hasAnyPermission = (
  userPermissions: Permission[],
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.some(reqPerm =>
    userPermissions.some(userPerm => userPerm.name === reqPerm)
  )
}

/**
 * Check if user has ALL of the specified permissions
 * @param userPermissions - Array of user's permissions
 * @param requiredPermissions - Array of permission names (user needs all)
 * @returns true if user has all of the permissions
 */
export const hasAllPermissions = (
  userPermissions: Permission[],
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.every(reqPerm =>
    userPermissions.some(userPerm => userPerm.name === reqPerm)
  )
}

/**
 * Get all permissions for a specific category
 * @param permissions - Array of permissions
 * @param category - Category to filter by
 * @returns Array of permissions in that category
 */
export const getPermissionsByCategory = (
  permissions: Permission[],
  category: string
): Permission[] => {
  return permissions.filter(p => p.category === category)
}

/**
 * Get unique permission categories from permissions array
 * @param permissions - Array of permissions
 * @returns Array of unique category names
 */
export const getPermissionCategories = (permissions: Permission[]): string[] => {
  const categories = permissions.map(p => p.category)
  return Array.from(new Set(categories))
}
