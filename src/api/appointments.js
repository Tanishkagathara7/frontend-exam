import http from './axios'

export const getMyAppointments = () => http.get('/appointments/my')
export const getAppointmentById = (id) => http.get(`/appointments/${id}`)
export const bookAppointment = ({ appointmentDate, timeSlot }) =>
  http.post('/appointments', { appointmentDate, timeSlot })
