import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Award, Target, Calendar, Star, Activity } from 'lucide-react'

const FeedbackDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/feedback/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!analytics || analytics.totalInterviews === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
        <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Data Yet</h3>
        <p className="text-gray-400">
          Complete some mock interviews to see your performance analytics here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-4 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Interviews</span>
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white">{analytics.totalInterviews}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-xl p-4 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Average Score</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white">{analytics.averageScore}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-xl p-4 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Best Role</span>
            <Award className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-white capitalize">
            {analytics.rolePerformance[0]?.role || 'N/A'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-xl p-4 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Target Progress</span>
            <Target className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.min(100, Math.round((analytics.averageScore / 85) * 100))}%
          </div>
        </motion.div>
      </div>

      {/* Role Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 rounded-xl p-6 border border-gray-800"
      >
        <h3 className="text-white font-semibold mb-4">Performance by Role</h3>
        <div className="space-y-3">
          {analytics.rolePerformance.map((role, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 capitalize">{role.role}</span>
                <span className="text-gray-400">{role.averageScore}% ({role.interviews} interviews)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${role.averageScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Common Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-green-500" />
            <h3 className="text-white font-semibold">Top Strengths</h3>
          </div>
          <ul className="space-y-2">
            {analytics.commonStrengths.map((strength, idx) => (
              <li key={idx} className="text-gray-300 text-sm flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 rounded-xl p-6 border border-yellow-500/20"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-yellow-500" />
            <h3 className="text-white font-semibold">Areas to Improve</h3>
          </div>
          <ul className="space-y-2">
            {analytics.commonImprovements.map((improvement, idx) => (
              <li key={idx} className="text-gray-300 text-sm flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                {improvement}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default FeedbackDashboard