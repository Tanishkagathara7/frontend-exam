import { Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

const roleHome = {
  admin: '/admin',
  patient: '/patient',
  receptionist: '/receptionist',
  doctor: '/doctor',
}

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useAuthStore()

  if (!token || !user) return <Navigate to="/login" replace />

  const role = user.role?.toLowerCase()
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={roleHome[role] || '/login'} replace />
  }

  return children
}

export function PublicRoute({ children }) {
  const { user, token } = useAuthStore()
  if (token && user) {
    const role = user.role?.toLowerCase()
    return <Navigate to={roleHome[role] || '/login'} replace />
  }
  return children
}
