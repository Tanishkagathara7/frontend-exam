import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'

import LoginPage from '@/pages/auth/LoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import UsersPage from '@/pages/admin/UsersPage'
import PatientDashboard from '@/pages/patient/PatientDashboard'
import AppointmentDetail from '@/pages/patient/AppointmentDetail'
import ReceptionistDashboard from '@/pages/receptionist/ReceptionistDashboard'
import DoctorDashboard from '@/pages/doctor/DoctorDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
})

function DashboardWrapper({ children, roles }) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<DashboardWrapper roles={['admin']}><AdminDashboard /></DashboardWrapper>} />
          <Route path="/admin/users" element={<DashboardWrapper roles={['admin']}><UsersPage /></DashboardWrapper>} />

          {/* Patient */}
          <Route path="/patient" element={<DashboardWrapper roles={['patient']}><PatientDashboard /></DashboardWrapper>} />
          <Route path="/patient/appointments/:id" element={<DashboardWrapper roles={['patient']}><AppointmentDetail /></DashboardWrapper>} />

          {/* Receptionist */}
          <Route path="/receptionist" element={<DashboardWrapper roles={['receptionist']}><ReceptionistDashboard /></DashboardWrapper>} />

          {/* Doctor */}
          <Route path="/doctor" element={<DashboardWrapper roles={['doctor']}><DoctorDashboard /></DashboardWrapper>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  )
}
