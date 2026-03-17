import { cn } from '@/lib/utils'

export default function Card({ children, className, ...props }) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded p-5', className)} {...props}>
      {children}
    </div>
  )
}
