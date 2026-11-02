import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface HeaderProps {
  variant?: 'landing' | 'dashboard'
}

const Header: React.FC<HeaderProps> = ({ variant = 'landing' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const location = useLocation()

  const navigation = [
    { name: 'Features', href: '/#features' },
    { name: 'About', href: '/#about' },
    { name: 'Pricing', href: '/#pricing' },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
    } catch {
      toast.error('Could not sign out. Please try again.')
    }
  }

  if (variant === 'dashboard') {
    return (
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gradient">SkillSync</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search mentors, skills, resources..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <Avatar
                    src={user?.avatar}
                    fallback={`${user?.firstName} ${user?.lastName}`}
                    size="sm"
                    status="online"
                  />
                  <ChevronDown className="h-4 w-4 text-neutral-600" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-neutral-200 py-1 z-50"
                    >
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gradient">SkillSync</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  location.pathname === item.href
                    ? 'text-primary-600'
                    : 'text-neutral-600'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Avatar
                  src={user?.avatar}
                  fallback={`${user?.firstName} ${user?.lastName}`}
                  size="sm"
                />
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-200"
            >
              <div className="py-4 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm font-medium text-neutral-600 hover:text-primary-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-neutral-200 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Dashboard
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block">
                        <Button variant="ghost" size="sm" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup" className="block">
                        <Button variant="primary" size="sm" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header

