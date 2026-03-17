import { cn } from '@/lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-gray-200 rounded-xl', className)} />
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
