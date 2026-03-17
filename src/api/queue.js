import api from './axios'

export const getQueue = (date) => api.get(`/queue?date=${date}`)
export const updateQueueStatus = (id, status) => api.patch(`/queue/${id}`, { status })
export const getDoctorQueue = () => api.get('/doctor/queue')
