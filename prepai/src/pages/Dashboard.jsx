import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import useDashboardStore from '../store/dashboardStore'
import StatsCard from '../components/dashboard/StatsCard'
import ProgressChart from '../components/dashboard/ProgressChart'
import RecentInterviews from '../components/dashboard/RecentInterviews'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import { 
  Briefcase, 
  Target, 
  Calendar, 
  MessageSquare,
  FileText,
  Code2,
  Mic,
  Loader2,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { 
    stats, 
    skills, 
    loading, 
    error, 
    fetchDashboardData,
    weeklyProgress
  } = useDashboardStore()

  useEffect(() => {
    console.log('[Dashboard] Component mounted, fetching data...')
    fetchDashboardData()
  }, [])

  // Log data when it changes for debugging
  useEffect(() => {
    if (!loading) {
      console.log('[Dashboard] Stats updated:', stats)
      console.log('[Dashboard] Skills updated:', skills)
      console.log('[Dashboard] Weekly Progress:', weeklyProgress)
    }
  }, [loading, stats, skills, weeklyProgress])

  const statsCards = [
    {
      title: 'Interviews Completed',
      value: stats.interviewsCompleted,
      icon: Briefcase,
      trend: stats.interviewsCompleted > 0 ? 12 : 0,
      color: 'blue',
      subtitle: 'Total mock interviews'
    },
    {
      title: 'Coding Accuracy',
      value: `${stats.codingAccuracy}%`,
      icon: Target,
      trend: stats.codingAccuracy > 0 ? 5 : 0,
      color: 'green',
      subtitle: 'Based on submissions'
    },
    {
      title: 'Weekly Streak',
      value: `${stats.weeklyStreak} week${stats.weeklyStreak !== 1 ? 's' : ''}`,
      icon: Calendar,
      trend: 0,
      color: 'orange',
      subtitle: 'Consistent practice'
    },
    {
      title: 'Communication Score',
      value: `${stats.communicationScore}%`,
      icon: MessageSquare,
      trend: stats.communicationScore > 0 ? 8 : 0,
      color: 'purple',
      subtitle: 'HR & Behavioral'
    },
  ]

  // Calculate overall progress percentage
  const overallProgress = Math.round(
    (stats.interviewsCompleted * 10 + 
     stats.codingAccuracy + 
     stats.communicationScore) / 3
  )

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching your interview data</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <button 
          onClick={() => fetchDashboardData()}
          className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-gray-400 mt-1">
              {stats.interviewsCompleted === 0 && stats.codingAccuracy === 0
                ? "Ready to start your placement preparation journey?"
                : "Great progress! Keep up the momentum. You're doing amazing!"}
            </p>
          </div>
          
          {/* Overall Progress Circle */}
          {stats.interviewsCompleted > 0 && (
            <div className="flex items-center space-x-3 bg-gray-900/50 rounded-xl px-4 py-2 border border-gray-800">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#374151"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - overallProgress / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{overallProgress}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Overall Progress</p>
                <p className="text-sm font-semibold text-white">{stats.interviewsCompleted} interviews</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-400">Improvement</span>
          </div>
          <p className="text-lg font-bold text-white mt-1">
            {stats.interviewsCompleted > 0 ? '+15%' : '0%'}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-gray-400">Best Score</span>
          </div>
          <p className="text-lg font-bold text-white mt-1">
            {Math.max(stats.codingAccuracy, stats.communicationScore)}%
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-400">Current Streak</span>
          </div>
          <p className="text-lg font-bold text-white mt-1">
            {stats.weeklyStreak} {stats.weeklyStreak === 1 ? 'week' : 'weeks'}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-400">Target Progress</span>
          </div>
          <p className="text-lg font-bold text-white mt-1">
            {Math.min(100, Math.round((stats.interviewsCompleted / 20) * 100))}%
          </p>
        </div>
      </motion.div>
      
      {/* Charts and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
      
      {/* Recent Interviews */}
      <div className="grid grid-cols-1 gap-6">
        <RecentInterviews />
      </div>
      
      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 rounded-xl p-6 border border-gray-800"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Skills Breakdown</h3>
          {skills.every(skill => skill.score === 0) && (
            <span className="text-xs text-gray-500">Complete interviews to see analysis</span>
          )}
        </div>
        
        {skills.every(skill => skill.score === 0) ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No skill data available yet</p>
            <Link to="/dashboard/mock-interview" className="text-blue-500 text-sm mt-2 inline-block hover:text-blue-400">
              Start your first interview →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="group">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-sm text-gray-400">{skill.score}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
                {/* Skill level indicator */}
                <div className="mt-1">
                  {skill.score >= 80 ? (
                    <span className="text-xs text-green-500">★ Advanced</span>
                  ) : skill.score >= 60 ? (
                    <span className="text-xs text-yellow-500">◆ Intermediate</span>
                  ) : skill.score >= 40 ? (
                    <span className="text-xs text-blue-500">● Beginner</span>
                  ) : (
                    <span className="text-xs text-gray-500">○ Need Practice</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link to="/dashboard/mock-interview" className="group">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl transition-all duration-300 text-left shadow-lg hover:shadow-blue-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <Mic className="h-5 w-5" />
              </div>
              <span className="font-semibold">Start Mock Interview</span>
            </div>
            <p className="text-sm text-blue-200">Practice with AI interviewer and get feedback</p>
          </button>
        </Link>
        
        <Link to="/dashboard/coding-practice" className="group">
          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-xl transition-all duration-300 text-left shadow-lg hover:shadow-green-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="font-semibold">Coding Challenge</span>
            </div>
            <p className="text-sm text-green-200">Solve DSA problems and improve logic</p>
          </button>
        </Link>
        
        <Link to="/dashboard/resume-analyzer" className="group">
          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-4 rounded-xl transition-all duration-300 text-left shadow-lg hover:shadow-purple-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-semibold">Analyze Resume</span>
            </div>
            <p className="text-sm text-purple-200">Get ATS score and improvement suggestions</p>
          </button>
        </Link>
      </motion.div>

      {/* Motivational Quote when no activity */}
      {stats.interviewsCompleted === 0 && stats.codingAccuracy === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 text-center"
        >
          <p className="text-gray-300 italic">
            "The only way to do great work is to love what you do. Start your interview preparation today!"
          </p>
          <p className="text-gray-500 text-sm mt-2">— Steve Jobs</p>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard