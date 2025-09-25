import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const SkillsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { id: 'all', name: 'All Skills', count: 12 },
    { id: 'frontend', name: 'Frontend', count: 4 },
    { id: 'backend', name: 'Backend', count: 3 },
    { id: 'design', name: 'Design', count: 2 },
    { id: 'business', name: 'Business', count: 2 },
    { id: 'data', name: 'Data Science', count: 1 }
  ]

  const skills = [
    {
      id: '1',
      name: 'React Development',
      category: 'frontend',
      proficiency: 85,
      targetProficiency: 90,
      evidence: [
        { type: 'project', title: 'E-commerce Dashboard', date: '2024-01-15' },
        { type: 'certification', title: 'React Advanced Patterns', date: '2024-01-10' }
      ],
      goals: [
        { title: 'Master React Hooks', progress: 100, status: 'completed' },
        { title: 'Learn Next.js', progress: 60, status: 'in_progress' }
      ],
      lastUpdated: '2 days ago',
      trend: 'up',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Product Management',
      category: 'business',
      proficiency: 60,
      targetProficiency: 80,
      evidence: [
        { type: 'course', title: 'Product Strategy Course', date: '2024-01-20' },
        { type: 'experience', title: 'Led feature development', date: '2024-01-18' }
      ],
      goals: [
        { title: 'Complete PM Certification', progress: 75, status: 'in_progress' }
      ],
      lastUpdated: '1 week ago',
      trend: 'up',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Data Analysis',
      category: 'data',
      proficiency: 40,
      targetProficiency: 70,
      evidence: [
        { type: 'course', title: 'Python for Data Science', date: '2024-01-25' }
      ],
      goals: [
        { title: 'Learn SQL', progress: 30, status: 'in_progress' },
        { title: 'Master Pandas', progress: 20, status: 'in_progress' }
      ],
      lastUpdated: '3 days ago',
      trend: 'up',
      priority: 'low'
    },
    {
      id: '4',
      name: 'UI/UX Design',
      category: 'design',
      proficiency: 70,
      targetProficiency: 85,
      evidence: [
        { type: 'project', title: 'Mobile App Redesign', date: '2024-01-22' },
        { type: 'certification', title: 'Figma Mastery', date: '2024-01-12' }
      ],
      goals: [
        { title: 'Learn Design Systems', progress: 80, status: 'in_progress' }
      ],
      lastUpdated: '1 day ago',
      trend: 'up',
      priority: 'medium'
    }
  ]

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: 'bg-blue-100 text-blue-800',
      backend: 'bg-green-100 text-green-800',
      design: 'bg-purple-100 text-purple-800',
      business: 'bg-orange-100 text-orange-800',
      data: 'bg-teal-100 text-teal-800'
    }
    return colors[category as keyof typeof colors] || 'bg-neutral-100 text-neutral-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-neutral-100 text-neutral-800'
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
            <h1 className="text-3xl font-bold text-neutral-900">Skills Tracking</h1>
            <p className="text-neutral-600 mt-2">
              Monitor your skill development and track your progress over time.
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button variant="primary" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add New Skill
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
          <Button variant="secondary" size="lg">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{skill.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getCategoryColor(skill.category)}>
                        {skill.category}
                      </Badge>
                      <Badge className={getPriorityColor(skill.priority)}>
                        {skill.priority}
                      </Badge>
                    </div>
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
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700">Current Level</span>
                    <span className="text-sm font-bold text-primary-600">{skill.proficiency}%</span>
                  </div>
                  <Progress value={skill.proficiency} size="md" />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-neutral-500">Target: {skill.targetProficiency}%</span>
                    <div className="flex items-center text-xs text-success-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Improving
                    </div>
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Active Goals</h4>
                  <div className="space-y-2">
                    {skill.goals.map((goal, goalIndex) => (
                      <div key={goalIndex} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {goal.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-success-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm text-neutral-700 truncate">{goal.title}</span>
                        </div>
                        <span className="text-xs text-neutral-500">{goal.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Recent Evidence</h4>
                  <div className="space-y-1">
                    {skill.evidence.slice(0, 2).map((evidence, evidenceIndex) => (
                      <div key={evidenceIndex} className="flex items-center space-x-2 text-xs text-neutral-600">
                        <div className={`w-2 h-2 rounded-full ${
                          evidence.type === 'project' ? 'bg-blue-500' :
                          evidence.type === 'certification' ? 'bg-green-500' :
                          evidence.type === 'course' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`} />
                        <span className="truncate">{evidence.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>Updated {skill.lastUpdated}</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Details
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-12 w-12 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No skills found</h3>
          <p className="text-neutral-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start tracking your skills to see your progress'
            }
          </p>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Skill
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export default SkillsPage

