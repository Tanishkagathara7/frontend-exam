import { Menu, Bell } from 'lucide-react'
import useAuthStore from '@/store/authStore'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      <div className="hidden lg:block">
        <h1 className="text-sm font-medium text-gray-500">
          Welcome back, <span className="text-gray-900 font-semibold">{user?.name}</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold text-sm">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
