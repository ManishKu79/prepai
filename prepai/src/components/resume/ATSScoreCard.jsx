import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

const ATSScoreCard = ({ score, feedback }) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreMessage = () => {
    if (score >= 80) return 'Excellent! Your resume is well-optimized'
    if (score >= 60) return 'Good, but there\'s room for improvement'
    return 'Needs significant improvement'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">ATS Score</h3>
        <TrendingUp className="h-5 w-5 text-gray-500" />
      </div>

      <div className="text-center mb-4">
        <div className={`text-5xl font-bold ${getScoreColor()} mb-2`}>
          {score}
        </div>
        <div className="text-gray-400 text-sm">{getScoreMessage()}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${score}%`,
            backgroundColor: score >= 80 ? '#10b981' : score >= 60 ? '#eab308' : '#ef4444'
          }}
        />
      </div>

      {/* Feedback */}
      <div className="space-y-2">
        <p className="text-gray-300 text-sm font-medium mb-2">Key Feedback:</p>
        {feedback.map((item, index) => (
          <div key={index} className="flex items-start space-x-2">
            {item.type === 'positive' ? (
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
            )}
            <span className="text-gray-400 text-sm">{item.message}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default ATSScoreCard