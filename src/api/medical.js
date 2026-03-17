import api from './axios'

// medicines: [{ name, dosage, duration }], notes: string
export const addPrescription = (appointmentId, data) =>
  api.post(`/prescriptions/${appointmentId}`, data)

// diagnosis, testRecommended, remarks
export const addReport = (appointmentId, data) =>
  api.post(`/reports/${appointmentId}`, data)

export const getMyPrescriptions = () => api.get('/prescriptions/my')
export const getMyReports = () => api.get('/reports/my')
