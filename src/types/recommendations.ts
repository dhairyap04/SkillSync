import type { MentorListing } from './api.js'
export type RecommendationKind = 'mentor' | 'resource'
export type FeedbackValue = 'helpful' | 'not_for_me'
export interface RecommendationExplanation {
  score: number; reasons: string[]; hasPreferences: boolean
  feedback: FeedbackValue | null; feedbackAdjusted: boolean
}
export interface MentorRecommendation extends RecommendationExplanation { mentor: MentorListing }
export interface LearningResource {
  id: string; title: string; description: string; url: string; provider: string
  category: 'programming' | 'data' | 'design'; difficulty: 'beginner' | 'intermediate'; skills: string[]
}
export interface ResourceRecommendation extends RecommendationExplanation {
  resource: LearningResource
  saved: boolean; completed: boolean
}
