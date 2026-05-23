import { motion } from 'framer-motion'
import FeedbackDashboard from '../components/feedback/FeedbackDashboard'

const Analytics = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
        <p className="text-gray-400 mt-1">
          Track your progress and identify areas for improvement
        </p>
      </motion.div>

      <FeedbackDashboard />
    </div>
  )
}

export default Analytics