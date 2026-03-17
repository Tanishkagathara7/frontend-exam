import axios from 'axios'
import toast from 'react-hot-toast'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://cmsback.sampaarsh.cloud',
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status

    if (status === 401) {
      localStorage.clear()
      toast.error('Session expired. Please log in again.')
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error("You don't have permission to do that.")
    }

    return Promise.reject(err)
  }
)

export default http
