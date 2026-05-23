import { motion } from 'framer-motion'
import { Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react'

const SuggestionsList = ({ suggestions }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-500 bg-red-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'low': return 'text-blue-500 bg-blue-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <Lightbulb className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <h3 className="text-white font-semibold mb-4">Improvement Suggestions</h3>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className={`p-1.5 rounded-lg ${getPriorityColor(suggestion.priority)}`}>
              {getPriorityIcon(suggestion.priority)}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{suggestion.title}</p>
              <p className="text-gray-400 text-xs mt-1">{suggestion.description}</p>
              {suggestion.example && (
                <p className="text-gray-500 text-xs mt-1 italic">Example: {suggestion.example}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default SuggestionsList