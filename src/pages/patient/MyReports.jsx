import { useQuery } from '@tanstack/react-query'
import { getMyReports } from '@/api/medical'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function MyReports() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => getMyReports().then((r) => (Array.isArray(r.data) ? r.data : [])),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton /><CardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My Reports</h1>
        <p className="text-sm text-gray-500">{reports.length} total</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <EmptyState icon={FileText} title="No reports yet" />
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-900">Medical Report</p>
              <div className="text-right">
                {report.doctor && <p className="text-xs text-gray-400">Dr. {report.doctor.name}</p>}
                {report.createdAt && (
                  <p className="text-xs text-gray-400">{formatDate(report.createdAt)}</p>
                )}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {report.diagnosis && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Diagnosis</p>
                  <p className="text-gray-800">{report.diagnosis}</p>
                </div>
              )}
              {report.testRecommended && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Tests Recommended</p>
                  <p className="text-gray-800">{report.testRecommended}</p>
                </div>
              )}
              {report.remarks && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Remarks</p>
                  <p className="text-gray-800">{report.remarks}</p>
                </div>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
