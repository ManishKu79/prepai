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
  Loader2
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { stats, skills, loading, error, fetchDashboardData } = useDashboardStore()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const statsCards = [
    {
      title: 'Interviews Completed',
      value: stats.interviewsCompleted,
      icon: Briefcase,
      trend: stats.interviewsCompleted > 0 ? 12 : 0,
      color: 'blue',
    },
    {
      title: 'Coding Accuracy',
      value: `${stats.codingAccuracy}%`,
      icon: Target,
      trend: stats.codingAccuracy > 0 ? 5 : 0,
      color: 'green',
    },
    {
      title: 'Weekly Streak',
      value: `${stats.weeklyStreak} days`,
      icon: Calendar,
      trend: 0,
      color: 'orange',
    },
    {
      title: 'Communication Score',
      value: `${stats.communicationScore}%`,
      icon: MessageSquare,
      trend: stats.communicationScore > 0 ? 8 : 0,
      color: 'purple',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => fetchDashboardData()}
          className="mt-2 text-sm text-blue-500 hover:text-blue-400"
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
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-gray-400 mt-1">
          {stats.interviewsCompleted === 0 && stats.codingAccuracy === 0
            ? "Start your placement preparation journey today!"
            : "Great progress! Keep up the momentum."}
        </p>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      
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
        <h3 className="text-white font-semibold mb-4">Skills Breakdown</h3>
        {skills.every(skill => skill.score === 0) ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Complete interviews to see your skill analysis</p>
            <Link to="/dashboard/mock-interview" className="text-blue-500 text-sm mt-2 inline-block">
              Start your first interview →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">{skill.name}</span>
                  <span className="text-sm text-gray-400">{skill.score}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${skill.score}%`,
                      backgroundColor: skill.color
                    }}
                  />
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
        <Link to="/dashboard/mock-interview">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors text-left">
            <div className="flex items-center space-x-2 mb-2">
              <Mic className="h-5 w-5" />
              <span className="font-semibold">Start Mock Interview</span>
            </div>
            <p className="text-sm text-blue-200">Practice with AI interviewer</p>
          </button>
        </Link>
        
        <Link to="/dashboard/coding-practice">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors text-left">
            <div className="flex items-center space-x-2 mb-2">
              <Code2 className="h-5 w-5" />
              <span className="font-semibold">Coding Challenge</span>
            </div>
            <p className="text-sm text-green-200">Solve DSA problems</p>
          </button>
        </Link>
        
        <Link to="/dashboard/resume-analyzer">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors text-left">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Analyze Resume</span>
            </div>
            <p className="text-sm text-purple-200">Get ATS score and suggestions</p>
          </button>
        </Link>
      </motion.div>
    </div>
  )
}

export default Dashboard