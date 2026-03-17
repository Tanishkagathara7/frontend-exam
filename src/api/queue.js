import http from './axios'

export const getQueue = (date) => http.get('/queue', { params: { date } })
export const updateQueueStatus = (queueId, status) => http.patch(`/queue/${queueId}`, { status })
export const getDoctorQueue = () => http.get('/doctor/queue')
