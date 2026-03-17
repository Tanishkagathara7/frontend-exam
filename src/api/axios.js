import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: 'https://cmsback.sampaarsh.cloud',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.clear()
      toast.error('Session expired. Please login again.')
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.')
    }
    return Promise.reject(error)
  }
)

export default api
