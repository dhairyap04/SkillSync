import { z } from 'zod'

const text = z.string().trim().min(1).max(200)
const link = z.string().url().max(2000).refine(value => /^https?:\/\//.test(value), 'Use an HTTP or HTTPS URL').or(z.literal(''))
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, 'Invalid date')
export const signupSchema = z.object({
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  firstName: text.min(2), lastName: text.min(2), role: z.enum(['student', 'mentor']),
  agreeToTerms: z.literal(true),
}).strict()
export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(1).max(128),
}).strict()
export const profileSchema = z.object({
  firstName: text.min(2), lastName: text.min(2), email: signupSchema.shape.email,
  bio: z.string().max(500), location: z.string().trim().max(200),
  company: z.string().trim().max(200), title: z.string().trim().max(200),
  website: link, linkedinUrl: link, githubUrl: link,
}).partial().strict()
export const mentorSchema = z.object({
  title: text, company: text, location: text, bio: z.string().trim().min(1).max(500),
  skills: z.array(text).min(1).max(30), experienceYears: z.number().int().min(0).max(80),
  hourlyRate: z.number().min(0).max(10000),
  availabilityValue: z.enum(['immediate', 'this-week', 'next-week', 'flexible']),
  specializations: z.array(text).max(20).default([]), languages: z.array(text).max(20).default([]),
}).strict()
export const skillSchema = z.object({
  name: text, category: text, proficiency: z.number().min(0).max(100),
  targetProficiency: z.number().min(0).max(100).optional(),
  evidence: z.array(z.object({
    id: text, type: z.enum(['project', 'certification', 'course', 'experience']),
    title: text, description: z.string().max(2000), url: link.optional(), date,
  }).strict()).max(100).default([]),
}).strict()
export const goalSchema = z.object({
  title: text, description: z.string().max(2000).default(''),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: date.optional(), skills: z.array(text).max(100).default([]),
  progress: z.number().min(0).max(100).default(0),
  milestones: z.array(z.object({ id: text, title: text, description: z.string().max(2000), completed: z.boolean(), dueDate: date.optional() }).strict()).max(100).default([]),
}).strict()
export const mentorQuerySchema = z.object({
  search: z.string().max(200).default(''), skills: z.string().max(2000).default(''),
  experience: z.enum(['', 'junior', 'mid', 'senior', 'executive']).default(''),
  availability: z.enum(['', 'immediate', 'this-week', 'next-week', 'flexible']).default(''),
  minPrice: z.coerce.number().min(0).default(0), maxPrice: z.coerce.number().min(0).default(10000),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict().refine(value => value.minPrice <= value.maxPrice, 'Invalid price range')
