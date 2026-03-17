import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import useAuthStore from '@/store/authStore'
import {
  LayoutDashboard, Users, Calendar, ClipboardList,
  Stethoscope, LogOut, X, Activity
} from 'lucide-react'

const roleNav = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
  ],
  patient: [
    { to: '/patient', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
  ],
  receptionist: [
    { to: '/receptionist', label: 'Queue', icon: ClipboardList },
  ],
  doctor: [
    { to: '/doctor', label: 'My Queue', icon: Stethoscope },
  ],
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuthStore()
  const role = user?.role?.toLowerCase()
  const navItems = roleNav[role] || []

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <Activity size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">ClinicQ</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'gradient-primary text-white shadow-md shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
