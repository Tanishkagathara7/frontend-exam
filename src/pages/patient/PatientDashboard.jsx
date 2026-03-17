import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { bookAppointment } from '@/api/appointments'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const TIME_SLOTS = [
  '09:00-09:15', '09:15-09:30', '09:30-09:45', '09:45-10:00',
  '10:00-10:15', '10:15-10:30', '10:30-10:45', '10:45-11:00',
  '11:00-11:15', '11:15-11:30', '11:30-11:45', '11:45-12:00',
  '14:00-14:15', '14:15-14:30', '14:30-14:45', '14:45-15:00',
  '15:00-15:15', '15:15-15:30', '15:30-15:45', '15:45-16:00',
  '16:00-16:15', '16:15-16:30', '16:30-16:45', '16:45-17:00',
]

export default function PatientDashboard() {
  const queryClient = useQueryClient()
  const [showBooking, setShowBooking] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [errors, setErrors] = useState({})

  const { mutate: submitBooking, isPending } = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      toast.success('Appointment booked')
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      closeModal()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Booking failed'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!appointmentDate) errs.appointmentDate = 'Required'
    if (!timeSlot) errs.timeSlot = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    submitBooking({ appointmentDate, timeSlot })
  }

  const closeModal = () => {
    setShowBooking(false)
    setAppointmentDate('')
    setTimeSlot('')
    setErrors({})
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">Patient Dashboard</h1>

      <Card>
        <p className="font-medium text-gray-900 mb-1">Welcome</p>
        <p className="text-sm text-gray-500 mb-4">
          Use the menu to book an appointment, view your appointments, prescriptions, or medical reports.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowBooking(true)}>Book Appointment</Button>
          <Link to="/patient/appointments">
            <Button variant="secondary">My Appointments</Button>
          </Link>
          <Link to="/patient/prescriptions">
            <Button variant="secondary">My Prescriptions</Button>
          </Link>
          <Link to="/patient/reports">
            <Button variant="secondary">My Reports</Button>
          </Link>
        </div>
      </Card>

      <Modal open={showBooking} onClose={closeModal} title="Book Appointment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            error={errors.appointmentDate}
            min={today}
          />
          <Select
            label="Time Slot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            error={errors.timeSlot}
            options={[
              { value: '', label: 'Select a time slot' },
              ...TIME_SLOTS.map((s) => ({ value: s, label: s })),
            ]}
          />
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={isPending}>Book</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
