import React, { useState } from 'react'
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

const MentorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState('')
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

  const mentors = [
    {
      id: '1',
      name: 'Alex Thompson',
      title: 'Senior Product Manager',
      company: 'Google',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      rating: 4.9,
      reviewCount: 47,
      hourlyRate: 120,
      experience: '8 years',
      availability: 'Available this week',
      skills: ['Product Management', 'Leadership', 'Strategy', 'Agile'],
      bio: 'Experienced product manager with 8+ years at top tech companies. I help professionals transition into PM roles and advance their careers.',
      specializations: ['Career Transition', 'Product Strategy', 'Team Leadership'],
      languages: ['English', 'Spanish'],
      isVerified: true,
      isOnline: true,
      responseTime: 'Usually responds within 2 hours',
      sessionCount: 156,
      successRate: 94
    },
    {
      id: '2',
      name: 'Sarah Chen',
      title: 'Lead UX Designer',
      company: 'Figma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      rating: 4.8,
      reviewCount: 32,
      hourlyRate: 95,
      experience: '6 years',
      availability: 'Available now',
      skills: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research'],
      bio: 'Passionate about creating user-centered designs. I mentor designers at all levels and help them build strong portfolios.',
      specializations: ['Portfolio Review', 'Design Systems', 'User Research'],
      languages: ['English', 'Mandarin'],
      isVerified: true,
      isOnline: true,
      responseTime: 'Usually responds within 1 hour',
      sessionCount: 89,
      successRate: 96
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      title: 'Senior Software Engineer',
      company: 'Microsoft',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Seattle, WA',
      rating: 4.9,
      reviewCount: 28,
      hourlyRate: 110,
      experience: '10 years',
      availability: 'Next week',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'System Design'],
      bio: 'Full-stack engineer with expertise in modern web technologies. I help developers level up their technical skills.',
      specializations: ['Technical Interviews', 'System Design', 'Code Review'],
      languages: ['English', 'Spanish'],
      isVerified: true,
      isOnline: false,
      responseTime: 'Usually responds within 4 hours',
      sessionCount: 124,
      successRate: 92
    },
    {
      id: '4',
      name: 'Emily Johnson',
      title: 'Data Science Manager',
      company: 'Netflix',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      rating: 4.7,
      reviewCount: 19,
      hourlyRate: 130,
      experience: '7 years',
      availability: 'Flexible',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Statistics'],
      bio: 'Data science leader helping professionals break into the field and advance their analytical skills.',
      specializations: ['Career Transition', 'ML Projects', 'Data Visualization'],
      languages: ['English'],
      isVerified: true,
      isOnline: true,
      responseTime: 'Usually responds within 3 hours',
      sessionCount: 67,
      successRate: 89
    }
  ]

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => mentor.skills.includes(skill))
    const matchesExperience = !selectedExperience || mentor.experience.includes(selectedExperience)
    const matchesAvailability = !selectedAvailability || 
                               mentor.availability.toLowerCase().includes(selectedAvailability)
    const matchesPrice = mentor.hourlyRate >= priceRange[0] && mentor.hourlyRate <= priceRange[1]
    
    return matchesSearch && matchesSkills && matchesExperience && matchesAvailability && matchesPrice
  })

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
                  onChange={(e) => setSelectedExperience(e.target.value)}
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
                  onChange={(e) => setSelectedAvailability(e.target.value)}
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
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
          </p>
        </div>

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
                          <Button variant="primary" size="sm">
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

        {/* Empty State */}
        {filteredMentors.length === 0 && (
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

