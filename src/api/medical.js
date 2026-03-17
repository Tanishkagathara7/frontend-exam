import http from './axios'

export const getMyPrescriptions = () => http.get('/prescriptions/my')
export const getMyReports = () => http.get('/reports/my')

export const addPrescription = (appointmentId, payload) =>
  http.post(`/prescriptions/${appointmentId}`, payload)

export const addReport = (appointmentId, payload) =>
  http.post(`/reports/${appointmentId}`, payload)
