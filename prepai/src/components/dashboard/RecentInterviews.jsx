import { motion } from 'framer-motion'
import { Calendar, Award, ChevronRight } from 'lucide-react'
import useDashboardStore from '../../store/dashboardStore'

const RecentInterviews = () => {
  const { recentActivity } = useDashboardStore()
  
  const getTypeColor = (type) => {
    switch(type) {
      case 'interview': return 'text-blue-500 bg-blue-500/10'
      case 'technical': return 'text-blue-500 bg-blue-500/10'
      case 'coding': return 'text-green-500 bg-green-500/10'
      case 'resume': return 'text-purple-500 bg-purple-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }
  
  const getTypeIcon = (type) => {
    switch(type) {
      case 'interview': return '🎤'
      case 'technical': return '💻'
      case 'coding': return '⌨️'
      case 'resume': return '📄'
      default: return '📊'
    }
  }
  
  if (recentActivity.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
        <p className="text-gray-400">No activity yet</p>
        <p className="text-gray-500 text-sm mt-1">Complete an interview or coding challenge to see activity here</p>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recent Activity</h3>
        <button className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {recentActivity.slice(0, 5).map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${getTypeColor(activity.type)}`}>
                {getTypeIcon(activity.type)}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{activity.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                  <Award className="h-3 w-3 text-gray-500 ml-2" />
                  <span className={`text-xs ${activity.score >= 70 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {activity.score}%
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RecentInterviews