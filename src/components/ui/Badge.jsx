import { cn } from '@/lib/utils'

const styles = {
  waiting: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
  skipped: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
  scheduled: 'bg-purple-100 text-purple-800',
}

export default function Badge({ status, label, className }) {
  const style = styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-600'
  return (
    <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium', style, className)}>
      {label || status}
    </span>
  )
}
