import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'No data found', description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
      <Icon size={32} className="mb-3 text-gray-300" />
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  )
}
