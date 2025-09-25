import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'

// Dashboard Layout
import DashboardLayout from '@/components/layout/DashboardLayout'
import StudentDashboard from '@/pages/dashboard/StudentDashboard'
import MentorDashboard from '@/pages/dashboard/MentorDashboard'

// Feature Pages
import SkillsPage from '@/pages/skills/SkillsPage'
import MentorsPage from '@/pages/mentors/MentorsPage'
import ResourcesPage from '@/pages/resources/ResourcesPage'
import MessagesPage from '@/pages/messages/MessagesPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import GoalsPage from '@/pages/goals/GoalsPage'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// Role-based Route Component
const RoleBasedRoute: React.FC<{ 
  studentComponent: React.ComponentType
  mentorComponent: React.ComponentType
}> = ({ studentComponent: StudentComponent, mentorComponent: MentorComponent }) => {
  const { user } = useAuthStore()
  
  if (user?.role === 'mentor') {
    return <MentorComponent />
  }
  
  return <StudentComponent />
}

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <RoleBasedRoute 
              studentComponent={StudentDashboard}
              mentorComponent={MentorDashboard}
            />
          } />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="mentors" element={<MentorsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="goals" element={<GoalsPage />} />
          {/* Add more dashboard routes here */}
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
