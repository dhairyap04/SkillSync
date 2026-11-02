export interface Person { id: string; name: string; role: 'student' | 'mentor' }
export interface LearningProfile { skills: string[]; careerGoal: string; budget: number | null; availability: string }
export interface Review { outcome: 'accepted' | 'revision_requested'; feedback: string; endorsedSkills: string[]; reviewedAt: string }
export interface Attempt { url: string; summary: string; submittedAt: string; review?: Review }
export interface Challenge {
  id: string; mentorshipId: string; mentorId: string; studentId: string
  title: string; description: string; skills: string[]; dueDate?: string
  status: 'assigned' | 'submitted' | 'revision_requested' | 'accepted'
  attempts: Attempt[]; createdAt: string; updatedAt: string
  mentor?: Person; student?: Person
}
export interface Evidence {
  id: string; title: string; description: string; url: string; summary: string
  skills: string[]; feedback: string; reviewedAt: string; mentor: Person
}
export interface Passport { name: string; evidence: Evidence[]; shareToken?: string | null }
export interface RoadmapTemplate { id: string; title: string; description: string; steps: { title: string; description: string; milestones: string[] }[] }
export interface Roadmap { id: string; title: string; templateId: string; goalIds: string[]; createdAt: string }
export interface ExchangeOffer { id: string; ownerId: string; teach: string; learn: string; description: string; active: boolean; owner?: Person; reciprocal?: boolean }
export interface ExchangeRequest { id: string; requesterId: string; recipientId: string; offerId: string; requesterOfferId: string; status: 'pending' | 'active' | 'completed' | 'cancelled'; createdAt: string; requester?: Person; recipient?: Person; teach: string; learn: string }
export interface Connection { peer: Person; kind: 'mentorship' | 'exchange' }
export interface MentorshipSummary { id: string; studentId: string; mentorId: string; status: string; createdAt: string; mentor: Person; student: Person }
export interface ProgressReport {
  mentorshipId: string; mentor: Person; student: Person; status: string
  assigned: number; submitted: number; accepted: number; revisions: number
  endorsedSkills: string[]; evidence: Evidence[]
  timeline: { at: string; event: string; title: string }[]
}
