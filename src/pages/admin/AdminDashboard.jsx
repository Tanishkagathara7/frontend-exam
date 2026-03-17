import { useQuery } from '@tanstack/react-query'
import { getClinicInfo } from '@/api/admin'
import Card from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'

export default function AdminDashboard() {
  const { data: clinic, isLoading, error } = useQuery({
    queryKey: ['clinic-info'],
    queryFn: () => getClinicInfo().then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
      </div>
    )
  }

  if (error) return <p className="text-sm text-red-500">Could not load clinic info.</p>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">My Clinic</h1>

      <Card>
        <h2 className="text-base font-semibold text-gray-900">{clinic.name || '—'}</h2>

        {(clinic.code || clinic.uniqueCode) && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm font-medium text-gray-700">Clinic code:</span>
            <span className="text-sm font-mono bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
              {clinic.code || clinic.uniqueCode}
            </span>
          </div>
        )}

        {(clinic.code || clinic.uniqueCode) && (
          <p className="text-sm text-gray-500 mt-2">
            Share this code with patients, doctors, and receptionists so they can register and join your clinic.
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {clinic.phone && <span>{clinic.phone}</span>}
          {clinic.address && <span>{clinic.address}</span>}
          {clinic.website && <span>{clinic.website}</span>}
        </div>

        {(clinic.userCount != null || clinic.appointmentCount != null) && (
          <p className="text-sm text-gray-600 mt-4">
            {clinic.userCount != null && `Users: ${clinic.userCount}`}
            {clinic.userCount != null && clinic.appointmentCount != null && ' · '}
            {clinic.appointmentCount != null && `Appointments: ${clinic.appointmentCount}`}
          </p>
        )}
      </Card>
    </div>
  )
}
