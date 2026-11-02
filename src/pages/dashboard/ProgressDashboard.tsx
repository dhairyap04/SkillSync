import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useApiData } from '@/hooks/useApiData'
import { Workspace, Panel, LoadState } from '@/components/ui/Workspace'
interface Summary { skills: number; activeGoals: number; completedGoals: number; assignedChallenges: number; acceptedChallenges: number; activeMentorships: number }
export default function ProgressDashboard() {
  const resource = useApiData<Summary>('/dashboard'), { user } = useAuthStore()
  const cards = resource.data ? [['Skills tracked', resource.data.skills], ['Active goals', resource.data.activeGoals], ['Completed goals', resource.data.completedGoals], ['Active mentorships', resource.data.activeMentorships], ['Challenges assigned', resource.data.assignedChallenges], ['Reviewed projects', resource.data.acceptedChallenges]] : []
  return <Workspace title={`Welcome, ${user?.firstName}`} description="Build skills through practice, connect with people who can help, and make your progress visible."><LoadState {...resource} /><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{cards.map(([title, value]) => <Panel key={title} title={String(title)}><strong className="text-4xl text-primary-700">{value}</strong></Panel>)}</div>
    <Panel title="Choose your next step"><div className="grid md:grid-cols-2 gap-4">{(user?.role === 'mentor' ? [['Review mentorship requests', 'mentorships'], ['Assign or review a challenge', 'challenges'], ['See progress reports', 'reports'], ['Publish your mentor profile', 'profile']] : [['Find a mentor match', 'matches'], ['Choose a career roadmap', 'roadmaps'], ['Work on a challenge', 'challenges'], ['Build your skill passport', 'passport']]).concat([['Trade skills with a peer', 'exchanges'], ['Track skills and evidence', 'skills']]).map(([title, path]) => <Link className="rounded-lg border p-5 hover:border-primary-300 hover:bg-primary-50 text-primary-700 font-medium" key={path} to={`/dashboard/${path}`}>{title} →</Link>)}</div></Panel>
  </Workspace>
}
