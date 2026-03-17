import http from './axios'

export const getClinicInfo = () => http.get('/admin/clinic')
export const getUsers = () => http.get('/admin/users')
export const createUser = (payload) => http.post('/admin/users', payload)
