import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMyAppointments, bookAppointment } from '@/api/appointments'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { CalendarPlus, Calendar, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const TIME_SLOTS = [
  '09:00-09:15','09:15-09:30','09:30-09:45','09:45-10:00',
  '10:00-10:15','10:15-10:30','10:30-10:45','10:45-11:00',
  '11:00-11:15','11:15-11:30','11:30-11:45','11:45-12:00',
  '14:00-14:15','14:15-14:30','14:30-14:45','14:45-15:00',
  '15:00-15:15','15:15-15:30','15:30-15:45','15:45-16:00',
  '16:00-16:15','16:15-16:30','16:30-16:45','16:45-17:00',
]

const defaultForm = { appointmentDate: '', timeSlot: '' }

export default function PatientDashboard() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => getMyAppointments().then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      toast.success('Appointment booked successfully')
      qc.invalidateQueries({ queryKey: ['my-appointments'] })
      setModalOpen(false)
      setForm(defaultForm)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Booking failed'),
  })

  const validate = () => {
    const e = {}
    if (!form.appointmentDate) e.appointmentDate = 'Date is required'
    if (!form.timeSlot) e.timeSlot = 'Time slot is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    mutation.mutate(form)
  }

  const appointments = data?.appointments || data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your visits</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <CalendarPlus size={16} />
          Book Appointment
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <EmptyState icon={Calendar} title="No appointments yet" description="Book your first appointment to get started" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((apt) => (
            <Link key={apt._id || apt.id} to={`/patient/appointments/${apt._id || apt.id}`}>
              <Card className="hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Calendar size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{apt.timeSlot || 'Appointment'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(apt.appointmentDate || apt.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={apt.status || 'scheduled'} label={apt.status || 'Scheduled'} />
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
                {apt.doctor && (
                  <p className="text-xs text-gray-500 mt-3 pl-13">
                    Dr. {apt.doctor?.name || apt.doctorName}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setErrors({}) }} title="Book Appointment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Appointment Date"
            type="date"
            value={form.appointmentDate}
            onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
            error={errors.appointmentDate}
            min={new Date().toISOString().split('T')[0]}
          />
          <Select
            label="Time Slot"
            value={form.timeSlot}
            onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
            error={errors.timeSlot}
            options={[
              { value: '', label: 'Select a time slot' },
              ...TIME_SLOTS.map((s) => ({ value: s, label: s })),
            ]}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={mutation.isPending}>Book Now</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
