import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Target,
  Users,
  BookOpen,
  Plus,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/auth'

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore()

  const stats = [
    {
      title: 'Skills Tracked',
      value: '12',
      change: '+3 this month',
      icon: TrendingUp,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Active Goals',
      value: '5',
      change: '2 completed',
      icon: Target,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      title: 'Mentors',
      value: '2',
      change: '1 new connection',
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Learning Hours',
      value: '47',
      change: '+12 this week',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const recentSkills = [
    {
      name: 'React Development',
      progress: 85,
      category: 'Frontend',
      lastUpdated: '2 days ago',
      trend: 'up'
    },
    {
      name: 'Product Management',
      progress: 60,
      category: 'Business',
      lastUpdated: '1 week ago',
      trend: 'up'
    },
    {
      name: 'Data Analysis',
      progress: 40,
      category: 'Analytics',
      lastUpdated: '3 days ago',
      trend: 'up'
    }
  ]

  const upcomingSessions = [
    {
      id: '1',
      mentor: {
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        title: 'Senior Product Manager'
      },
      title: 'Product Strategy Review',
      date: 'Today, 2:00 PM',
      duration: '1 hour',
      type: 'video'
    },
    {
      id: '2',
      mentor: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        title: 'UX Designer'
      },
      title: 'Design System Discussion',
      date: 'Tomorrow, 10:00 AM',
      duration: '45 min',
      type: 'video'
    }
  ]

  const recentGoals = [
    {
      id: '1',
      title: 'Complete React Certification',
      progress: 75,
      dueDate: 'Dec 15, 2024',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Build Portfolio Website',
      progress: 30,
      dueDate: 'Jan 20, 2025',
      status: 'in_progress',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Learn TypeScript',
      progress: 100,
      dueDate: 'Nov 30, 2024',
      status: 'completed',
      priority: 'high'
    }
  ]

  const quickActions = [
    {
      title: 'Add New Skill',
      description: 'Track a new skill you want to develop',
      icon: Plus,
      href: '/skills/new',
      color: 'bg-primary-500'
    },
    {
      title: 'Find Mentor',
      description: 'Connect with industry experts',
      icon: Users,
      href: '/mentors',
      color: 'bg-teal-500'
    },
    {
      title: 'Browse Resources',
      description: 'Discover learning materials',
      icon: BookOpen,
      href: '/resources',
      color: 'bg-orange-500'
    },
    {
      title: 'Set Goal',
      description: 'Create a new career goal',
      icon: Target,
      href: '/goals/new',
      color: 'bg-success-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-neutral-600 mt-2">
              Here's what's happening with your career development today.
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button variant="primary" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-success-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Skills Progress</CardTitle>
              <Link to="/skills">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentSkills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-neutral-900">{skill.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-neutral-600">
                          <Badge variant="secondary" size="sm">{skill.category}</Badge>
                          <span>•</span>
                          <span>Updated {skill.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-neutral-900">{skill.progress}%</div>
                        <div className="flex items-center text-success-600 text-sm">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Improving
                        </div>
                      </div>
                    </div>
                    <Progress value={skill.progress} size="sm" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Sessions</CardTitle>
              <Link to="/sessions">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={session.mentor.avatar}
                        fallback={session.mentor.name}
                        size="sm"
                        status="online"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 truncate">
                          {session.title}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          with {session.mentor.name}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-neutral-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {session.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {session.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Goals Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Goals Progress</CardTitle>
              <Link to="/goals">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-neutral-900">{goal.title}</h4>
                        <Badge
                          variant={goal.priority === 'high' ? 'error' : goal.priority === 'medium' ? 'warning' : 'secondary'}
                          size="sm"
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {goal.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-success-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                        <span className="text-sm text-neutral-600">{goal.progress}%</span>
                      </div>
                    </div>
                    <Progress value={goal.progress} size="sm" />
                    <p className="text-xs text-neutral-500">Due: {goal.dueDate}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={action.title} to={action.href}>
                    <div className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:shadow-soft transition-all cursor-pointer group">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-medium text-neutral-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-neutral-600">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  icon: Award,
                  title: 'Completed TypeScript Learning Goal',
                  description: 'You finished your TypeScript certification course',
                  time: '2 hours ago',
                  color: 'text-success-600'
                },
                {
                  icon: Users,
                  title: 'New mentor connection',
                  description: 'Alex Thompson accepted your mentorship request',
                  time: '1 day ago',
                  color: 'text-teal-600'
                },
                {
                  icon: BookOpen,
                  title: 'Resource bookmarked',
                  description: 'You saved "Advanced React Patterns" to your library',
                  time: '2 days ago',
                  color: 'text-orange-600'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full bg-neutral-100 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900">{activity.title}</h4>
                    <p className="text-sm text-neutral-600">{activity.description}</p>
                    <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default StudentDashboard

