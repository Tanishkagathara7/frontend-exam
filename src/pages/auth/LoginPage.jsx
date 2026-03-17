import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { login } from '@/api/auth'
import useAuthStore from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const homepageByRole = {
  admin: '/admin',
  patient: '/patient',
  receptionist: '/receptionist',
  doctor: '/doctor',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const { mutate: doLogin, isPending } = useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      setAuth(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}`)
      navigate(homepageByRole[data.user.role?.toLowerCase()] || '/login')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const errs = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setErrors({})
    doLogin({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">ClinicQ</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" loading={isPending}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
