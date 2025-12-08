/**
 * RoleGate Component
 * 
 * Conditionally renders children based on user roles.
 * Simpler alternative to PermissionGate when you just need to check roles.
 * 
 * @example
 * ```typescript
 * // Show only to admins
 * <RoleGate role="admin">
 *   <AdminPanel />
 * </RoleGate>
 * 
 * // Show to doctors or nurses
 * <RoleGate roles={['doctor', 'nurse']}>
 *   <MedicalStaffDashboard />
 * </RoleGate>
 * 
 * // Show fallback for unauthorized
 * <RoleGate role="admin" fallback={<AccessDeniedMessage />}>
 *   <AdminSettings />
 * </RoleGate>
 * ```
 */

import { ReactNode } from 'react'
import { useAppSelector } from '../../store'
import type { RoleName } from '../../types/permissions'

interface RoleGateProps {
    /** Single role required (exact match) */
    role?: RoleName
    /** Multiple roles (user needs at least one) */
    roles?: RoleName[]
    /** Fallback content to show if role check fails */
    fallback?: ReactNode
    /** Content to show if role check passes */
    children: ReactNode
    /** Callback when access is denied (for analytics/logging) */
    onDenied?: () => void
}

/**
 * Conditionally render children based on user roles
 */
export default function RoleGate({
    role,
    roles,
    fallback = null,
    children,
    onDenied
}: RoleGateProps) {
    const user = useAppSelector(s => s.auth.user)
    const userRole = user?.role?.name as RoleName

    // If no role requirement specified, render children
    if (!role && !roles) {
        return <>{children}</>
    }

    // Check single role
    if (role && userRole !== role) {
        onDenied?.()
        return <>{fallback}</>
    }

    // Check any of multiple roles
    if (roles && !roles.includes(userRole)) {
        onDenied?.()
        return <>{fallback}</>
    }

    return <>{children}</>
}
