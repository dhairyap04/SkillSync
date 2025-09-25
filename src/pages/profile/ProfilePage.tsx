import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Linkedin,
  Github,
  Camera,
  Edit,
  Save,
  X,
  Award,
  Star,
  Users,
  Calendar,
  TrendingUp,
  Target,
  BookOpen,
  MessageSquare,
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  location: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'goals' | 'settings'>('overview')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const { user, updateUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      company: user?.company || '',
      title: user?.title || '',
      website: user?.website || '',
      linkedinUrl: user?.linkedinUrl || '',
      githubUrl: user?.githubUrl || '',
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      updateUser(data)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const stats = [
    { label: 'Skills Tracked', value: '12', icon: TrendingUp, color: 'text-primary-600' },
    { label: 'Goals Completed', value: '8', icon: Target, color: 'text-success-600' },
    { label: 'Mentors Connected', value: '3', icon: Users, color: 'text-teal-600' },
    { label: 'Learning Hours', value: '156', icon: BookOpen, color: 'text-orange-600' }
  ]

  const recentSkills = [
    { name: 'React Development', progress: 85, category: 'Frontend' },
    { name: 'Product Management', progress: 60, category: 'Business' },
    { name: 'Data Analysis', progress: 40, category: 'Analytics' },
    { name: 'UI/UX Design', progress: 70, category: 'Design' }
  ]

  const recentGoals = [
    { title: 'Complete React Certification', status: 'completed', dueDate: 'Dec 15, 2024' },
    { title: 'Build Portfolio Website', status: 'in_progress', dueDate: 'Jan 20, 2025' },
    { title: 'Learn TypeScript', status: 'completed', dueDate: 'Nov 30, 2024' },
    { title: 'Master Design Systems', status: 'in_progress', dueDate: 'Feb 10, 2025' }
  ]

  const achievements = [
    { title: 'First Skill Mastered', description: 'Completed React Development', date: 'Dec 15, 2024', icon: Award },
    { title: 'Mentor Connection', description: 'Connected with Alex Thompson', date: 'Dec 10, 2024', icon: Users },
    { title: 'Goal Achiever', description: 'Completed 5 goals this month', date: 'Dec 1, 2024', icon: Target },
    { title: 'Learning Streak', description: '7 days of consistent learning', date: 'Nov 25, 2024', icon: Calendar }
  ]

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
                <div className="relative">
                  <Avatar
                    src={user?.avatar}
                    fallback={`${user?.firstName} ${user?.lastName}`}
                    size="2xl"
                    status="online"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center lg:text-left mt-4">
                  <h1 className="text-2xl font-bold text-neutral-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-neutral-600">{user?.title || 'Professional'}</p>
                  <p className="text-sm text-neutral-500">{user?.company}</p>
                  <div className="flex items-center justify-center lg:justify-start mt-2">
                    <Badge variant="secondary" className="capitalize">
                      {user?.role}
                    </Badge>
                    {user?.isVerified && (
                      <Badge variant="success" className="ml-2">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-neutral-500" />
                        <span className="text-neutral-700">{user?.email}</span>
                      </div>
                      {user?.location && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-neutral-500" />
                          <span className="text-neutral-700">{user?.location}</span>
                        </div>
                      )}
                      {user?.website && (
                        <div className="flex items-center space-x-3">
                          <Globe className="h-4 w-4 text-neutral-500" />
                          <a href={user?.website} className="text-primary-600 hover:text-primary-700">
                            {user?.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Social Links</h3>
                    <div className="space-y-3">
                      {user?.linkedinUrl && (
                        <div className="flex items-center space-x-3">
                          <Linkedin className="h-4 w-4 text-blue-600" />
                          <a href={user?.linkedinUrl} className="text-primary-600 hover:text-primary-700">
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {user?.githubUrl && (
                        <div className="flex items-center space-x-3">
                          <Github className="h-4 w-4 text-neutral-700" />
                          <a href={user?.githubUrl} className="text-primary-600 hover:text-primary-700">
                            GitHub Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {user?.bio && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">About</h3>
                    <p className="text-neutral-700 leading-relaxed">{user?.bio}</p>
                  </div>
                )}

                <div className="mt-6 flex space-x-3">
                  <Button
                    variant={isEditing ? 'secondary' : 'primary'}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  {isEditing && (
                    <Button variant="primary" onClick={handleSubmit(onSubmit)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex border-b border-neutral-200">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'skills', label: 'Skills', icon: TrendingUp },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={stat.label} hover>
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full bg-neutral-100 mb-4 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-neutral-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Skills Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">{skill.name}</h4>
                          <p className="text-sm text-neutral-600">{skill.category}</p>
                        </div>
                        <span className="text-lg font-semibold text-primary-600">{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} size="sm" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-neutral-900">{goal.title}</h4>
                        <p className="text-sm text-neutral-600">Due: {goal.dueDate}</p>
                      </div>
                      <Badge
                        variant={goal.status === 'completed' ? 'success' : 'warning'}
                      >
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-lg">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <achievement.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-900">{achievement.title}</h4>
                        <p className="text-sm text-neutral-600">{achievement.description}</p>
                        <p className="text-xs text-neutral-500 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">{skill.name}</h4>
                          <p className="text-sm text-neutral-600">{skill.category}</p>
                        </div>
                        <span className="text-lg font-semibold text-primary-600">{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} size="sm" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-neutral-900">{goal.title}</h4>
                        <p className="text-sm text-neutral-600">Due: {goal.dueDate}</p>
                      </div>
                      <Badge
                        variant={goal.status === 'completed' ? 'success' : 'warning'}
                      >
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Edit Profile Form */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        error={errors.firstName?.message}
                        {...register('firstName')}
                      />
                      <Input
                        label="Last Name"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                      />
                    </div>

                    <Input
                      label="Email"
                      type="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />

                    <div>
                      <label className="label">Bio</label>
                      <textarea
                        className="input min-h-[100px] resize-none"
                        placeholder="Tell us about yourself..."
                        {...register('bio')}
                      />
                      {errors.bio && (
                        <p className="error-text">{errors.bio.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Location"
                        placeholder="City, Country"
                        {...register('location')}
                      />
                      <Input
                        label="Company"
                        {...register('company')}
                      />
                    </div>

                    <Input
                      label="Job Title"
                      {...register('title')}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Website"
                        placeholder="https://yourwebsite.com"
                        error={errors.website?.message}
                        {...register('website')}
                      />
                      <Input
                        label="LinkedIn URL"
                        placeholder="https://linkedin.com/in/yourprofile"
                        error={errors.linkedinUrl?.message}
                        {...register('linkedinUrl')}
                      />
                    </div>

                    <Input
                      label="GitHub URL"
                      placeholder="https://github.com/yourusername"
                      error={errors.githubUrl?.message}
                      {...register('githubUrl')}
                    />
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-neutral-900">Change Password</h4>
                    <p className="text-sm text-neutral-600">Update your account password</p>
                  </div>
                  <Button variant="secondary" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-neutral-900">Email Notifications</h4>
                    <p className="text-sm text-neutral-600">Manage your email preferences</p>
                  </div>
                  <Button variant="secondary">
                    <Bell className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-neutral-900">Privacy Settings</h4>
                    <p className="text-sm text-neutral-600">Control your profile visibility</p>
                  </div>
                  <Button variant="secondary">
                    <Shield className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ProfilePage

