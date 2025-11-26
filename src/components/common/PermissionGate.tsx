import { ReactNode } from 'react'
import { useAppSelector } from '../../store'
import { hasPermission, hasAnyPermission } from '../../utils/permissions'

interface PermissionGateProps {
    /** Single permission required (exact match) */
    permission?: string
    /** Multiple permissions (user needs at least one) */
    permissions?: string[]
    /** Fallback content to show if permission check fails */
    fallback?: ReactNode
    /** Content to show if permission check passes */
    children: ReactNode
}

/**
 * Conditionally render children based on user permissions
 * 
 * @example
 * <PermissionGate permission="create_patients">
 *   <Button>Create Patient</Button>
 * </PermissionGate>
 * 
 * @example
 * <PermissionGate permissions={["view_all_patients", "view_own_patients"]}>
 *   <PatientList />
 * </PermissionGate>
 */
export default function PermissionGate({
    permission,
    permissions,
    fallback = null,
    children
}: PermissionGateProps) {
    const { permissions: userPermissions } = useAppSelector(s => s.auth)

    // If no permission requirement specified, render children
    if (!permission && !permissions) {
        return <>{children}</>
    }

    // Check single permission
    if (permission && !hasPermission(userPermissions, permission)) {
        return <>{fallback}</>
    }

    // Check any of multiple permissions
    if (permissions && !hasAnyPermission(userPermissions, permissions)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
