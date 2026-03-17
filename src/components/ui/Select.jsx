import { cn } from '@/lib/utils'

export default function Select({ label, error, options = [], className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={cn(
          'w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
