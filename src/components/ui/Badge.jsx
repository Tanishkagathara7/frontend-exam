import { cn } from '@/lib/utils'

const statusStyles = {
  waiting: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  done: 'bg-green-100 text-green-700 border-green-200',
  skipped: 'bg-gray-100 text-gray-500 border-gray-200',
  cancelled: 'bg-red-100 text-red-600 border-red-200',
  scheduled: 'bg-purple-100 text-purple-700 border-purple-200',
}

export default function Badge({ status, label, className }) {
  const style = statusStyles[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', style, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {label || status}
    </span>
  )
}
