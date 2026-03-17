import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addReport } from '@/api/medical'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AddReport() {
  const navigate = useNavigate()
  const [appointmentId, setAppointmentId] = useState('')
  const [form, setForm] = useState({ diagnosis: '', testRecommended: '', remarks: '' })

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, payload }) => addReport(id, payload),
    onSuccess: () => {
      toast.success('Report saved')
      navigate('/doctor')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to save report'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!appointmentId.trim()) { toast.error('Appointment ID is required'); return }
    if (!form.diagnosis.trim()) { toast.error('Diagnosis is required'); return }
    mutate({ id: appointmentId, payload: form })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-5">Add Medical Report</h1>

      <div className="bg-white border border-gray-200 rounded p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Appointment ID"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
          />
          <Input
            label="Diagnosis *"
            placeholder="e.g. Viral Fever"
            value={form.diagnosis}
            onChange={(e) => setForm((p) => ({ ...p, diagnosis: e.target.value }))}
          />
          <Input
            label="Test recommended (optional)"
            placeholder="e.g. Blood Test"
            value={form.testRecommended}
            onChange={(e) => setForm((p) => ({ ...p, testRecommended: e.target.value }))}
          />
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Remarks (optional)</label>
            <textarea
              value={form.remarks}
              onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))}
              placeholder="e.g. Rest for 3 days"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
          <Button type="submit" loading={isPending}>Save Report</Button>
        </form>
      </div>
    </div>
  )
}
