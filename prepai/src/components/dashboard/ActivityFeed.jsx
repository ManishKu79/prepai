import { motion } from 'framer-motion'
import { Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react'

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      icon: CheckCircle,
      title: 'Completed Technical Interview',
      time: '2 hours ago',
      color: 'text-green-500',
    },
    {
      id: 2,
      icon: TrendingUp,
      title: 'Improved communication score by 15%',
      time: 'Yesterday',
      color: 'text-blue-500',
    },
    {
      id: 3,
      icon: Target,
      title: 'Resume score increased to 85%',
      time: '2 days ago',
      color: 'text-purple-500',
    },
    {
      id: 4,
      icon: Calendar,
      title: '5 day streak! Keep going!',
      time: '3 days ago',
      color: 'text-orange-500',
    },
  ]
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-white font-semibold mb-4">Activity Feed</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className={`p-2 rounded-lg bg-gray-800`}>
              <activity.icon className={`h-4 w-4 ${activity.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ActivityFeed