import { Link, useLocation } from 'react-router-dom'
import { Home, Target, Users, MessageSquare, BookOpen, User, TrendingUp, Award, BarChart3, Map, Repeat, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
export default function Sidebar({ isCollapsed = false }: { isCollapsed?: boolean; onToggle?: () => void }) {
  const { user } = useAuthStore(), location = useLocation()
  const navigation = [
    { name: 'Dashboard', path: '', icon: Home },
    { name: 'Skills', path: '/skills', icon: TrendingUp },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Career roadmaps', path: '/roadmaps', icon: Map },
    { name: 'Mentor matches', path: '/matches', icon: Users },
    { name: 'Mentor directory', path: '/mentors', icon: Users },
    { name: 'Mentorships', path: '/mentorships', icon: CheckSquare },
    { name: 'Skill challenges', path: '/challenges', icon: Award },
    { name: 'Skill passport', path: '/passport', icon: Award },
    { name: 'Peer exchanges', path: '/exchanges', icon: Repeat },
    { name: 'Progress reports', path: '/reports', icon: BarChart3 },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: User },
  ]
  return <aside className={cn('bg-white border-r h-full flex flex-col', isCollapsed ? 'w-20' : 'w-64')}><Link to="/dashboard" className="p-6 text-primary-700 text-xl font-bold border-b">{isCollapsed ? 'S' : 'SkillSync'}</Link><nav aria-label="Main navigation" className="p-3 space-y-1 flex-1 overflow-y-auto">{navigation.map(item => <Link key={item.path} title={item.name} aria-current={location.pathname === '/dashboard' + item.path ? 'page' : undefined} to={'/dashboard' + item.path} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium', location.pathname === '/dashboard' + item.path ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50')}><item.icon className="h-5 w-5 shrink-0" />{!isCollapsed && item.name}</Link>)}</nav>{!isCollapsed && <div className="border-t p-5 text-sm"><strong>{user?.firstName} {user?.lastName}</strong><p className="capitalize text-neutral-500">{user?.role}</p></div>}</aside>
}
