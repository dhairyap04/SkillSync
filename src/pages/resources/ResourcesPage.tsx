import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  BookOpen,
  Play,
  FileText,
  Headphones,
  ExternalLink,
  Bookmark,
  Star,
  Clock,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
  X,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>(['1', '3', '5'])

  const categories = [
    { id: 'all', name: 'All Categories', count: 156 },
    { id: 'programming', name: 'Programming', count: 45 },
    { id: 'design', name: 'Design', count: 32 },
    { id: 'business', name: 'Business', count: 28 },
    { id: 'data', name: 'Data Science', count: 25 },
    { id: 'marketing', name: 'Marketing', count: 18 },
    { id: 'product', name: 'Product Management', count: 8 }
  ]

  const types = [
    { id: 'all', name: 'All Types', icon: '📚' },
    { id: 'course', name: 'Course', icon: '🎓' },
    { id: 'article', name: 'Article', icon: '📄' },
    { id: 'video', name: 'Video', icon: '🎥' },
    { id: 'book', name: 'Book', icon: '📖' },
    { id: 'podcast', name: 'Podcast', icon: '🎧' },
    { id: 'tool', name: 'Tool', icon: '🛠️' }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ]

  const resources = [
    {
      id: '1',
      title: 'Complete React Developer Course',
      description: 'Master React from basics to advanced concepts including hooks, context, and performance optimization.',
      type: 'course',
      category: 'programming',
      difficulty: 'intermediate',
      duration: 45,
      provider: 'Udemy',
      rating: 4.8,
      reviewCount: 1247,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
      url: 'https://example.com',
      isFree: false,
      price: 89.99,
      currency: 'USD',
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
      progress: 65,
      status: 'in_progress',
      isRecommended: true,
      completionRate: 78
    },
    {
      id: '2',
      title: 'Design Systems: Building Scalable UI',
      description: 'Learn how to create and maintain design systems that scale across teams and products.',
      type: 'article',
      category: 'design',
      difficulty: 'intermediate',
      duration: 15,
      provider: 'Medium',
      rating: 4.6,
      reviewCount: 892,
      thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=200&fit=crop',
      url: 'https://example.com',
      isFree: true,
      tags: ['Design Systems', 'UI/UX', 'Figma', 'Scalability'],
      progress: 0,
      status: 'bookmarked',
      isRecommended: true,
      completionRate: 85
    },
    {
      id: '3',
      title: 'Product Management Fundamentals',
      description: 'Essential skills for product managers including strategy, roadmapping, and stakeholder management.',
      type: 'course',
      category: 'product',
      difficulty: 'beginner',
      duration: 32,
      provider: 'Coursera',
      rating: 4.7,
      reviewCount: 2156,
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
      url: 'https://example.com',
      isFree: false,
      price: 49.99,
      currency: 'USD',
      tags: ['Product Management', 'Strategy', 'Roadmapping', 'Leadership'],
      progress: 100,
      status: 'completed',
      isRecommended: false,
      completionRate: 92
    },
    {
      id: '4',
      title: 'The Lean Startup Methodology',
      description: 'Eric Ries explains how to build a sustainable business through validated learning and rapid iteration.',
      type: 'book',
      category: 'business',
      difficulty: 'intermediate',
      duration: 480,
      provider: 'Harper Business',
      rating: 4.5,
      reviewCount: 3421,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      url: 'https://example.com',
      isFree: false,
      price: 16.99,
      currency: 'USD',
      tags: ['Startup', 'Business', 'Innovation', 'Strategy'],
      progress: 0,
      status: 'not_started',
      isRecommended: true,
      completionRate: 67
    },
    {
      id: '5',
      title: 'Data Science with Python',
      description: 'Comprehensive guide to data analysis, machine learning, and visualization using Python.',
      type: 'course',
      category: 'data',
      difficulty: 'advanced',
      duration: 60,
      provider: 'edX',
      rating: 4.9,
      reviewCount: 1876,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      url: 'https://example.com',
      isFree: true,
      tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas'],
      progress: 30,
      status: 'in_progress',
      isRecommended: true,
      completionRate: 89
    },
    {
      id: '6',
      title: 'The Design of Everyday Things',
      description: 'Don Norman explores the fundamental principles of good design and user experience.',
      type: 'book',
      category: 'design',
      difficulty: 'beginner',
      duration: 360,
      provider: 'Basic Books',
      rating: 4.4,
      reviewCount: 2890,
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      url: 'https://example.com',
      isFree: false,
      price: 14.99,
      currency: 'USD',
      tags: ['Design', 'UX', 'Psychology', 'Usability'],
      progress: 0,
      status: 'not_started',
      isRecommended: false,
      completionRate: 73
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesType = selectedType === 'all' || resource.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty
  })

  const getTypeIcon = (type: string) => {
    const icons = {
      course: BookOpen,
      article: FileText,
      video: Play,
      book: BookOpen,
      podcast: Headphones,
      tool: Award
    }
    return icons[type as keyof typeof icons] || BookOpen
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-neutral-100 text-neutral-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-success-100 text-success-800',
      in_progress: 'bg-primary-100 text-primary-800',
      bookmarked: 'bg-orange-100 text-orange-800',
      not_started: 'bg-neutral-100 text-neutral-800'
    }
    return colors[status as keyof typeof colors] || 'bg-neutral-100 text-neutral-800'
  }

  const toggleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    )
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
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
            <h1 className="text-3xl font-bold text-neutral-900">Learning Resources</h1>
            <p className="text-neutral-600 mt-2">
              Discover curated resources to accelerate your learning journey.
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
              placeholder="Search resources by title, description, or tags..."
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="label">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="label">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input"
                >
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="label">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="input"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.id} value={difficulty.id}>
                      {difficulty.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="label">View</label>
                <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-700'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-700'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Recommended Section */}
      {filteredResources.some(r => r.isRecommended) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-neutral-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredResources.filter(r => r.isRecommended).map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="relative">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {resource.isRecommended && (
                        <Badge variant="warning" size="sm">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className="p-2 bg-white rounded-full shadow-soft hover:shadow-medium transition-shadow"
                      >
                        <Bookmark className={`h-4 w-4 ${
                          bookmarkedResources.includes(resource.id) ? 'text-orange-500 fill-current' : 'text-neutral-400'
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          {React.createElement(getTypeIcon(resource.type), { className: "h-4 w-4 text-primary-600" })}
                        </div>
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(resource.duration)}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-orange-500" />
                          {resource.rating}
                        </div>
                      </div>
                      <span className="text-xs">{resource.provider}</span>
                    </div>

                    {resource.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{resource.progress}%</span>
                        </div>
                        <Progress value={resource.progress} size="sm" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="secondary" size="sm">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary-600">
                        {resource.isFree ? 'Free' : `$${resource.price}`}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="primary" size="sm">
                          {resource.status === 'completed' ? 'Review' : 
                           resource.status === 'in_progress' ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">All Resources</h2>
          <p className="text-neutral-600">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className={cn(
          "gap-6",
          viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"
        )}>
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {viewMode === 'grid' ? (
                <Card hover className="h-full">
                  <div className="relative">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {resource.isRecommended && (
                        <Badge variant="warning" size="sm">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className="p-2 bg-white rounded-full shadow-soft hover:shadow-medium transition-shadow"
                      >
                        <Bookmark className={`h-4 w-4 ${
                          bookmarkedResources.includes(resource.id) ? 'text-orange-500 fill-current' : 'text-neutral-400'
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          {React.createElement(getTypeIcon(resource.type), { className: "h-4 w-4 text-primary-600" })}
                        </div>
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(resource.duration)}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-orange-500" />
                          {resource.rating}
                        </div>
                      </div>
                      <span className="text-xs">{resource.provider}</span>
                    </div>

                    {resource.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{resource.progress}%</span>
                        </div>
                        <Progress value={resource.progress} size="sm" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="secondary" size="sm">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary-600">
                        {resource.isFree ? 'Free' : `$${resource.price}`}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="primary" size="sm">
                          {resource.status === 'completed' ? 'Review' : 
                           resource.status === 'in_progress' ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card hover>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-primary-100 rounded">
                              {React.createElement(getTypeIcon(resource.type), { className: "h-4 w-4 text-primary-600" })}
                            </div>
                            <Badge className={getDifficultyColor(resource.difficulty)} size="sm">
                              {resource.difficulty}
                            </Badge>
                            {resource.isRecommended && (
                              <Badge variant="warning" size="sm">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleBookmark(resource.id)}
                              className="p-1 hover:bg-neutral-100 rounded"
                            >
                              <Bookmark className={`h-4 w-4 ${
                                bookmarkedResources.includes(resource.id) ? 'text-orange-500 fill-current' : 'text-neutral-400'
                              }`} />
                            </button>
                            <Badge className={getStatusColor(resource.status)} size="sm">
                              {resource.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {resource.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-neutral-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDuration(resource.duration)}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-orange-500" />
                              {resource.rating} ({resource.reviewCount})
                            </div>
                            <span>{resource.provider}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-bold text-primary-600">
                              {resource.isFree ? 'Free' : `$${resource.price}`}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="primary" size="sm">
                                {resource.status === 'completed' ? 'Review' : 
                                 resource.status === 'in_progress' ? 'Continue' : 'Start'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No resources found</h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search criteria or filters to find the perfect learning resource.
            </p>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Suggest a Resource
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ResourcesPage

