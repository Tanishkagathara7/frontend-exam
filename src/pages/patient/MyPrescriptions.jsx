import { useQuery } from '@tanstack/react-query'
import { getMyPrescriptions } from '@/api/medical'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Pill } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function MyPrescriptions() {
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ['my-prescriptions'],
    queryFn: () => getMyPrescriptions().then((r) => (Array.isArray(r.data) ? r.data : [])),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton /><CardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My Prescriptions</h1>
        <p className="text-sm text-gray-500">{prescriptions.length} total</p>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <EmptyState icon={Pill} title="No prescriptions yet" />
        </Card>
      ) : (
        prescriptions.map((presc) => (
          <Card key={presc.id}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-900">Prescription</p>
              <div className="text-right">
                {presc.doctor && <p className="text-xs text-gray-400">Dr. {presc.doctor.name}</p>}
                {presc.createdAt && (
                  <p className="text-xs text-gray-400">{formatDate(presc.createdAt)}</p>
                )}
              </div>
            </div>

            {presc.medicines?.length > 0 && (
              <table className="w-full text-sm mb-3">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-2">Medicine</th>
                    <th className="pb-2">Dosage</th>
                    <th className="pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {presc.medicines.map((med, i) => (
                    <tr key={i}>
                      <td className="py-1.5 font-medium text-gray-800">{med.name}</td>
                      <td className="py-1.5 text-gray-600">{med.dosage}</td>
                      <td className="py-1.5 text-gray-600">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {presc.notes && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">{presc.notes}</p>
            )}
          </Card>
        ))
      )}
    </div>
  )
}
