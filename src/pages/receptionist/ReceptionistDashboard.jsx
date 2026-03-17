import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getQueue, updateQueueStatus } from '@/api/queue'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { ClipboardList, RefreshCw } from 'lucide-react'
import { getTodayDate } from '@/lib/utils'

// Valid transitions per API: waiting->in-progress|skipped; in-progress->done
const nextStatuses = {
  waiting: [
    { value: 'waiting', label: 'Waiting' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'skipped', label: 'Skipped' },
  ],
  'in-progress': [
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ],
  done: [{ value: 'done', label: 'Done' }],
  skipped: [{ value: 'skipped', label: 'Skipped' }],
}

export default function ReceptionistDashboard() {
  const qc = useQueryClient()
  const [date, setDate] = useState(getTodayDate())

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['queue', date],
    queryFn: () => getQueue(date).then((r) => r.data),
    enabled: !!date,
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateQueueStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated')
      qc.invalidateQueries({ queryKey: ['queue', date] })
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Invalid status transition'),
  })

  // API returns array directly
  const queue = Array.isArray(data) ? data : (data?.queue || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-500 text-sm mt-1">{queue.length} patients in queue</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button variant="secondary" onClick={() => refetch()}>
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : queue.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No queue for this date" description="Select a different date or check back later" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Token', 'Patient', 'Phone', 'Status', 'Update Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {queue.map((item) => {
                  const patient = item.appointment?.patient || {}
                  const currentStatus = item.status || 'waiting'
                  const options = nextStatuses[currentStatus] || nextStatuses.waiting
                  const isTerminal = currentStatus === 'done' || currentStatus === 'skipped'

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="w-8 h-8 rounded-lg gradient-primary text-white text-xs font-bold flex items-center justify-center">
                          {item.tokenNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{patient.name || '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {patient.phone || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={currentStatus} label={currentStatus} />
                      </td>
                      <td className="px-6 py-4">
                        {isTerminal ? (
                          <span className="text-xs text-gray-400 italic">No further updates</span>
                        ) : (
                          <Select
                            options={options}
                            value={currentStatus}
                            onChange={(e) => {
                              if (e.target.value !== currentStatus) {
                                mutation.mutate({ id: item.id, status: e.target.value })
                              }
                            }}
                            className="w-40 py-1.5"
                          />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
