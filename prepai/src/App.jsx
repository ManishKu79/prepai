import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import MockInterview from './pages/MockInterview'
import CodingPractice from './pages/CodingPractice'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import CodeReview from './pages/CodeReview'
import LeaderboardPage from './pages/LeaderboardPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="coding-practice" element={<CodingPractice />} />
          <Route path="code-review" element={<CodeReview />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-gray-400 text-lg mb-2">Page Not Found</p>
              <p className="text-gray-500 mb-6">The page you're looking for doesn't exist</p>
              <a href="/" className="text-blue-500 hover:text-blue-400 transition-colors">
                Go Back Home →
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App