import { useQuery } from '@tanstack/react-query'
import { getClinic } from '@/api/admin'
import Card from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Building2, Phone, MapPin, Globe } from 'lucide-react'

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['clinic'],
    queryFn: () => getClinic().then((r) => r.data),
  })

  if (isLoading) return (
    <div className="space-y-4">
      <CardSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton /><CardSkeleton /><CardSkeleton />
      </div>
    </div>
  )

  if (error) return (
    <Card className="text-center py-12 text-red-500">
      Failed to load clinic info. Please try again.
    </Card>
  )

  const clinic = data || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your clinic settings and users</p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 gradient-primary opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{clinic.name || 'Clinic Name'}</h2>
            <p className="text-gray-500 text-sm mt-1">{clinic.description || 'No description'}</p>
            <div className="flex flex-wrap gap-4 mt-4">
              {clinic.phone && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Phone size={14} className="text-blue-500" />
                  {clinic.phone}
                </div>
              )}
              {clinic.address && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPin size={14} className="text-blue-500" />
                  {clinic.address}
                </div>
              )}
              {clinic.website && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Globe size={14} className="text-blue-500" />
                  {clinic.website}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: clinic.userCount ?? '—', color: 'from-blue-500 to-indigo-500' },
          { label: 'Total Appointments', value: clinic.appointmentCount ?? '—', color: 'from-purple-500 to-pink-500' },
          { label: 'Queue Entries', value: clinic.queueCount ?? '—', color: 'from-emerald-500 to-teal-500' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
