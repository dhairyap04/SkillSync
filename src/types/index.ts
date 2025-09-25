export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'mentor'
  avatar?: string
  bio?: string
  location?: string
  company?: string
  title?: string
  linkedinUrl?: string
  githubUrl?: string
  website?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number // 0-100
  targetProficiency?: number
  evidence: SkillEvidence[]
  goals: Goal[]
  createdAt: string
  updatedAt: string
}

export interface SkillEvidence {
  id: string
  type: 'project' | 'certification' | 'course' | 'experience'
  title: string
  description: string
  url?: string
  date: string
  verified: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  skills: string[] // Skill IDs
  milestones: Milestone[]
  progress: number // 0-100
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: string
  completedAt?: string
}

export interface Mentor {
  id: string
  user: User
  expertise: string[]
  experience: number // years
  hourlyRate?: number
  availability: Availability[]
  rating: number
  reviewCount: number
  bio: string
  specializations: string[]
  languages: string[]
  isAvailable: boolean
}

export interface Availability {
  id: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  timezone: string
}

export interface Mentorship {
  id: string
  mentorId: string
  studentId: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  startDate: string
  endDate?: string
  sessions: Session[]
  goals: string[] // Goal IDs
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  mentorshipId: string
  title: string
  description: string
  scheduledAt: string
  duration: number // minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  meetingUrl?: string
  notes?: string
  rating?: number
  feedback?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'course' | 'article' | 'video' | 'book' | 'podcast' | 'tool'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration?: number // minutes
  url: string
  provider: string
  rating: number
  reviewCount: number
  tags: string[]
  thumbnail?: string
  isFree: boolean
  price?: number
  currency?: string
}

export interface UserResource {
  id: string
  userId: string
  resourceId: string
  status: 'bookmarked' | 'in_progress' | 'completed'
  progress: number // 0-100
  rating?: number
  notes?: string
  startedAt?: string
  completedAt?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'file' | 'image'
  fileUrl?: string
  readAt?: string
  createdAt: string
}

export interface Conversation {
  id: string
  participants: string[] // User IDs
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'mentorship_request' | 'session_reminder' | 'goal_achievement' | 'skill_milestone' | 'message'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: string
}

export interface DashboardStats {
  totalSkills: number
  completedSkills: number
  activeGoals: number
  completedGoals: number
  mentorConnections: number
  sessionsCompleted: number
  hoursLearned: number
  achievements: number
}

export interface SearchFilters {
  skills?: string[]
  experience?: string[]
  availability?: string[]
  location?: string
  priceRange?: [number, number]
  rating?: number
  languages?: string[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

