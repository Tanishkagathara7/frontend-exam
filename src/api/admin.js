import api from './axios'

export const getClinic = () => api.get('/admin/clinic')
export const getUsers = () => api.get('/admin/users')
export const createUser = (data) => api.post('/admin/users', data)
