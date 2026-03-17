import api from './axios'

export const bookAppointment = ({ appointmentDate, timeSlot }) =>
  api.post('/appointments', { appointmentDate, timeSlot })

export const getMyAppointments = () => api.get('/appointments/my')
export const getAppointmentById = (id) => api.get(`/appointments/${id}`)
