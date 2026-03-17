import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'
import PatientLayout from '@/components/layout/PatientLayout'
import ReceptionistLayout from '@/components/layout/ReceptionistLayout'
import DoctorLayout from '@/components/layout/DoctorLayout'
import LoginPage from '@/pages/auth/LoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import UsersPage from '@/pages/admin/UsersPage'
import PatientDashboard from '@/pages/patient/PatientDashboard'
import MyAppointments from '@/pages/patient/MyAppointments'
import AppointmentDetail from '@/pages/patient/AppointmentDetail'
import MyPrescriptions from '@/pages/patient/MyPrescriptions'
import MyReports from '@/pages/patient/MyReports'
import ReceptionistDashboard from '@/pages/receptionist/ReceptionistDashboard'
import TvDisplay from '@/pages/receptionist/TvDisplay'
import DoctorDashboard from '@/pages/doctor/DoctorDashboard'
import AddPrescription from '@/pages/doctor/AddPrescription'
import AddReport from '@/pages/doctor/AddReport'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout><UsersPage /></AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout><PatientDashboard /></PatientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout><MyAppointments /></PatientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments/:id"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout><AppointmentDetail /></PatientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout><MyPrescriptions /></PatientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/reports"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout><MyReports /></PatientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/receptionist"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <ReceptionistLayout><ReceptionistDashboard /></ReceptionistLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/tv"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <ReceptionistLayout><TvDisplay /></ReceptionistLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorLayout><DoctorDashboard /></DoctorLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescription"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorLayout><AddPrescription /></DoctorLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/report"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorLayout><AddReport /></DoctorLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px' } }} />
    </QueryClientProvider>
  )
}
