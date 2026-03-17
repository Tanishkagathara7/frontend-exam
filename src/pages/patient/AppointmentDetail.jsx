import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAppointmentById } from '@/api/appointments'
import { getMyPrescriptions, getMyReports } from '@/api/medical'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AppointmentDetail() {
  const { id } = useParams()
  const numericId = Number(id)

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointmentById(id).then((r) => r.data),
  })

  const { data: allPrescriptions = [] } = useQuery({
    queryKey: ['my-prescriptions'],
    queryFn: () => getMyPrescriptions().then((r) => (Array.isArray(r.data) ? r.data : [])),
  })

  const { data: allReports = [] } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => getMyReports().then((r) => (Array.isArray(r.data) ? r.data : [])),
  })

  const prescriptions = allPrescriptions.filter(
    (p) => p.appointmentId === numericId || p.appointment?.id === numericId
  )
  const reports = allReports.filter(
    (r) => r.appointmentId === numericId || r.appointment?.id === numericId
  )

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <CardSkeleton /><CardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/patient">
          <Button variant="ghost" size="sm"><ArrowLeft size={14} /> Back</Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Appointment Details</h1>
      </div>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-gray-900">
              {formatDate(appointment?.appointmentDate || appointment?.createdAt)}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{appointment?.timeSlot || '—'}</p>
          </div>
          <Badge
            status={appointment?.status || 'scheduled'}
            label={appointment?.status || 'scheduled'}
          />
        </div>

        {appointment?.queueEntry && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            <span className="text-xl font-bold text-blue-600">
              #{appointment.queueEntry.tokenNumber}
            </span>
            <div>
              <p className="text-xs text-gray-500">Queue Token</p>
              <Badge status={appointment.queueEntry.status} label={appointment.queueEntry.status} />
            </div>
          </div>
        )}
      </Card>

      {prescriptions.length > 0 ? (
        prescriptions.map((presc) => (
          <Card key={presc.id}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-900">Prescription</p>
              {presc.doctor && <p className="text-xs text-gray-400">Dr. {presc.doctor.name}</p>}
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
      ) : (
        <Card><p className="text-sm text-gray-400">No prescription yet</p></Card>
      )}

      {reports.length > 0 ? (
        reports.map((report) => (
          <Card key={report.id}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-900">Medical Report</p>
              {report.doctor && <p className="text-xs text-gray-400">Dr. {report.doctor.name}</p>}
            </div>
            <div className="space-y-3 text-sm">
              {report.diagnosis && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Diagnosis</p>
                  <p className="text-gray-800">{report.diagnosis}</p>
                </div>
              )}
              {report.testRecommended && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Tests Recommended</p>
                  <p className="text-gray-800">{report.testRecommended}</p>
                </div>
              )}
              {report.remarks && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Remarks</p>
                  <p className="text-gray-800">{report.remarks}</p>
                </div>
              )}
            </div>
          </Card>
        ))
      ) : (
        <Card><p className="text-sm text-gray-400">No report yet</p></Card>
      )}
    </div>
  )
}
