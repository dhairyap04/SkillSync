import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'mentor']),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()
  
  const roleParam = searchParams.get('role') as 'student' | 'mentor' | null

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: roleParam || 'student',
    },
  })

  const watchedPassword = watch('password')
  const watchedRole = watch('role')

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(watchedPassword || '')
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      const user = await authApi.signup({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password, role: data.role, agreeToTerms: data.agreeToTerms })
      login(user)
      toast.success(`Welcome to SkillSync, ${data.firstName}!`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = (provider: string) => {
    toast.error(`${provider} sign-in is not available yet. Use email and password.`)
    // Implement social signup logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-gradient">SkillSync</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <p className="text-neutral-600">
              Join thousands of professionals growing their careers
            </p>
          </CardHeader>
          
          <CardContent>
            {/* Role Selection */}
            <div className="mb-6">
              <label className="label">I want to join as a</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    value="student"
                    className="sr-only"
                    {...register('role')}
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchedRole === 'student'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}>
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-1">Student</div>
                      <div className="text-sm text-neutral-600">Learn and grow your skills</div>
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    value="mentor"
                    className="sr-only"
                    {...register('role')}
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchedRole === 'mentor'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}>
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-1">Mentor</div>
                      <div className="text-sm text-neutral-600">Share your expertise</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name"
                  placeholder="John"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last name"
                  placeholder="Doe"
                  leftIcon={<User className="h-4 w-4" />}
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <Input
                label="Email address"
                type="email"
                placeholder="john@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')}
                />
                {watchedPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-600">Password strength</span>
                      <span className={`font-medium ${
                        passwordStrength < 2 ? 'text-red-600' :
                        passwordStrength < 3 ? 'text-orange-600' :
                        passwordStrength < 4 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    {...register('agreeToTerms')}
                  />
                  <span className="text-sm text-neutral-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isLoading}
              >
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleSocialSignup('Google')}
                  className="w-full"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleSocialSignup('LinkedIn')}
                  className="w-full"
                >
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default SignupPage

