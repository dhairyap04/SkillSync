import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  BookOpen,
  TrendingUp,
  Star,
  Play,
  Quote,
  Award,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Smart Goal Setting',
      description: 'Set and track career goals with AI-powered recommendations and milestone tracking.',
      color: 'text-primary-600'
    },
    {
      icon: TrendingUp,
      title: 'Skill Development',
      description: 'Track your skills progress with visual analytics and personalized learning paths.',
      color: 'text-teal-600'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Connect with industry professionals who can guide your career journey.',
      color: 'text-orange-600'
    },
    {
      icon: BookOpen,
      title: 'Curated Resources',
      description: 'Access personalized learning resources tailored to your goals and interests.',
      color: 'text-success-600'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Mentors Available', value: '2.5K+', icon: Award },
    { label: 'Skills Tracked', value: '100K+', icon: TrendingUp },
    { label: 'Success Stories', value: '15K+', icon: Star }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'SkillSync helped me transition from marketing to software engineering. The mentorship program was incredible!',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Manager',
      company: 'Microsoft',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'The skill tracking feature gave me clear visibility into my growth. I landed my dream job within 6 months.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'Figma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'As a mentor, I love how easy it is to track my mentees\' progress and provide targeted guidance.',
      rating: 5
    }
  ]

  const benefits = [
    'AI-powered career recommendations',
    'Personalized learning paths',
    'Industry expert mentorship',
    'Real-time progress tracking',
    'Skill certification programs',
    'Networking opportunities'
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-teal-50">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Zap className="w-3 h-3 mr-1" />
                  New: AI Career Coach
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Accelerate Your{' '}
                  <span className="text-gradient">Career Growth</span>
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed">
                  Connect with expert mentors, track your skills progress, and achieve your career goals with our comprehensive platform designed for ambitious professionals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button variant="primary" size="xl" className="w-full sm:w-auto">
                    Get Started as Student
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/signup?role=mentor">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Join as Mentor
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-success-500" />
                  <span>Secure & private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-success-500" />
                  <span>Global community</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-strong p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Progress</h3>
                    <Badge variant="success">On Track</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>React Development</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary-500 to-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Product Management</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Leadership Skills</span>
                        <span>40%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                        size="sm"
                        status="online"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Alex Thompson</p>
                        <p className="text-xs text-neutral-500">Your mentor</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg">
                <Award className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-teal-500 text-white p-3 rounded-full shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-600 rounded-full">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-neutral-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to grow your career
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to accelerate your professional development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full bg-neutral-100 mb-4 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-neutral-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Why choose SkillSync?
              </h2>
              <p className="text-xl text-neutral-600 mb-8">
                Join thousands of professionals who have accelerated their careers with our platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0" />
                    <span className="text-neutral-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-strong p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Join Our Community</h3>
                    <p className="text-neutral-600">Connect with like-minded professionals</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <span className="font-medium">Students</span>
                      <Badge variant="primary">45,000+</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <span className="font-medium">Mentors</span>
                      <Badge variant="teal">2,500+</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <span className="font-medium">Success Rate</span>
                      <Badge variant="success">94%</Badge>
                    </div>
                  </div>
                  
                  <Button variant="primary" className="w-full">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              What our users say
            </h2>
            <p className="text-xl text-neutral-600">
              Real stories from professionals who transformed their careers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-orange-500 fill-current" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-primary-200 mb-4" />
                    <p className="text-neutral-700 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={testimonial.avatar}
                        fallback={testimonial.name}
                        size="sm"
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-neutral-500">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              About SkillSync
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We're on a mission to democratize career development by connecting ambitious professionals with expert mentors and providing the tools they need to succeed.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold mb-6">Our Story</h3>
              <div className="space-y-4 text-neutral-700">
                <p>
                  Founded in 2024, SkillSync was born from a simple observation: career growth shouldn't be limited by your network or resources. We believe everyone deserves access to world-class mentorship and personalized learning paths.
                </p>
                <p>
                  Our platform combines the power of AI-driven matching with human expertise to create meaningful mentor-student relationships that drive real career outcomes.
                </p>
                <p>
                  Today, we're proud to support thousands of professionals across industries, from fresh graduates to seasoned executives looking to level up their skills.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="text-center p-6 bg-primary-50 rounded-xl">
                <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
                <div className="text-neutral-600">Active Users</div>
              </div>
              <div className="text-center p-6 bg-teal-50 rounded-xl">
                <div className="text-3xl font-bold text-teal-600 mb-2">2.5K+</div>
                <div className="text-neutral-600">Expert Mentors</div>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">15K+</div>
                <div className="text-neutral-600">Success Stories</div>
              </div>
              <div className="text-center p-6 bg-success-50 rounded-xl">
                <div className="text-3xl font-bold text-success-600 mb-2">94%</div>
                <div className="text-neutral-600">Success Rate</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-neutral-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Choose the plan that fits your career development needs. Start free and upgrade as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Free</h3>
                  <div className="text-4xl font-bold mb-6">
                    $0<span className="text-lg text-neutral-500">/month</span>
                  </div>
                  <p className="text-neutral-600 mb-8">Perfect for getting started with your career development journey.</p>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Track up to 5 skills</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Set 3 career goals</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Access basic resources</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Community support</span>
                    </li>
                  </ul>
                  
                  <Link to="/signup">
                    <Button variant="secondary" className="w-full">
                      Get Started Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full border-2 border-primary-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="primary" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Pro</h3>
                  <div className="text-4xl font-bold mb-6">
                    $29<span className="text-lg text-neutral-500">/month</span>
                  </div>
                  <p className="text-neutral-600 mb-8">For professionals serious about accelerating their career growth.</p>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Unlimited skills tracking</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Unlimited goals</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Premium resources library</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>1-on-1 mentor sessions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Advanced analytics</span>
                    </li>
                  </ul>
                  
                  <Link to="/signup">
                    <Button variant="primary" className="w-full">
                      Start Pro Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                  <div className="text-4xl font-bold mb-6">
                    Custom<span className="text-lg text-neutral-500">/month</span>
                  </div>
                  <p className="text-neutral-600 mb-8">For organizations looking to develop their teams at scale.</p>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Team management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Dedicated support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>Advanced reporting</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3" />
                      <span>SSO & security</span>
                    </li>
                  </ul>
                  
                  <Button variant="secondary" className="w-full">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to accelerate your career?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who are already growing with SkillSync. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="secondary" size="xl">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="ghost" size="xl" className="text-white border-white hover:bg-white hover:text-primary-600">
                  Watch Demo
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage

