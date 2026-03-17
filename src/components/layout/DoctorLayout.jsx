import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import useAuthStore from '@/store/authStore'

export default function DoctorLayout({ children }) {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2">
          <div className="flex items-center gap-2 mr-3 shrink-0">
            <span className="font-bold text-gray-900 text-sm">Clinic Queue</span>
            {user?.clinicName && (
              <span className="text-xs text-gray-500">{user.clinicName}</span>
            )}
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
              doctor
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            <NavLink
              to="/doctor"
              end
              className={({ isActive }) => cn(
                'px-3 py-1.5 rounded text-sm transition-colors whitespace-nowrap',
                isActive ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              )}
            >
              Today's Queue
            </NavLink>
            <NavLink
              to="/doctor/prescription"
              className={({ isActive }) => cn(
                'px-3 py-1.5 rounded text-sm transition-colors whitespace-nowrap',
                isActive ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              )}
            >
              Add Prescription
            </NavLink>
            <NavLink
              to="/doctor/report"
              className={({ isActive }) => cn(
                'px-3 py-1.5 rounded text-sm transition-colors whitespace-nowrap',
                isActive ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              )}
            >
              Add Report
            </NavLink>
          </nav>

          <button
            onClick={logout}
            className="ml-auto text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
