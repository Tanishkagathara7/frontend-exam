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
import { Stethoscope, Pill, FileText, RefreshCw, Plus, Trash2 } from 'lucide-react'

const emptyMedicine = { name: '', dosage: '', duration: '' }

export default function DoctorDashboard() {
  const qc = useQueryClient()
  const [prescModal, setPrescModal] = useState(null)   // appointmentId
  const [reportModal, setReportModal] = useState(null) // appointmentId
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }])
  const [prescNotes, setPrescNotes] = useState('')
  const [reportForm, setReportForm] = useState({ diagnosis: '', testRecommended: '', remarks: '' })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['doctor-queue'],
    queryFn: () => getDoctorQueue().then((r) => r.data),
  })

  const prescMutation = useMutation({
    mutationFn: ({ id, data }) => addPrescription(id, data),
    onSuccess: () => {
      toast.success('Prescription added')
      qc.invalidateQueries({ queryKey: ['doctor-queue'] })
      setPrescModal(null)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to add prescription'),
  })

  const reportMutation = useMutation({
    mutationFn: ({ id, data }) => addReport(id, data),
    onSuccess: () => {
      toast.success('Report added')
      qc.invalidateQueries({ queryKey: ['doctor-queue'] })
      setReportModal(null)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to add report'),
  })

  const openPresc = (appointmentId) => {
    setMedicines([{ ...emptyMedicine }])
    setPrescNotes('')
    setPrescModal(appointmentId)
  }

  const openReport = (appointmentId) => {
    setReportForm({ diagnosis: '', testRecommended: '', remarks: '' })
    setReportModal(appointmentId)
  }

  const updateMedicine = (idx, field, value) => {
    setMedicines((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m))
  }

  const handlePrescSubmit = (e) => {
    e.preventDefault()
    const validMeds = medicines.filter((m) => m.name.trim())
    if (!validMeds.length) { toast.error('Add at least one medicine'); return }
    prescMutation.mutate({ id: prescModal, data: { medicines: validMeds, notes: prescNotes } })
  }

  const handleReportSubmit = (e) => {
    e.preventDefault()
    if (!reportForm.diagnosis.trim()) { toast.error('Diagnosis is required'); return }
    reportMutation.mutate({ id: reportModal, data: reportForm })
  }

  // API returns array directly
  const queue = Array.isArray(data) ? data : (data?.queue || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today's Queue</h1>
          <p className="text-gray-500 text-sm mt-1">{queue.length} patients scheduled</p>
        </div>
        <Button variant="secondary" onClick={() => refetch()}>
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : queue.length === 0 ? (
          <EmptyState icon={Stethoscope} title="No patients today" description="Your queue is empty for today" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Token', 'Patient', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="w-8 h-8 rounded-lg gradient-primary text-white text-xs font-bold flex items-center justify-center">
                        {item.tokenNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{item.patientName || '—'}</p>
                      <p className="text-xs text-gray-400">ID: {item.patientId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={item.status || 'waiting'} label={item.status || 'waiting'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openPresc(item.appointmentId)}>
                          <Pill size={14} />
                          Prescribe
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => openReport(item.appointmentId)}>
                          <FileText size={14} />
                          Report
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

      {/* Prescription Modal */}
      <Modal open={!!prescModal} onClose={() => setPrescModal(null)} title="Add Prescription" className="max-w-lg">
        <form onSubmit={handlePrescSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Medicines</label>
              <Button type="button" size="sm" variant="ghost"
                onClick={() => setMedicines((p) => [...p, { ...emptyMedicine }])}>
                <Plus size={14} /> Add
              </Button>
            </div>
            {medicines.map((med, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl">
                <Input placeholder="Name" value={med.name}
                  onChange={(e) => updateMedicine(idx, 'name', e.target.value)} />
                <Input placeholder="Dosage" value={med.dosage}
                  onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)} />
                <div className="flex gap-1">
                  <Input placeholder="Duration" value={med.duration}
                    onChange={(e) => updateMedicine(idx, 'duration', e.target.value)} />
                  {medicines.length > 1 && (
                    <button type="button" onClick={() => setMedicines((p) => p.filter((_, i) => i !== idx))}
                      className="p-2 text-red-400 hover:text-red-600 flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Textarea label="Notes" placeholder="e.g. After food" value={prescNotes}
            onChange={(e) => setPrescNotes(e.target.value)} rows={2} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setPrescModal(null)}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={prescMutation.isPending}>Save Prescription</Button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal open={!!reportModal} onClose={() => setReportModal(null)} title="Add Medical Report">
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <Input label="Diagnosis *" placeholder="e.g. Viral Fever" value={reportForm.diagnosis}
            onChange={(e) => setReportForm({ ...reportForm, diagnosis: e.target.value })} />
          <Input label="Test Recommended" placeholder="e.g. Blood Test" value={reportForm.testRecommended}
            onChange={(e) => setReportForm({ ...reportForm, testRecommended: e.target.value })} />
          <Textarea label="Remarks" placeholder="e.g. Rest for 3 days" value={reportForm.remarks}
            onChange={(e) => setReportForm({ ...reportForm, remarks: e.target.value })} rows={3} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setReportModal(null)}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={reportMutation.isPending}>Save Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
