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
import { Users } from 'lucide-react'

const roleOptions = [
  { value: '', label: 'Select role' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'patient', label: 'Patient' },
]

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', phone: '' })
  const [errors, setErrors] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers().then((r) => r.data),
  })

  const { mutate: submitCreate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User created')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      closeModal()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create user'),
  })

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim()) errs.email = 'Required'
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters'
    if (!form.role) errs.role = 'Required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    submitCreate(form)
  }

  const closeModal = () => {
    setShowModal(false)
    setForm({ name: '', email: '', password: '', role: '', phone: '' })
    setErrors({})
  }

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const users = Array.isArray(data) ? data : (data?.users || [])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">{users.length} total</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Add User</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-5"><TableSkeleton /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="No users yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Name', 'Email', 'Role', 'Status'].map((col) => (
                    <th key={col} className="text-left text-xs font-medium text-gray-500 uppercase px-5 py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-5 py-3 text-gray-600">{u.email}</td>
                    <td className="px-5 py-3"><Badge status={u.role} label={u.role} /></td>
                    <td className="px-5 py-3">
                      <Badge
                        status={u.isActive !== false ? 'done' : 'skipped'}
                        label={u.isActive !== false ? 'Active' : 'Inactive'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={showModal} onClose={closeModal} title="Create User">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe"
            value={form.name} onChange={set('name')} error={errors.name} />
          <Input label="Email" type="email" placeholder="user@clinic.com"
            value={form.email} onChange={set('email')} error={errors.email} />
          <Input label="Password" type="password" placeholder="••••••••"
            value={form.password} onChange={set('password')} error={errors.password} />
          <Select label="Role" options={roleOptions}
            value={form.role} onChange={set('role')} error={errors.role} />
          <Input label="Phone (optional)" placeholder="+91 98765 43210"
            value={form.phone} onChange={set('phone')} />
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={isPending}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
