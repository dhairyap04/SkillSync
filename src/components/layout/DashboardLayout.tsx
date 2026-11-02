import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Button } from '@/components/ui/Button'

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const location = useLocation()
  useEffect(() => { setMobileMenuOpen(false) }, [location.pathname])

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gradient">SkillSync</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isCollapsed={sidebarCollapsed} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl"
            >
              <Sidebar />
            </motion.div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <Header variant="dashboard" />
          </div>

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout

