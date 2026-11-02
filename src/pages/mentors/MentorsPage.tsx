import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Video,
  Award,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown,
  X,
  Heart,
  Share2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

import { type ExperienceLevel, type MentorAvailability } from '@/lib/mentorFilters'
import { api } from '@/lib/api'
import type { MentorListing } from '@/types/api'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

const MentorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel>('')
  const [selectedAvailability, setSelectedAvailability] = useState<'' | MentorAvailability>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const skills = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java',
    'Product Management', 'UI/UX Design', 'Data Science', 'Machine Learning',
    'DevOps', 'AWS', 'Leadership', 'Communication', 'Project Management'
  ]

  const experienceLevels = [
    { value: 'junior', label: 'Junior (1-3 years)' },
    { value: 'mid', label: 'Mid-level (3-7 years)' },
    { value: 'senior', label: 'Senior (7+ years)' },
    { value: 'executive', label: 'Executive (10+ years)' }
  ]

  const availabilityOptions = [
    { value: 'immediate', label: 'Available Now' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'flexible', label: 'Flexible' }
  ]

  const [mentors, setMentors] = useState<MentorListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [reload, setReload] = useState(0)
  const [connecting, setConnecting] = useState<string | null>(null)
  const { user } = useAuthStore()
  const filterKey = JSON.stringify([searchTerm, selectedSkills, selectedExperience, selectedAvailability, priceRange])
  const [previousFilters, setPreviousFilters] = useState(filterKey)
  if (previousFilters !== filterKey) {
    setPreviousFilters(filterKey)
    setPage(1)
  }
  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setLoadError('')
    const [search, skills, experience, availability, prices] = JSON.parse(filterKey)
    const query = new URLSearchParams({ search, skills: skills.join(','), experience, availability,
      minPrice: String(prices[0]), maxPrice: String(prices[1]), page: String(page) })
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/mentors?' + query, { signal: controller.signal })
        const body = await response.json()
        if (!response.ok) throw new Error(body.message ?? 'Unable to load mentors')
        setMentors(body.data)
        setTotal(body.pagination.total)
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(error instanceof Error ? error.message : 'Unable to load mentors')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 200)
    return () => { clearTimeout(timer); controller.abort() }
  }, [filterKey, page, reload])
  const filteredMentors = isLoading || loadError ? [] : mentors
  const connect = async (mentorId: string) => {
    setConnecting(mentorId)
    try {
      await api('/mentorships', { method: 'POST', body: JSON.stringify({ mentorId }) })
      toast.success('Mentorship request sent')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send request')
    } finally {
      setConnecting(null)
    }
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setSelectedExperience('')
    setSelectedAvailability('')
    setPriceRange([0, 200])
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
            <h1 className="text-3xl font-bold text-neutral-900">Find Your Mentor</h1>
            <p className="text-neutral-600 mt-2">
              Connect with industry experts who can guide your career growth.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-3">
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search mentors by name, skills, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-neutral-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Skills */}
              <div>
                <label className="label">Skills</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {skills.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="label">Experience Level</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value as ExperienceLevel)}
                  className="input"
                >
                  <option value="">Any level</option>
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="label">Availability</label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value as '' | MentorAvailability)}
                  className="input"
                >
                  <option value="">Any time</option>
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="label">Hourly Rate</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600">$</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="input w-20"
                      min="0"
                    />
                    <span className="text-sm text-neutral-600">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="input w-20"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Selected Filters */}
        {(selectedSkills.length > 0 || selectedExperience || selectedAvailability) && (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => toggleSkill(skill)}>
                {skill} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedExperience && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedExperience('')}>
                {experienceLevels.find(l => l.value === selectedExperience)?.label} <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {selectedAvailability && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedAvailability('')}>
                {availabilityOptions.find(a => a.value === selectedAvailability)?.label} <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
          </div>
        )}
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <p className="text-neutral-600">
            {total} mentor{total !== 1 ? 's' : ''} found
          </p>
        </div>

        {isLoading && <p role="status">Loading mentors…</p>}
        {loadError && <div role="alert">{loadError} <Button onClick={() => setReload(value => value + 1)}>Retry</Button></div>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar
                        src={mentor.avatar}
                        fallback={mentor.name}
                        size="lg"
                        status={mentor.isOnline ? 'online' : 'offline'}
                      />
                      {mentor.isVerified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Award className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">{mentor.name}</h3>
                          <p className="text-neutral-600">{mentor.title}</p>
                          <p className="text-sm text-neutral-500">{mentor.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary-600">${mentor.hourlyRate}/hr</div>
                          <div className="flex items-center space-x-1 text-sm text-neutral-600">
                            <Star className="h-4 w-4 text-orange-500 fill-current" />
                            <span>{mentor.rating}</span>
                            <span>({mentor.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {mentor.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {mentor.experience}
                        </div>
                      </div>

                      <p className="text-sm text-neutral-700 mt-3 line-clamp-2">{mentor.bio}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {mentor.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.skills.length > 3 && (
                          <Badge variant="secondary" size="sm">
                            +{mentor.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                        <div className="flex items-center space-x-4 text-xs text-neutral-500">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {mentor.sessionCount} sessions
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {mentor.successRate}% success
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="primary" size="sm" disabled={user?.role !== 'student' || connecting !== null} onClick={() => void connect(mentor.id)}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {!isLoading && !loadError && total > 20 && <div className="flex gap-3 mt-6">
          <Button disabled={page === 1} onClick={() => setPage(value => value - 1)}>Previous</Button>
          <span>Page {page} of {Math.ceil(total / 20)}</span>
          <Button disabled={page * 20 >= total} onClick={() => setPage(value => value + 1)}>Next</Button>
        </div>}
        {/* Empty State */}
        {!isLoading && !loadError && filteredMentors.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No mentors found</h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search criteria or filters to find the perfect mentor.
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default MentorsPage

