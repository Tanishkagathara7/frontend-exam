import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAppointmentById } from '@/api/appointments'
import { getMyPrescriptions, getMyReports } from '@/api/medical'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Calendar, FileText, Pill, User, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AppointmentDetail() {
  const { id } = useParams()
  const aptId = Number(id)

  const { data: apt, isLoading: aptLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointmentById(id).then((r) => r.data),
  })

  const { data: prescriptions = [] } = useQuery({
    queryKey: ['my-prescriptions'],
    queryFn: () => getMyPrescriptions().then((r) => Array.isArray(r.data) ? r.data : []),
  })

  const { data: reports = [] } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => getMyReports().then((r) => Array.isArray(r.data) ? r.data : []),
  })

  // Match prescriptions/reports to this appointment
  const myPresc = prescriptions.filter((p) => p.appointmentId === aptId || p.appointment?.id === aptId)
  const myReport = reports.filter((r) => r.appointmentId === aptId || r.appointment?.id === aptId)

  if (aptLoading) return (
    <div className="space-y-4 max-w-2xl">
      <CardSkeleton /><CardSkeleton />
    </div>
  )

  const appointment = apt || {}

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/patient">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} />Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
      </div>

      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {formatDate(appointment.appointmentDate || appointment.createdAt)}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <Clock size={12} />
                {appointment.timeSlot || '—'}
              </p>
            </div>
          </div>
          <Badge status={appointment.status || 'scheduled'} label={appointment.status || 'scheduled'} />
        </div>

        {appointment.queueEntry && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
            <span className="text-2xl font-bold gradient-text">#{appointment.queueEntry.tokenNumber}</span>
            <div>
              <p className="text-xs text-gray-500">Queue Token</p>
              <Badge status={appointment.queueEntry.status} label={appointment.queueEntry.status} />
            </div>
          </div>
        )}
      </Card>

      {/* Prescriptions */}
      {myPresc.length > 0 ? myPresc.map((presc) => (
        <Card key={presc.id}>
          <div className="flex items-center gap-2 mb-4">
            <Pill size={18} className="text-blue-500" />
            <h3 className="font-semibold text-gray-900">Prescription</h3>
            {presc.doctor && (
              <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                <User size={12} /> Dr. {presc.doctor.name}
              </span>
            )}
          </div>
          {Array.isArray(presc.medicines) && presc.medicines.length > 0 && (
            <div className="space-y-2 mb-3">
              {presc.medicines.map((med, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-blue-50 rounded-xl text-sm">
                  <span className="font-medium text-gray-900 flex-1">{med.name}</span>
                  <span className="text-gray-500">{med.dosage}</span>
                  <span className="text-gray-400">{med.duration}</span>
                </div>
              ))}
            </div>
          )}
          {presc.notes && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{presc.notes}</p>
          )}
        </Card>
      )) : (
        <Card className="text-center py-8">
          <Pill size={28} className="text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No prescription yet</p>
        </Card>
      )}

      {/* Reports */}
      {myReport.length > 0 ? myReport.map((report) => (
        <Card key={report.id}>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-indigo-500" />
            <h3 className="font-semibold text-gray-900">Medical Report</h3>
            {report.doctor && (
              <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                <User size={12} /> Dr. {report.doctor.name}
              </span>
            )}
          </div>
          <div className="space-y-3">
            {report.diagnosis && (
              <div className="p-3 bg-indigo-50 rounded-xl">
                <p className="text-xs font-semibold text-indigo-600 mb-1">Diagnosis</p>
                <p className="text-sm text-gray-800">{report.diagnosis}</p>
              </div>
            )}
            {report.testRecommended && (
              <div className="p-3 bg-purple-50 rounded-xl">
                <p className="text-xs font-semibold text-purple-600 mb-1">Tests Recommended</p>
                <p className="text-sm text-gray-800">{report.testRecommended}</p>
              </div>
            )}
            {report.remarks && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-500 mb-1">Remarks</p>
                <p className="text-sm text-gray-800">{report.remarks}</p>
              </div>
            )}
          </div>
        </Card>
      )) : (
        <Card className="text-center py-8">
          <FileText size={28} className="text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No report yet</p>
        </Card>
      )}
    </div>
  )
}
