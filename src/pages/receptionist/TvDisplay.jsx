import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQueue } from '@/api/queue'
import { getTodayDate } from '@/lib/utils'

export default function TvDisplay() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate())

  const { data } = useQuery({
    queryKey: ['queue', selectedDate],
    queryFn: () => getQueue(selectedDate).then((r) => r.data),
    enabled: !!selectedDate,
    refetchInterval: 15000,
  })

  const queue = Array.isArray(data) ? data : (data?.queue || [])

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">TV display – Queue</h1>

      <div className="bg-white border border-gray-200 rounded p-5 max-w-lg">
        <div className="flex items-center gap-3 mb-5">
          <label className="text-sm text-gray-600">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {queue.length === 0 ? (
          <p className="text-sm text-gray-500">No queue for this date.</p>
        ) : (
          <div className="space-y-2">
            {queue.map((entry) => {
              const patient = entry.appointment?.patient || {}
              const name = patient.name || entry.patientName || '—'
              return (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-sm font-semibold rounded">
                    {entry.tokenNumber}
                  </span>
                  <span className="text-sm text-gray-800">{name}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
