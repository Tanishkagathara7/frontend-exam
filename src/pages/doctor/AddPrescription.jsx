import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addPrescription } from '@/api/medical'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function AddPrescription() {
  const navigate = useNavigate()
  const [appointmentId, setAppointmentId] = useState('')
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }])
  const [notes, setNotes] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, payload }) => addPrescription(id, payload),
    onSuccess: () => {
      toast.success('Prescription saved')
      navigate('/doctor')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to save prescription'),
  })

  const updateMed = (index, field, value) => {
    setMedicines((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!appointmentId.trim()) { toast.error('Appointment ID is required'); return }
    const filled = medicines.filter((m) => m.name.trim())
    if (!filled.length) { toast.error('Add at least one medicine'); return }
    mutate({ id: appointmentId, payload: { medicines: filled, notes } })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-5">Add Prescription</h1>

      <div className="bg-white border border-gray-200 rounded p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Appointment ID"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            placeholder=""
          />

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">Medicines</p>
            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Name</label>
                    <input
                      value={med.name}
                      onChange={(e) => updateMed(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Dosage</label>
                    <input
                      value={med.dosage}
                      onChange={(e) => updateMed(idx, 'dosage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Duration</label>
                      <input
                        value={med.duration}
                        onChange={(e) => updateMed(idx, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setMedicines((p) => p.filter((_, i) => i !== idx))}
                        className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMedicines((p) => [...p, { name: '', dosage: '', duration: '' }])}
              className="mt-3 px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            >
              + Add medicine
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. After food"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <Button type="submit" loading={isPending}>Save Prescription</Button>
        </form>
      </div>
    </div>
  )
}
