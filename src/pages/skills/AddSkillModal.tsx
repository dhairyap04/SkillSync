import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  X,
  Plus,
  Upload,
  Calendar,
  Target,
  Award,
  FileText,
  Link,
  Save,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import toast from 'react-hot-toast'

const skillSchema = z.object({
  name: z.string().min(2, 'Skill name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  currentProficiency: z.number().min(0).max(100),
  targetProficiency: z.number().min(0).max(100),
  description: z.string().optional(),
})

type SkillFormData = z.infer<typeof skillSchema>

interface AddSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (skill: any) => void
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [evidence, setEvidence] = useState<Array<{
    id: string
    type: 'project' | 'certification' | 'course' | 'experience'
    title: string
    description: string
    url?: string
    date: string
  }>>([])
  const [goals, setGoals] = useState<Array<{
    id: string
    title: string
    description: string
    targetDate: string
    priority: 'low' | 'medium' | 'high'
  }>>([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      currentProficiency: 0,
      targetProficiency: 50,
    }
  })

  const watchedCurrentProficiency = watch('currentProficiency')
  const watchedTargetProficiency = watch('targetProficiency')

  const categories = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'UI/UX Design',
    'Product Management',
    'Marketing',
    'Sales',
    'Business Analysis',
    'Project Management',
    'Leadership',
    'Communication',
    'Other'
  ]

  const evidenceTypes = [
    { value: 'project', label: 'Project', icon: '💻', color: 'bg-blue-100 text-blue-800' },
    { value: 'certification', label: 'Certification', icon: '🏆', color: 'bg-green-100 text-green-800' },
    { value: 'course', label: 'Course', icon: '📚', color: 'bg-purple-100 text-purple-800' },
    { value: 'experience', label: 'Experience', icon: '💼', color: 'bg-orange-100 text-orange-800' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ]

  const addEvidence = () => {
    setEvidence([...evidence, {
      id: Date.now().toString(),
      type: 'project',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    }])
  }

  const updateEvidence = (id: string, field: string, value: any) => {
    setEvidence(evidence.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeEvidence = (id: string) => {
    setEvidence(evidence.filter(item => item.id !== id))
  }

  const addGoal = () => {
    setGoals([...goals, {
      id: Date.now().toString(),
      title: '',
      description: '',
      targetDate: '',
      priority: 'medium'
    }])
  }

  const updateGoal = (id: string, field: string, value: any) => {
    setGoals(goals.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeGoal = (id: string) => {
    setGoals(goals.filter(item => item.id !== id))
  }

  const onSubmit = (data: SkillFormData) => {
    const skillData = {
      ...data,
      evidence: evidence.filter(e => e.title.trim() !== ''),
      goals: goals.filter(g => g.title.trim() !== ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    onSave(skillData)
    toast.success('Skill added successfully!')
    onClose()
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Add New Skill</h2>
                <p className="text-sm text-neutral-600">Step {currentStep} of 3</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-3 bg-neutral-50">
              <Progress value={(currentStep / 3) * 100} size="sm" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
                      
                      <div className="space-y-4">
                        <Input
                          label="Skill Name"
                          placeholder="e.g., React Development"
                          error={errors.name?.message}
                          {...register('name')}
                        />

                        <div>
                          <label className="label">Category</label>
                          <select
                            className="input"
                            {...register('category')}
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          {errors.category && (
                            <p className="error-text">{errors.category.message}</p>
                          )}
                        </div>

                        <Input
                          label="Description (Optional)"
                          placeholder="Brief description of this skill"
                          {...register('description')}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="label">Current Proficiency</label>
                            <div className="space-y-2">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full"
                                {...register('currentProficiency', { valueAsNumber: true })}
                              />
                              <div className="flex justify-between text-sm text-neutral-600">
                                <span>0%</span>
                                <span className="font-semibold text-primary-600">{watchedCurrentProficiency}%</span>
                                <span>100%</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="label">Target Proficiency</label>
                            <div className="space-y-2">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full"
                                {...register('targetProficiency', { valueAsNumber: true })}
                              />
                              <div className="flex justify-between text-sm text-neutral-600">
                                <span>0%</span>
                                <span className="font-semibold text-teal-600">{watchedTargetProficiency}%</span>
                                <span>100%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Evidence */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Evidence & Achievements</h3>
                      <p className="text-sm text-neutral-600 mb-4">
                        Add projects, certifications, courses, or experiences that demonstrate this skill.
                      </p>

                      <div className="space-y-4">
                        {evidence.map((item, index) => (
                          <Card key={item.id} className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{evidenceTypes.find(t => t.value === item.type)?.icon}</span>
                                <Badge className={evidenceTypes.find(t => t.value === item.type)?.color}>
                                  {evidenceTypes.find(t => t.value === item.type)?.label}
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEvidence(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-3">
                              <select
                                className="input"
                                value={item.type}
                                onChange={(e) => updateEvidence(item.id, 'type', e.target.value)}
                              >
                                {evidenceTypes.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                  </option>
                                ))}
                              </select>

                              <Input
                                placeholder="Title (e.g., E-commerce Dashboard)"
                                value={item.title}
                                onChange={(e) => updateEvidence(item.id, 'title', e.target.value)}
                              />

                              <Input
                                placeholder="Description (optional)"
                                value={item.description}
                                onChange={(e) => updateEvidence(item.id, 'description', e.target.value)}
                              />

                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="date"
                                  value={item.date}
                                  onChange={(e) => updateEvidence(item.id, 'date', e.target.value)}
                                />
                                <Input
                                  placeholder="URL (optional)"
                                  value={item.url || ''}
                                  onChange={(e) => updateEvidence(item.id, 'url', e.target.value)}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={addEvidence}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Evidence
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Goals */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Learning Goals</h3>
                      <p className="text-sm text-neutral-600 mb-4">
                        Set specific goals to improve this skill over time.
                      </p>

                      <div className="space-y-4">
                        {goals.map((goal, index) => (
                          <Card key={goal.id} className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Target className="h-5 w-5 text-primary-600" />
                                <Badge className={priorityOptions.find(p => p.value === goal.priority)?.color}>
                                  {priorityOptions.find(p => p.value === goal.priority)?.label} Priority
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeGoal(goal.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-3">
                              <Input
                                placeholder="Goal title (e.g., Master React Hooks)"
                                value={goal.title}
                                onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                              />

                              <Input
                                placeholder="Description (optional)"
                                value={goal.description}
                                onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                              />

                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="date"
                                  placeholder="Target date"
                                  value={goal.targetDate}
                                  onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                                />
                                <select
                                  className="input"
                                  value={goal.priority}
                                  onChange={(e) => updateGoal(goal.id, 'priority', e.target.value)}
                                >
                                  {priorityOptions.map((priority) => (
                                    <option key={priority.value} value={priority.value}>
                                      {priority.label} Priority
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </Card>
                        ))}

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={addGoal}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Goal
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-neutral-200">
                <div>
                  {currentStep > 1 && (
                    <Button type="button" variant="secondary" onClick={prevStep}>
                      Previous
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  {currentStep < 3 ? (
                    <Button type="button" variant="primary" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" variant="primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save Skill
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddSkillModal

