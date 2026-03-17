import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getUsers, createUser } from '@/api/admin'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { UserPlus, Users } from 'lucide-react'

const ROLES = [
  { value: '', label: 'Select role' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'patient', label: 'Patient' },
]

const defaultForm = { name: '', email: '', password: '', role: '', phone: '' }

export default function UsersPage() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers().then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User created successfully')
      qc.invalidateQueries({ queryKey: ['users'] })
      setModalOpen(false)
      setForm(defaultForm)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create user'),
  })

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters'
    if (!form.role) e.role = 'Role is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    mutation.mutate(form)
  }

  const users = Array.isArray(data) ? data : (data?.users || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} total users</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <UserPlus size={16} />
          Add User
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="No users yet" description="Create your first user to get started" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Name', 'Email', 'Role', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-semibold">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <Badge status={u.role} label={u.role} />
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={u.isActive !== false ? 'done' : 'skipped'} label={u.isActive !== false ? 'Active' : 'Inactive'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setErrors({}) }} title="Create New User">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="Dr. John Doe" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="Email" type="email" placeholder="user@clinic.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          <Select label="Role" options={ROLES} value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })} error={errors.role} />
          <Input label="Phone (optional)" placeholder="+91 98765 43210" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={mutation.isPending}>Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
