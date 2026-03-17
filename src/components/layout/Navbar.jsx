import { Menu } from 'lucide-react'
import useAuthStore from '@/store/authStore'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuthStore()
  const initials = user?.name?.[0]?.toUpperCase() || '?'

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded hover:bg-gray-100 mr-3"
        aria-label="Open menu"
      >
        <Menu size={18} className="text-gray-600" />
      </button>

      <span className="text-sm text-gray-500 hidden lg:block">{user?.name}</span>

      <div className="ml-auto">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
          {initials}
        </div>
      </div>
    </header>
  )
}
