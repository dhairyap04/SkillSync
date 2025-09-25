import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Award,
  Filter,
  Search,
  MoreVertical,
  Flag,
  Users,
  BookOpen
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'

const GoalsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')

  const statuses = [
    { id: 'all', name: 'All Goals', count: 12 },
    { id: 'todo', name: 'To Do', count: 3 },
    { id: 'in_progress', name: 'In Progress', count: 5 },
    { id: 'completed', name: 'Completed', count: 4 }
  ]

  const priorities = [
    { id: 'all', name: 'All Priorities' },
    { id: 'high', name: 'High Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'low', name: 'Low Priority' }
  ]

  const goals = [
    {
      id: '1',
      title: 'Complete React Certification',
      description: 'Finish the React Developer Certification course and pass the final exam',
      status: 'in_progress',
      priority: 'high',
      progress: 75,
      dueDate: '2024-12-15',
      skills: ['React', 'JavaScript', 'Frontend'],
      milestones: [
        { id: '1', title: 'Complete Hooks Module', completed: true },
        { id: '2', title: 'Build Portfolio Project', completed: true },
        { id: '3', title: 'Pass Practice Exam', completed: false },
        { id: '4', title: 'Take Final Exam', completed: false }
      ],
      createdAt: '2024-11-01',
      updatedAt: '2024-12-10'
    },
    {
      id: '2',
      title: 'Build Portfolio Website',
      description: 'Create a professional portfolio website showcasing my projects and skills',
      status: 'todo',
      priority: 'medium',
      progress: 0,
      dueDate: '2025-01-20',
      skills: ['React', 'CSS', 'Design'],
      milestones: [
        { id: '1', title: 'Design Wireframes', completed: false },
        { id: '2', title: 'Set up Development Environment', completed: false },
        { id: '3', title: 'Build Homepage', completed: false },
        { id: '4', title: 'Add Project Showcase', completed: false },
        { id: '5', title: 'Deploy to Production', completed: false }
      ],
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01'
    },
    {
      id: '3',
      title: 'Learn TypeScript',
      description: 'Master TypeScript fundamentals and apply them to React projects',
      status: 'completed',
      priority: 'high',
      progress: 100,
      dueDate: '2024-11-30',
      skills: ['TypeScript', 'React', 'JavaScript'],
      milestones: [
        { id: '1', title: 'Complete TypeScript Basics', completed: true },
        { id: '2', title: 'Learn Advanced Types', completed: true },
        { id: '3', title: 'Integrate with React', completed: true },
        { id: '4', title: 'Build TypeScript Project', completed: true }
      ],
      createdAt: '2024-10-15',
      updatedAt: '2024-11-30'
    },
    {
      id: '4',
      title: 'Master Design Systems',
      description: 'Learn how to create and maintain scalable design systems',
      status: 'in_progress',
      priority: 'medium',
      progress: 40,
      dueDate: '2025-02-10',
      skills: ['Design', 'Figma', 'UI/UX'],
      milestones: [
        { id: '1', title: 'Study Design System Principles', completed: true },
        { id: '2', title: 'Create Component Library', completed: false },
        { id: '3', title: 'Document Design Tokens', completed: false },
        { id: '4', title: 'Build Style Guide', completed: false }
      ],
      createdAt: '2024-11-20',
      updatedAt: '2024-12-08'
    },
    {
      id: '5',
      title: 'Improve Leadership Skills',
      description: 'Develop leadership capabilities through mentorship and team projects',
      status: 'in_progress',
      priority: 'low',
      progress: 60,
      dueDate: '2025-03-15',
      skills: ['Leadership', 'Communication', 'Management'],
      milestones: [
        { id: '1', title: 'Complete Leadership Course', completed: true },
        { id: '2', title: 'Mentor Junior Developer', completed: true },
        { id: '3', title: 'Lead Team Project', completed: false },
        { id: '4', title: 'Present at Team Meeting', completed: false }
      ],
      createdAt: '2024-10-01',
      updatedAt: '2024-12-05'
    },
    {
      id: '6',
      title: 'Learn Data Analysis',
      description: 'Acquire skills in data analysis using Python and SQL',
      status: 'todo',
      priority: 'medium',
      progress: 0,
      dueDate: '2025-04-01',
      skills: ['Python', 'SQL', 'Data Analysis'],
      milestones: [
        { id: '1', title: 'Learn Python Basics', completed: false },
        { id: '2', title: 'Master Pandas Library', completed: false },
        { id: '3', title: 'Learn SQL Queries', completed: false },
        { id: '4', title: 'Complete Data Project', completed: false }
      ],
      createdAt: '2024-12-05',
      updatedAt: '2024-12-05'
    }
  ]

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || goal.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    const colors = {
      todo: 'bg-neutral-100 text-neutral-800',
      in_progress: 'bg-primary-100 text-primary-800',
      completed: 'bg-success-100 text-success-800'
    }
    return colors[status as keyof typeof colors] || 'bg-neutral-100 text-neutral-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-neutral-100 text-neutral-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'in_progress':
        return Clock
      default:
        return Target
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyColor = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return 'text-red-600'
    if (daysUntilDue <= 7) return 'text-orange-600'
    if (daysUntilDue <= 30) return 'text-yellow-600'
    return 'text-neutral-600'
  }

  const groupedGoals = {
    todo: filteredGoals.filter(goal => goal.status === 'todo'),
    in_progress: filteredGoals.filter(goal => goal.status === 'in_progress'),
    completed: filteredGoals.filter(goal => goal.status === 'completed')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Goals & Milestones</h1>
            <p className="text-neutral-600 mt-2">
              Track your career development goals and celebrate your achievements.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-3">
            <Button
              variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
              size="lg"
              onClick={() => setViewMode('kanban')}
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="lg"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button variant="primary" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name} ({status.count})
              </option>
            ))}
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Goals Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(groupedGoals).map(([status, goals]) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900 capitalize">
                    {status.replace('_', ' ')}
                  </h3>
                  <Badge variant="secondary">{goals.length}</Badge>
                </div>
                <div className="space-y-4">
                  {goals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card hover className="cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 bg-primary-100 rounded">
                                {React.createElement(getStatusIcon(goal.status), { 
                                  className: "h-4 w-4 text-primary-600" 
                                })}
                              </div>
                              <Badge className={getPriorityColor(goal.priority)}>
                                {goal.priority}
                              </Badge>
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <h4 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                            {goal.title}
                          </h4>
                          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                            {goal.description}
                          </p>

                          {goal.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} size="sm" />
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 mb-3">
                            {goal.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" size="sm">
                                {skill}
                              </Badge>
                            ))}
                            {goal.skills.length > 3 && (
                              <Badge variant="secondary" size="sm">
                                +{goal.skills.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-neutral-500" />
                              <span className={getUrgencyColor(getDaysUntilDue(goal.dueDate))}>
                                {getDaysUntilDue(goal.dueDate) < 0 
                                  ? `${Math.abs(getDaysUntilDue(goal.dueDate))} days overdue`
                                  : `${getDaysUntilDue(goal.dueDate)} days left`
                                }
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Flag className="h-3 w-3 text-neutral-500" />
                              <span className="text-neutral-500">
                                {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card hover>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            {React.createElement(getStatusIcon(goal.status), { 
                              className: "h-5 w-5 text-primary-600" 
                            })}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-neutral-900">{goal.title}</h3>
                              <Badge className={getStatusColor(goal.status)}>
                                {goal.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(goal.priority)}>
                                {goal.priority}
                              </Badge>
                            </div>
                            <p className="text-neutral-600 mb-4">{goal.description}</p>
                            
                            {goal.progress > 0 && (
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Progress</span>
                                  <span>{goal.progress}%</span>
                                </div>
                                <Progress value={goal.progress} size="md" />
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Due: {formatDate(goal.dueDate)}
                                </div>
                                <div className="flex items-center">
                                  <Flag className="h-4 w-4 mr-1" />
                                  {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones
                                </div>
                                <div className="flex items-center">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  {goal.skills.length} skills
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredGoals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No goals found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start setting goals to track your career development'
              }
            </p>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default GoalsPage

