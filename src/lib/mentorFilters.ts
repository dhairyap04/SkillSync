export type ExperienceLevel = '' | 'junior' | 'mid' | 'senior' | 'executive'
export type MentorAvailability = 'immediate' | 'this-week' | 'next-week' | 'flexible'

export interface FilterableMentor {
  name: string
  company: string
  skills: string[]
  experienceYears: number
  availabilityValue: MentorAvailability
  hourlyRate: number
}

export interface MentorFilters {
  searchTerm: string
  selectedSkills: string[]
  selectedExperience: ExperienceLevel
  selectedAvailability: '' | MentorAvailability
  priceRange: [number, number]
}

export function filterMentors<T extends FilterableMentor>(mentors: T[], filters: MentorFilters): T[] {
  const query = filters.searchTerm.trim().toLowerCase()
  return mentors.filter(mentor => {
    const matchesSearch = [mentor.name, mentor.company, ...mentor.skills]
      .some(value => value.toLowerCase().includes(query))
    const matchesSkills = filters.selectedSkills.length === 0 ||
      filters.selectedSkills.some(skill => mentor.skills.includes(skill))
    // The displayed ranges intentionally overlap at 3 and 7 years.
    const years = mentor.experienceYears
    const matchesExperience = filters.selectedExperience === '' ||
      (filters.selectedExperience === 'junior' && years >= 1 && years <= 3) ||
      (filters.selectedExperience === 'mid' && years >= 3 && years <= 7) ||
      (filters.selectedExperience === 'senior' && years >= 7) ||
      (filters.selectedExperience === 'executive' && years >= 10)
    const matchesAvailability = filters.selectedAvailability === '' ||
      mentor.availabilityValue === filters.selectedAvailability
    const matchesPrice = mentor.hourlyRate >= filters.priceRange[0] &&
      mentor.hourlyRate <= filters.priceRange[1]
    return matchesSearch && matchesSkills && matchesExperience && matchesAvailability && matchesPrice
  })
}
