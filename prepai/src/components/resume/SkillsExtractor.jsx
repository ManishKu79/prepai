import { motion } from 'framer-motion'
import { Code, Brain, Globe, Database, Layout, Server } from 'lucide-react'

const SkillsExtractor = ({ skills }) => {
  const getSkillIcon = (skill) => {
    const icons = {
      'javascript': Code,
      'python': Brain,
      'react': Layout,
      'node': Server,
      'mongodb': Database,
      'html': Globe
    }
    const Icon = icons[skill.toLowerCase()] || Code
    return <Icon className="h-4 w-4" />
  }

  const getSkillLevel = (skill) => {
    // Mock levels - in real app, this would come from AI analysis
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    return levels[Math.floor(Math.random() * levels.length)]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <h3 className="text-white font-semibold mb-4">Extracted Skills</h3>
      
      {skills.length === 0 ? (
        <p className="text-gray-500 text-sm">No skills detected. Try a clearer resume format.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-help">
                {getSkillIcon(skill)}
                <span className="text-gray-300 text-sm">{skill}</span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Level: {getSkillLevel(skill)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default SkillsExtractor