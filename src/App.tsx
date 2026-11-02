import MentorshipsPage from '@/pages/growth/MentorshipsPage'
import ReportsPage from '@/pages/growth/ReportsPage'
import ExchangesPage from '@/pages/growth/ExchangesPage'
import RoadmapsPage from '@/pages/growth/RoadmapsPage'
import MatchesPage from '@/pages/growth/MatchesPage'
import PassportPage from '@/pages/growth/PassportPage'
import ChallengesPage from '@/pages/growth/ChallengesPage'
import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'

// Dashboard Layout
import DashboardLayout from '@/components/layout/DashboardLayout'
import StudentDashboard from '@/pages/dashboard/ProgressDashboard'
import MentorDashboard from '@/pages/dashboard/ProgressDashboard'

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
  const { isAuthenticated, isLoading, sessionError, restoreSession } = useAuthStore()
  useEffect(() => { void restoreSession() }, [restoreSession])
  if (isLoading) return <div className="p-8" role="status">Loading your session…</div>
  if (sessionError) return <div className="p-8" role="alert">{sessionError} <button onClick={() => void restoreSession()}>Retry</button></div>

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
        
        <Route path="/passport/:token" element={<PassportPage />} />
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
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="passport" element={<PassportPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="roadmaps" element={<RoadmapsPage />} />
          <Route path="exchanges" element={<ExchangesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="mentorships" element={<MentorshipsPage />} />
        </Route>

        <Route path="/skills/*" element={<Navigate to="/dashboard/skills" replace />} />
        <Route path="/goals/*" element={<Navigate to="/dashboard/goals" replace />} />
        <Route path="/mentors/*" element={<Navigate to="/dashboard/mentors" replace />} />
        <Route path="/messages/*" element={<Navigate to="/dashboard/messages" replace />} />
        <Route path="/profile/*" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="/resources/*" element={<Navigate to="/dashboard/resources" replace />} />
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
