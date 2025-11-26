import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store'
import type { ReactElement } from 'react'
import AccessDenied from '../pages/AccessDenied'
import { hasPermission, hasAnyPermission } from '../utils/permissions'

export default function ProtectedRoute({
  element,
  permission,
  permissions
}: {
  element: ReactElement
  permission?: string
  permissions?: string[]
}) {
  const { isAuthenticated, permissions: userPermissions } = useAppSelector((s) => s.auth)

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />

  // Check single permission
  if (permission && !hasPermission(userPermissions, permission)) {
    return <AccessDenied />
  }

  // Check any of multiple permissions
  if (permissions && !hasAnyPermission(userPermissions, permissions)) {
    return <AccessDenied />
  }

  return element
}