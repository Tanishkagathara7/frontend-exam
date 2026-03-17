import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { login } from '@/api/auth'
import useAuthStore from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Activity, Eye, EyeOff } from 'lucide-react'

const roleHome = {
  admin: '/admin',
  patient: '/patient',
  receptionist: '/receptionist',
  doctor: '/doctor',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const { token, user } = res.data
      setAuth(user, token)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(roleHome[user.role?.toLowerCase()] || '/login')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    },
  })

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    mutation.mutate(form)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary flex-col justify-center items-center p-12 text-white">
        <div className="max-w-sm text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Activity size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">ClinicQ</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Streamline your clinic operations with smart queue management.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[['500+', 'Clinics'], ['10k+', 'Patients'], ['99%', 'Uptime']].map(([val, label]) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4">
                <div className="text-2xl font-bold">{val}</div>
                <div className="text-blue-200 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Activity size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ClinicQ</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
            <p className="text-gray-500 text-sm mb-8">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@clinic.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" loading={mutation.isPending}>
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
