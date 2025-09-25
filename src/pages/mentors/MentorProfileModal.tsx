import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Star,
  MapPin,
  Clock,
  Award,
  MessageCircle,
  Video,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'

interface MentorProfileModalProps {
  isOpen: boolean
  onClose: () => void
  mentor: {
    id: string
    name: string
    title: string
    company: string
    avatar: string
    location: string
    rating: number
    reviewCount: number
    hourlyRate: number
    experience: string
    availability: string
    skills: string[]
    bio: string
    specializations: string[]
    languages: string[]
    isVerified: boolean
    isOnline: boolean
    responseTime: string
    sessionCount: number
    successRate: number
  }
}

const MentorProfileModal: React.FC<MentorProfileModalProps> = ({ isOpen, onClose, mentor }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview')
  const [showFullBio, setShowFullBio] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const reviews = [
    {
      id: '1',
      student: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        title: 'Frontend Developer'
      },
      rating: 5,
      comment: 'Alex was incredibly helpful in guiding me through my product management transition. His insights on stakeholder management were invaluable.',
      date: '2 weeks ago',
      sessionType: 'Career Guidance'
    },
    {
      id: '2',
      student: {
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        title: 'Product Manager'
      },
      rating: 5,
      comment: 'Excellent mentor! Helped me understand product strategy and gave me practical frameworks I could apply immediately.',
      date: '1 month ago',
      sessionType: 'Product Strategy'
    },
    {
      id: '3',
      student: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        title: 'Software Engineer'
      },
      rating: 4,
      comment: 'Great session on leadership skills. Alex provided actionable advice and helped me create a development plan.',
      date: '1 month ago',
      sessionType: 'Leadership'
    }
  ]

  const availability = [
    { day: 'Monday', slots: ['9:00 AM', '2:00 PM', '4:00 PM'] },
    { day: 'Tuesday', slots: ['10:00 AM', '3:00 PM'] },
    { day: 'Wednesday', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] },
    { day: 'Thursday', slots: ['11:00 AM', '2:00 PM'] },
    { day: 'Friday', slots: ['9:00 AM', '3:00 PM'] },
    { day: 'Saturday', slots: ['10:00 AM'] },
    { day: 'Sunday', slots: [] }
  ]

  const achievements = [
    { title: 'Top Rated Mentor', description: 'Consistently rated 4.9+ stars', icon: Star },
    { title: 'High Success Rate', description: '94% of students achieve their goals', icon: TrendingUp },
    { title: 'Experienced', description: '8+ years in product management', icon: Award },
    { title: 'Active', description: '156+ mentoring sessions completed', icon: Users }
  ]

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
            className="relative bg-white rounded-xl shadow-strong w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Avatar
                      src={mentor.avatar}
                      fallback={mentor.name}
                      size="2xl"
                      status={mentor.isOnline ? 'online' : 'offline'}
                    />
                    {mentor.isVerified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">{mentor.name}</h2>
                    <p className="text-neutral-600">{mentor.title}</p>
                    <p className="text-sm text-neutral-500">{mentor.company}</p>
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
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={isFavorited ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Rating and Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-orange-500 fill-current" />
                    <span className="text-lg font-semibold">{mentor.rating}</span>
                    <span className="text-neutral-500">({mentor.reviewCount} reviews)</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-600">${mentor.hourlyRate}/hr</div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {mentor.sessionCount} sessions
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {mentor.successRate}% success
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {mentor.responseTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'reviews', label: `Reviews (${mentor.reviewCount})` },
                { id: 'availability', label: 'Availability' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-neutral-700 leading-relaxed">
                      {showFullBio ? mentor.bio : `${mentor.bio.substring(0, 200)}...`}
                    </p>
                    {mentor.bio.length > 200 && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="text-primary-600 hover:text-primary-700 text-sm mt-2 flex items-center"
                      >
                        {showFullBio ? (
                          <>
                            Show less <ChevronUp className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Show more <ChevronDown className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Specializations</h3>
                    <div className="space-y-2">
                      {mentor.specializations.map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success-500" />
                          <span className="text-neutral-700">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.languages.map((language) => (
                        <Badge key={language} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <achievement.icon className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900">{achievement.title}</h4>
                            <p className="text-sm text-neutral-600">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar
                            src={review.student.avatar}
                            fallback={review.student.name}
                            size="sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-neutral-900">{review.student.name}</h4>
                                <p className="text-sm text-neutral-600">{review.student.title}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? 'text-orange-500 fill-current' : 'text-neutral-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-neutral-500">{review.date}</span>
                              </div>
                            </div>
                            <p className="text-neutral-700 mb-2">{review.comment}</p>
                            <Badge variant="secondary" size="sm">{review.sessionType}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'availability' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Available Time Slots</h3>
                    <Badge variant="success">{mentor.availability}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availability.map((day) => (
                      <Card key={day.day}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {day.slots.length > 0 ? (
                            <div className="space-y-2">
                              {day.slots.map((slot) => (
                                <button
                                  key={slot}
                                  className="w-full text-left px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-500">Not available</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-600">
                  <p>Ready to start your mentorship journey?</p>
                  <p className="font-medium">Book a session or send a message to get started.</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="secondary">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="primary">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default MentorProfileModal

