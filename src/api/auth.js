import http from './axios'

export const login = (credentials) => http.post('/auth/login', credentials)
