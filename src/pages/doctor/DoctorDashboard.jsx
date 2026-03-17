import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getDoctorQueue } from '@/api/queue'
import { addPrescription, addReport } from '@/api/medical'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import Input from '@/components/ui/Input'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { Stethoscope, Plus, Trash2 } from 'lucide-react'

export default function DoctorDashboard() {
  const queryClient = useQueryClient()

  const [prescriptionFor, setPrescriptionFor] = useState(null)
  const [reportFor, setReportFor] = useState(null)

  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }])
  const [prescNotes, setPrescNotes] = useState('')
  const [reportForm, setReportForm] = useState({ diagnosis: '', testRecommended: '', remarks: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-queue'],
    queryFn: () => getDoctorQueue().then((r) => r.data),
  })

  const queue = Array.isArray(data) ? data : (data?.queue || [])

  const { mutate: savePrescription, isPending: savingPresc } = useMutation({
    mutationFn: ({ appointmentId, payload }) => addPrescription(appointmentId, payload),
    onSuccess: () => {
      toast.success('Prescription saved')
      queryClient.invalidateQueries({ queryKey: ['doctor-queue'] })
      setPrescriptionFor(null)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to save prescription'),
  })

  const { mutate: saveReport, isPending: savingReport } = useMutation({
    mutationFn: ({ appointmentId, payload }) => addReport(appointmentId, payload),
    onSuccess: () => {
      toast.success('Report saved')
      queryClient.invalidateQueries({ queryKey: ['doctor-queue'] })
      setReportFor(null)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to save report'),
  })

  const openPrescription = (appointmentId) => {
    setMedicines([{ name: '', dosage: '', duration: '' }])
    setPrescNotes('')
    setPrescriptionFor(appointmentId)
  }

  const openReport = (appointmentId) => {
    setReportForm({ diagnosis: '', testRecommended: '', remarks: '' })
    setReportFor(appointmentId)
  }

  const updateMed = (index, field, value) => {
    setMedicines((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  const handlePrescSubmit = (e) => {
    e.preventDefault()
    const filled = medicines.filter((m) => m.name.trim())
    if (!filled.length) { toast.error('Add at least one medicine'); return }
    savePrescription({ appointmentId: prescriptionFor, payload: { medicines: filled, notes: prescNotes } })
  }

  const handleReportSubmit = (e) => {
    e.preventDefault()
    if (!reportForm.diagnosis.trim()) { toast.error('Diagnosis is required'); return }
    saveReport({ appointmentId: reportFor, payload: reportForm })
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">Today's Queue</h1>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-5"><TableSkeleton /></div>
        ) : queue.length === 0 ? (
          <EmptyState icon={Stethoscope} title="No patients today" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Token', 'Patient', 'Status', 'Appointment ID', 'Actions'].map((col) => (
                    <th key={col} className="text-left text-sm font-medium text-gray-700 px-5 py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queue.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-900">{entry.tokenNumber}</td>
                    <td className="px-5 py-3 text-gray-900">{entry.patientName || '—'}</td>
                    <td className="px-5 py-3">
                      <Badge status={entry.status || 'waiting'} label={entry.status || 'waiting'} />
                    </td>
                    <td className="px-5 py-3 text-gray-600">{entry.appointmentId || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => openPrescription(entry.appointmentId)}>
                          Add medicine
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => openReport(entry.appointmentId)}>
                          Add report
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!prescriptionFor} onClose={() => setPrescriptionFor(null)} title="Add Prescription" className="max-w-lg">
        <form onSubmit={handlePrescSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Medicines</label>
              <Button
                type="button" size="sm" variant="ghost"
                onClick={() => setMedicines((p) => [...p, { name: '', dosage: '', duration: '' }])}
              >
                <Plus size={13} /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {medicines.map((med, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2">
                  <Input placeholder="Name" value={med.name}
                    onChange={(e) => updateMed(idx, 'name', e.target.value)} />
                  <Input placeholder="Dosage" value={med.dosage}
                    onChange={(e) => updateMed(idx, 'dosage', e.target.value)} />
                  <div className="flex gap-1">
                    <Input placeholder="Duration" value={med.duration}
                      onChange={(e) => updateMed(idx, 'duration', e.target.value)} />
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setMedicines((p) => p.filter((_, i) => i !== idx))}
                        className="p-1.5 text-red-400 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Textarea label="Notes" placeholder="e.g. Take after food" value={prescNotes}
            onChange={(e) => setPrescNotes(e.target.value)} rows={2} />
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setPrescriptionFor(null)}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={savingPresc}>Save</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!reportFor} onClose={() => setReportFor(null)} title="Add Report">
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <Input label="Diagnosis *" placeholder="e.g. Viral Fever"
            value={reportForm.diagnosis}
            onChange={(e) => setReportForm((p) => ({ ...p, diagnosis: e.target.value }))} />
          <Input label="Test Recommended" placeholder="e.g. CBC, Blood Sugar"
            value={reportForm.testRecommended}
            onChange={(e) => setReportForm((p) => ({ ...p, testRecommended: e.target.value }))} />
          <Textarea label="Remarks" placeholder="e.g. Rest for 3 days"
            value={reportForm.remarks}
            onChange={(e) => setReportForm((p) => ({ ...p, remarks: e.target.value }))} rows={3} />
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setReportFor(null)}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={savingReport}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
