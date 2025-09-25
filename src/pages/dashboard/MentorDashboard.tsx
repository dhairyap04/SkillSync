import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  UserPlus,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/auth'

const MentorDashboard: React.FC = () => {
  const { user } = useAuthStore()

  const stats = [
    {
      title: 'Active Students',
      value: '8',
      change: '+2 this month',
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Sessions Completed',
      value: '24',
      change: 'This month',
      icon: Calendar,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      title: 'Average Rating',
      value: '4.9',
      change: 'Based on 47 reviews',
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Hours Mentored',
      value: '156',
      change: '+18 this month',
      icon: Clock,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ]

  const pendingRequests = [
    {
      id: '1',
      student: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        title: 'Frontend Developer',
        experience: '2 years'
      },
      message: 'Hi! I\'m looking to improve my React skills and would love to learn from your experience in product management.',
      skills: ['React', 'JavaScript', 'Product Management'],
      requestedAt: '2 hours ago'
    },
    {
      id: '2',
      student: {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        title: 'Software Engineer',
        experience: '1 year'
      },
      message: 'I\'m transitioning from backend to full-stack development and would appreciate guidance on frontend architecture.',
      skills: ['React', 'Node.js', 'Architecture'],
      requestedAt: '1 day ago'
    }
  ]

  const upcomingSessions = [
    {
      id: '1',
      student: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        title: 'Junior Developer'
      },
      title: 'React Best Practices',
      date: 'Today, 3:00 PM',
      duration: '1 hour',
      type: 'video'
    },
    {
      id: '2',
      student: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        title: 'Product Manager'
      },
      title: 'Career Growth Planning',
      date: 'Tomorrow, 11:00 AM',
      duration: '45 min',
      type: 'video'
    }
  ]

  const recentStudents = [
    {
      id: '1',
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      title: 'Frontend Developer',
      progress: 85,
      lastSession: '2 days ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      title: 'UX Designer',
      progress: 72,
      lastSession: '1 week ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      title: 'Product Manager',
      progress: 95,
      lastSession: '3 days ago',
      status: 'graduated'
    }
  ]

  const impactMetrics = [
    {
      title: 'Students Helped',
      value: '47',
      description: 'Total mentees guided',
      icon: Users,
      color: 'text-primary-600'
    },
    {
      title: 'Skills Improved',
      value: '156',
      description: 'Skills enhanced across students',
      icon: TrendingUp,
      color: 'text-success-600'
    },
    {
      title: 'Career Promotions',
      value: '12',
      description: 'Students who got promoted',
      icon: Award,
      color: 'text-orange-600'
    },
    {
      title: 'Satisfaction Rate',
      value: '98%',
      description: 'Student satisfaction score',
      icon: Star,
      color: 'text-teal-600'
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
              Welcome back, {user?.firstName}! 🎯
            </h1>
            <p className="text-neutral-600 mt-2">
              Continue making an impact in your students' careers.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-3">
            <Button variant="secondary" size="lg">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="primary" size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Availability
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
        {/* Pending Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Mentorship Requests</CardTitle>
              <Badge variant="warning">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={request.student.avatar}
                        fallback={request.student.name}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-neutral-900">{request.student.name}</h4>
                            <p className="text-sm text-neutral-600">{request.student.title} • {request.student.experience}</p>
                          </div>
                          <span className="text-xs text-neutral-500">{request.requestedAt}</span>
                        </div>
                        <p className="text-sm text-neutral-700 mt-2">{request.message}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {request.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="primary" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button variant="secondary" size="sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button variant="ghost" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
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
                        src={session.student.avatar}
                        fallback={session.student.name}
                        size="sm"
                        status="online"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 truncate">
                          {session.title}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          with {session.student.name}
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
        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Students</CardTitle>
              <Link to="/students">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                    <Avatar
                      src={student.avatar}
                      fallback={student.name}
                      size="md"
                      status={student.status === 'active' ? 'online' : 'offline'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-neutral-900">{student.name}</h4>
                        <Badge
                          variant={student.status === 'active' ? 'success' : 'secondary'}
                          size="sm"
                        >
                          {student.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600">{student.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-sm text-neutral-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {student.progress}% progress
                        </div>
                        <span className="text-xs text-neutral-500">Last session: {student.lastSession}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {impactMetrics.map((metric, index) => (
                  <div key={metric.title} className="text-center p-4 bg-neutral-50 rounded-lg">
                    <div className={`inline-flex p-2 rounded-full bg-white mb-3 ${metric.color}`}>
                      <metric.icon className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1">{metric.value}</div>
                    <div className="text-sm font-medium text-neutral-700 mb-1">{metric.title}</div>
                    <div className="text-xs text-neutral-500">{metric.description}</div>
                  </div>
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
                  icon: CheckCircle,
                  title: 'Session completed with Sarah Johnson',
                  description: 'React Best Practices session - 1 hour',
                  time: '2 hours ago',
                  color: 'text-success-600'
                },
                {
                  icon: Users,
                  title: 'New mentorship request',
                  description: 'Emma Wilson requested mentorship in React development',
                  time: '3 hours ago',
                  color: 'text-primary-600'
                },
                {
                  icon: Award,
                  title: 'Student achievement',
                  description: 'Alex Rodriguez got promoted to Senior Developer',
                  time: '1 day ago',
                  color: 'text-orange-600'
                },
                {
                  icon: MessageSquare,
                  title: 'New message from Lisa Park',
                  description: 'Question about component architecture patterns',
                  time: '2 days ago',
                  color: 'text-teal-600'
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

export default MentorDashboard

