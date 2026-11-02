import type { ProgressReport } from '@/types/growth'
import { useApiData } from '@/hooks/useApiData'
import { Workspace, Panel, LoadState } from '@/components/ui/Workspace'
export default function ReportsPage() {
  const resource = useApiData<ProgressReport[]>('/reports')
  return <Workspace title="Mentorship progress" description="See the work behind the progress: submitted challenges, revisions, accepted projects, and demonstrated skills. Counts reflect saved activity, not estimated learning gains."><LoadState {...resource} />
    {resource.data?.length === 0 && <Panel><p>Start a mentorship to build a progress report.</p></Panel>}
    {resource.data?.map(report => <Panel key={report.mentorshipId} title={`${report.student.name} & ${report.mentor.name}`}><p className="capitalize">{report.status} mentorship</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[['Assigned', report.assigned], ['Submitted', report.submitted], ['Accepted', report.accepted], ['Revision rounds', report.revisions]].map(([label, value]) => <div className="bg-neutral-50 rounded-lg p-4" key={label}><strong className="block text-3xl text-primary-700">{value}</strong><span>{label}</span></div>)}</div>
      <h3 className="font-semibold">Mentor-endorsed skills</h3><p>{report.endorsedSkills.join(', ') || 'No endorsed skills yet'}</p>
      <h3 className="font-semibold">Reviewed evidence</h3>{report.evidence.map(item => <div key={item.id}><a href={item.url} target="_blank" rel="noreferrer" className="text-primary-600 underline">{item.title}</a><p>{item.feedback}</p></div>)}
      <details><summary className="cursor-pointer font-semibold">Activity timeline ({report.timeline.length})</summary><ol className="border-l-2 pl-4 mt-3 space-y-3">{report.timeline.map((item, index) => <li key={index}><p>{item.event}: {item.title}</p><time className="text-xs text-neutral-500">{new Date(item.at).toLocaleString()}</time></li>)}</ol></details>
    </Panel>)}
  </Workspace>
}
