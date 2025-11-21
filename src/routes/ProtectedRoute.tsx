import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store'
import type { ReactElement } from 'react'
import AccessDenied from '../pages/AccessDenied'

export default function ProtectedRoute({ element, permission }: { element: ReactElement; permission?: string }) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth)
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  if (permission && user && !user.role.permissions.some((p) => p.name === permission)) {
    return <AccessDenied />
  }
  return element
}