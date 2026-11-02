import type { FilterableMentor } from '../lib/mentorFilters.js'
export interface MentorListing extends FilterableMentor {
  id: string
  title: string
  avatar?: string
  location: string
  rating: number
  reviewCount: number
  experience: string
  availability: string
  bio: string
  specializations: string[]
  languages: string[]
  isVerified: boolean
  isOnline: boolean
  responseTime: string
  sessionCount: number
  successRate: number
}
