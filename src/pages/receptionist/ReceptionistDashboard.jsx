import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getQueue, updateQueueStatus } from '@/api/queue'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { ClipboardList } from 'lucide-react'
import { getTodayDate } from '@/lib/utils'

export default function ReceptionistDashboard() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(getTodayDate())

  const { data, isLoading } = useQuery({
    queryKey: ['queue', selectedDate],
    queryFn: () => getQueue(selectedDate).then((r) => r.data),
    enabled: !!selectedDate,
  })

  const { mutate: changeStatus, isPending: updating } = useMutation({
    mutationFn: ({ queueId, status }) => updateQueueStatus(queueId, status),
    onSuccess: () => {
      toast.success('Status updated')
      queryClient.invalidateQueries({ queryKey: ['queue', selectedDate] })
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Invalid status transition'),
  })

  const queue = Array.isArray(data) ? data : (data?.queue || [])

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">Queue (manage)</h1>

      <Card>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-fit"
          />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-5"><TableSkeleton /></div>
        ) : queue.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No queue for this date" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Token', 'Patient', 'Phone', 'Time slot', 'Status', 'Actions'].map((col) => (
                    <th key={col} className="text-left text-sm font-medium text-gray-700 px-5 py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queue.map((entry) => {
                  const patient = entry.appointment?.patient || {}
                  const status = entry.status || 'waiting'
                  const timeSlot = entry.appointment?.timeSlot || entry.timeSlot || '—'
                  const isDone = status === 'done' || status === 'skipped'

                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-900">{entry.tokenNumber}</td>
                      <td className="px-5 py-3 text-gray-900">{patient.name || entry.patientName || '—'}</td>
                      <td className="px-5 py-3 text-gray-600">{patient.phone || '—'}</td>
                      <td className="px-5 py-3 text-gray-600">{timeSlot}</td>
                      <td className="px-5 py-3"><Badge status={status} label={status} /></td>
                      <td className="px-5 py-3">
                        {isDone ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {status === 'waiting' && (
                              <Button
                                size="sm"
                                disabled={updating}
                                onClick={() => changeStatus({ queueId: entry.id, status: 'in-progress' })}
                              >
                                In progress
                              </Button>
                            )}
                            {(status === 'in_progress' || status === 'in-progress') && (
                              <Button
                                size="sm"
                                disabled={updating}
                                onClick={() => changeStatus({ queueId: entry.id, status: 'done' })}
                              >
                                Done
                              </Button>
                            )}
                            {status === 'waiting' && (
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={updating}
                                onClick={() => changeStatus({ queueId: entry.id, status: 'skipped' })}
                              >
                                Skip
                              </Button>
                            )}
                          </div>
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
