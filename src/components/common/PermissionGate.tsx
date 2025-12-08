/**
 * PermissionGate Component
 * 
 * Conditionally renders children based on user permissions.
 * Use this to hide/show UI elements based on what the user can do.
 * 
 * @example
 * ```typescript
 * // Single permission
 * <PermissionGate permission="create_patient_records">
 *   <Button>Create Patient</Button>
 * </PermissionGate>
 * 
 * // Any of multiple permissions (OR logic)
 * <PermissionGate permissions={['view_all_patients', 'view_assigned_patients']}>
 *   <PatientList />
 * </PermissionGate>
 * 
 * // All permissions required (AND logic)
 * <PermissionGate 
 *   permissions={['view_lab_orders', 'edit_lab_orders']}
 *   requireAll
 * >
 *   <LabManagementPanel />
 * </PermissionGate>
 * 
 * // With fallback content
 * <PermissionGate 
 *   permission="create_users"
 *   fallback={<Typography>You don't have permission</Typography>}
 * >
 *   <CreateUserButton />
 * </PermissionGate>
 * ```
 */

import { ReactNode } from 'react'
import { useAppSelector } from '../../store'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../../utils/permissions'
import type { PermissionName } from '../../types/permissions'

interface PermissionGateProps {
    /** Single permission required (exact match) */
    permission?: PermissionName
    /** Multiple permissions */
    permissions?: PermissionName[]
    /** If true with permissions array, requires ALL permissions (AND logic). Default: false (OR logic) */
    requireAll?: boolean
    /** Fallback content to show if permission check fails */
    fallback?: ReactNode
    /** Content to show if permission check passes */
    children: ReactNode
    /** Callback when access is denied (for analytics/logging) */
    onDenied?: () => void
}

/**
 * Conditionally render children based on user permissions
 */
export default function PermissionGate({
    permission,
    permissions,
    requireAll = false,
    fallback = null,
    children,
    onDenied
}: PermissionGateProps) {
    const { permissions: userPermissions } = useAppSelector(s => s.auth)

    // If no permission requirement specified, render children
    if (!permission && !permissions) {
        return <>{children}</>
    }

    // Check single permission
    if (permission && !hasPermission(userPermissions, permission)) {
        onDenied?.()
        return <>{fallback}</>
    }

    // Check multiple permissions
    if (permissions) {
        const hasAccess = requireAll
            ? hasAllPermissions(userPermissions, permissions)
            : hasAnyPermission(userPermissions, permissions)

        if (!hasAccess) {
            onDenied?.()
            return <>{fallback}</>
        }
    }

    return <>{children}</>
}

