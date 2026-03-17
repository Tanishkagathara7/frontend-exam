import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMyAppointments } from '@/api/appointments'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function MyAppointments() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => getMyAppointments().then((r) => r.data),
  })

  const appointments = data?.appointments || data || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => <CardSkeleton key={n} />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My Appointments</h1>
        <p className="text-sm text-gray-500">Track your visits</p>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <EmptyState icon={Calendar} title="No appointments yet" description="Book an appointment from the dashboard" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((apt) => {
            const id = apt._id || apt.id
            return (
              <Link key={id} to={`/patient/appointments/${id}`}>
                <Card className="hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{apt.timeSlot || 'Appointment'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(apt.appointmentDate || apt.createdAt)}
                      </p>
                      {apt.doctor && (
                        <p className="text-xs text-gray-400 mt-1">
                          Dr. {apt.doctor?.name || apt.doctorName}
                        </p>
                      )}
                    </div>
                    <Badge status={apt.status || 'scheduled'} label={apt.status || 'Scheduled'} />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
