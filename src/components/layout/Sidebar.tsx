import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Target,
  Users,
  MessageSquare,
  BookOpen,
  User,
  Settings,
  TrendingUp,
  Calendar,
  Award,
  BarChart3,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation()
  const { user } = useAuthStore()

  const studentNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Skills', href: '/skills', icon: TrendingUp },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Mentors', href: '/mentors', icon: Users },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const mentorNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Sessions', href: '/sessions', icon: Calendar },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const navigation = user?.role === 'mentor' ? mentorNavigation : studentNavigation

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="bg-white border-r border-neutral-200 h-full flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-gradient"
            >
              SkillSync
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'
              )} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-neutral-200">
        <Link
          to="/profile"
          className={cn(
            'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
            location.pathname === '/profile'
              ? 'bg-primary-50 text-primary-700'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          )}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <p className="truncate font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-neutral-500 truncate capitalize">
                {user?.role}
              </p>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Quick Stats (for students) */}
      {user?.role === 'student' && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-neutral-200"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Skills Tracked</span>
              <span className="font-semibold text-primary-600">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Goals Active</span>
              <span className="font-semibold text-success-600">5</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Mentors</span>
              <span className="font-semibold text-teal-600">2</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mentor Stats */}
      {user?.role === 'mentor' && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-neutral-200"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Students</span>
              <span className="font-semibold text-primary-600">8</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Sessions</span>
              <span className="font-semibold text-success-600">24</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Rating</span>
              <span className="font-semibold text-orange-600">4.9</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  )
}

export default Sidebar

