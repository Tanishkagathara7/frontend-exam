import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, ClipboardList, Stethoscope, LogOut, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import useAuthStore from '@/store/authStore'

const NAV_ITEMS = {
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
  const navItems = NAV_ITEMS[role] || []

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-200',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200">
          <span className="font-bold text-gray-900">ClinicQ</span>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{role}</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors',
                isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
